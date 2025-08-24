import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Coins } from "lucide-react";

const faucetSchema = z.object({
  walletAddress: z.string()
    .min(1, "Wallet address is required")
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address format"),
});

type FaucetForm = z.infer<typeof faucetSchema>;

export default function Faucet() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [claimStatus, setClaimStatus] = useState<{
    canClaim: boolean;
    timeLeft?: string;
    message: string;
  }>({ canClaim: true, message: "Available to claim" });

  const form = useForm<FaucetForm>({
    resolver: zodResolver(faucetSchema),
    defaultValues: {
      walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
    },
  });

  // Get user balance if wallet is provided
  const walletAddress = form.watch("walletAddress");
  const { data: user } = useQuery({
    queryKey: ["/api/users/wallet", walletAddress],
    enabled: !!walletAddress && faucetSchema.safeParse({ walletAddress }).success,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const faucetMutation = useMutation({
    mutationFn: async (data: FaucetForm) => {
      const response = await apiRequest("POST", "/api/faucet/claim", {
        userId: "demo-user", // In real app, get from auth
        walletAddress: data.walletAddress,
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setClaimStatus({
        canClaim: false,
        timeLeft: "23h 59m",
        message: "Claimed successfully! Next claim available in 24 hours."
      });
      toast({ 
        title: "Success!", 
        description: `Claimed ${data.amount} $ODIN tokens!` 
      });
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Failed to claim tokens";
      if (errorMessage.includes("cooldown")) {
        setClaimStatus({
          canClaim: false,
          timeLeft: "23h 45m",
          message: "Faucet claim on cooldown"
        });
      }
      toast({ 
        title: "Error", 
        description: errorMessage, 
        variant: "destructive" 
      });
    },
  });

  const onSubmit = (data: FaucetForm) => {
    faucetMutation.mutate(data);
  };

  return (
    <section className="py-20 bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="font-cinzel font-bold text-4xl md:text-6xl text-white mb-6">
            $ODIN <span className="text-nordic-gold" data-testid="text-faucet-title">Faucet</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto" data-testid="text-faucet-description">
            Claim free $ODIN tokens for testing and exploring the Valhalla ecosystem
          </p>
        </div>

        {/* Faucet Interface */}
        <Card className="bg-viking-dark border-nordic-gold/20 max-w-2xl mx-auto">
          <CardContent className="p-8">
            {/* Hero Image */}
            <div className="mb-8 relative rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=300"
                alt="Aurora borealis over Nordic landscape"
                className="w-full h-48 object-cover"
                data-testid="img-faucet-hero"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-viking-dark to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-nordic-gold text-6xl animate-float">
                  <Coins className="h-16 w-16" />
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="font-cinzel font-bold text-3xl text-white mb-4">Claim Your $ODIN</h2>
              <p className="text-gray-300 mb-6" data-testid="text-faucet-instructions">
                Get 100 free $ODIN tokens every 24 hours for testing purposes
              </p>

              {/* Current Balance */}
              <div className="bg-rune-gray rounded-lg p-4 mb-6">
                <div className="text-sm text-gray-400 mb-1">Your Current Balance</div>
                <div className="text-2xl font-bold text-nordic-gold" data-testid="text-current-balance">
                  {user?.odinBalance || "0"} $ODIN
                </div>
              </div>
            </div>

            {/* Faucet Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="walletAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white font-semibold">Wallet Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0x..."
                          className="bg-rune-gray border-nordic-gold/30 text-white focus:border-nordic-gold"
                          data-testid="input-wallet-address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Claim Status */}
                <div className={`p-4 rounded-lg border ${
                  claimStatus.canClaim 
                    ? 'bg-green-900/20 border-green-500/30' 
                    : 'bg-yellow-900/20 border-yellow-500/30'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={claimStatus.canClaim ? 'text-green-400' : 'text-yellow-400'}>
                      {claimStatus.canClaim ? '✓' : '⏱'} {claimStatus.message}
                    </span>
                    {claimStatus.timeLeft && (
                      <span className="text-gray-400 text-sm" data-testid="text-time-left">
                        Next claim in: {claimStatus.timeLeft}
                      </span>
                    )}
                  </div>
                </div>

                {/* Claim Button */}
                <Button
                  type="submit"
                  disabled={faucetMutation.isPending || !claimStatus.canClaim}
                  className="w-full bg-nordic-gold text-black hover:bg-yellow-500 transition-all transform hover:scale-105 animate-glow font-bold text-lg py-4"
                  data-testid="button-claim-tokens"
                >
                  {faucetMutation.isPending ? (
                    "Claiming..."
                  ) : (
                    <>
                      <Coins className="mr-2 h-5 w-5" />
                      Claim 100 $ODIN Tokens
                    </>
                  )}
                </Button>
              </form>
            </Form>

            {/* Faucet Rules */}
            <div className="bg-rune-gray/50 rounded-lg p-4 mt-6">
              <h3 className="font-cinzel font-bold text-white mb-2">Faucet Rules</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Maximum 100 $ODIN per claim</li>
                <li>• 24-hour cooldown between claims</li>
                <li>• Valid wallet address required</li>
                <li>• For testing purposes only</li>
                <li>• Subject to rate limiting</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Faucet Stats */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-cinzel font-bold text-nordic-gold mb-2" data-testid="stat-total-claimed">
              125,000
            </div>
            <div className="text-gray-400">Total Tokens Distributed</div>
          </div>

          <div className="text-center">
            <div className="text-4xl font-cinzel font-bold text-nordic-gold mb-2" data-testid="stat-unique-claimers">
              2,340
            </div>
            <div className="text-gray-400">Unique Claimers</div>
          </div>

          <div className="text-center">
            <div className="text-4xl font-cinzel font-bold text-nordic-gold mb-2" data-testid="stat-faucet-balance">
              500,000
            </div>
            <div className="text-gray-400">Faucet Balance</div>
          </div>
        </div>
      </div>
    </section>
  );
}
