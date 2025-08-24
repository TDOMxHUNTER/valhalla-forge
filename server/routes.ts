import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFaucetClaimSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get global stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getGlobalStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Get NFTs with pagination and filtering
  app.get("/api/nfts", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      const nfts = await storage.getNfts(limit, offset);
      res.json(nfts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch NFTs" });
    }
  });

  // Get single NFT
  app.get("/api/nfts/:id", async (req, res) => {
    try {
      const nft = await storage.getNft(req.params.id);
      if (!nft) {
        return res.status(404).json({ message: "NFT not found" });
      }
      res.json(nft);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch NFT" });
    }
  });

  // Get user's NFTs
  app.get("/api/users/:userId/nfts", async (req, res) => {
    try {
      const nfts = await storage.getNftsByOwner(req.params.userId);
      res.json(nfts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user NFTs" });
    }
  });

  // Get user's staked NFTs
  app.get("/api/users/:userId/staked", async (req, res) => {
    try {
      const stakedNfts = await storage.getStakedNftsByOwner(req.params.userId);
      
      // Get staking rewards for each NFT
      const nftsWithRewards = await Promise.all(
        stakedNfts.map(async (nft) => {
          const reward = await storage.getStakingReward(req.params.userId, nft.id);
          return {
            ...nft,
            earnedRewards: reward?.rewardsEarned || "0",
            daysSinceStaked: nft.stakedAt ? 
              Math.floor((Date.now() - nft.stakedAt.getTime()) / (1000 * 60 * 60 * 24)) : 0
          };
        })
      );
      
      res.json(nftsWithRewards);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch staked NFTs" });
    }
  });

  // Stake NFT
  app.post("/api/nfts/:id/stake", async (req, res) => {
    try {
      const nft = await storage.stakeNft(req.params.id);
      if (!nft) {
        return res.status(404).json({ message: "NFT not found" });
      }

      // Create staking reward record if it doesn't exist
      if (nft.ownerId) {
        const existingReward = await storage.getStakingReward(nft.ownerId, nft.id);
        if (!existingReward) {
          await storage.createStakingReward({
            userId: nft.ownerId,
            nftId: nft.id,
            rewardsEarned: "0",
          });
        }
      }

      res.json({ message: "NFT staked successfully", nft });
    } catch (error) {
      res.status(500).json({ message: "Failed to stake NFT" });
    }
  });

  // Unstake NFT
  app.post("/api/nfts/:id/unstake", async (req, res) => {
    try {
      const nft = await storage.unstakeNft(req.params.id);
      if (!nft) {
        return res.status(404).json({ message: "NFT not found" });
      }
      res.json({ message: "NFT unstaked successfully", nft });
    } catch (error) {
      res.status(500).json({ message: "Failed to unstake NFT" });
    }
  });

  // Claim staking rewards
  app.post("/api/users/:userId/claim-rewards", async (req, res) => {
    try {
      const stakedNfts = await storage.getStakedNftsByOwner(req.params.userId);
      let totalRewards = 0;

      for (const nft of stakedNfts) {
        const reward = await storage.getStakingReward(req.params.userId, nft.id);
        if (reward) {
          totalRewards += parseFloat(reward.rewardsEarned || "0");
          // Reset rewards after claiming
          await storage.updateStakingReward(req.params.userId, nft.id, "0");
        }
      }

      // Update user balance
      const user = await storage.getUser(req.params.userId);
      if (user) {
        const newBalance = (parseFloat(user.odinBalance || "0") + totalRewards).toString();
        await storage.updateUserBalance(req.params.userId, newBalance);
      }

      res.json({ 
        message: "Rewards claimed successfully", 
        amount: totalRewards.toString(),
        newBalance: user ? (parseFloat(user.odinBalance || "0") + totalRewards).toString() : "0"
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to claim rewards" });
    }
  });

  // Faucet claim
  app.post("/api/faucet/claim", async (req, res) => {
    try {
      const claimData = insertFaucetClaimSchema.parse(req.body);
      
      // Check if user exists
      let user = await storage.getUserByWallet(claimData.walletAddress);
      if (!user) {
        return res.status(404).json({ message: "User not found for this wallet address" });
      }

      // Check cooldown (24 hours)
      const lastClaim = await storage.getLastFaucetClaim(user.id);
      if (lastClaim) {
        const timeSinceLastClaim = Date.now() - lastClaim.claimedAt.getTime();
        const twentyFourHours = 24 * 60 * 60 * 1000;
        
        if (timeSinceLastClaim < twentyFourHours) {
          const timeLeft = twentyFourHours - timeSinceLastClaim;
          const hoursLeft = Math.floor(timeLeft / (60 * 60 * 1000));
          const minutesLeft = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
          
          return res.status(429).json({ 
            message: "Faucet claim on cooldown", 
            timeLeft: `${hoursLeft}h ${minutesLeft}m`
          });
        }
      }

      // Process claim
      const claimAmount = "100";
      const claim = await storage.createFaucetClaim({
        ...claimData,
        amount: claimAmount,
      });

      // Update user balance and last claim time
      const newBalance = (parseFloat(user.odinBalance || "0") + parseFloat(claimAmount)).toString();
      await storage.updateUserBalance(user.id, newBalance);
      await storage.updateLastFaucetClaim(user.id, new Date());

      res.json({ 
        message: "Faucet claim successful", 
        amount: claimAmount,
        newBalance 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to process faucet claim" });
    }
  });

  // Get user by wallet address
  app.get("/api/users/wallet/:address", async (req, res) => {
    try {
      const user = await storage.getUserByWallet(req.params.address);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
