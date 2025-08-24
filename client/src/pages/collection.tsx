import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import NftCard from "@/components/nft-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Nft } from "@shared/schema";

const categories = ["All", "Berserkers", "Shamans", "Jarls", "Valkyries"];

export default function Collection() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedNft, setSelectedNft] = useState<Nft | null>(null);

  const { data: nfts, isLoading, error } = useQuery({
    queryKey: ["/api/nfts"],
  });

  const filteredNfts = nfts?.filter((nft: Nft) => {
    if (selectedCategory === "All") return true;
    return nft.category === selectedCategory.slice(0, -1); // Remove 's' from category
  });

  const handleViewDetails = (nft: Nft) => {
    setSelectedNft(nft);
  };

  if (error) {
    return (
      <div className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-cinzel font-bold text-white mb-4">Error Loading Collection</h1>
          <p className="text-gray-400">Failed to load NFT collection. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="font-cinzel font-bold text-4xl md:text-6xl text-white mb-6">
            Viking <span className="text-nordic-gold" data-testid="text-collection-title">Warriors</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto" data-testid="text-collection-description">
            Discover legendary warriors, each with unique traits and powers forged in the fires of Norse mythology
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12 flex flex-wrap gap-4 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "default" : "secondary"}
              className={
                selectedCategory === category
                  ? "bg-nordic-gold text-black hover:bg-yellow-500"
                  : "bg-rune-gray text-white hover:bg-nordic-gold hover:text-black"
              }
              data-testid={`button-filter-${category.toLowerCase()}`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-viking-dark rounded-2xl overflow-hidden border border-nordic-gold/20">
                <Skeleton className="w-full h-64 bg-gray-700" />
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2 bg-gray-700" />
                  <Skeleton className="h-4 w-1/2 mb-4 bg-gray-700" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-20 bg-gray-700" />
                    <Skeleton className="h-10 w-24 bg-gray-700" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* NFT Grid */}
        {!isLoading && filteredNfts && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredNfts.map((nft: Nft) => (
              <NftCard
                key={nft.id}
                nft={nft}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredNfts && filteredNfts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg" data-testid="text-no-nfts">
              No warriors found in this category.
            </p>
          </div>
        )}

        {/* Load More Button */}
        {!isLoading && filteredNfts && filteredNfts.length > 0 && (
          <div className="text-center mt-12">
            <Button
              variant="secondary"
              size="lg"
              className="bg-rune-gray text-white hover:bg-nordic-gold hover:text-black font-semibold"
              data-testid="button-load-more"
            >
              Load More Warriors
            </Button>
          </div>
        )}

        {/* NFT Details Modal (Simple Implementation) */}
        {selectedNft && (
          <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedNft(null)}
            data-testid="modal-nft-details"
          >
            <div 
              className="bg-viking-dark rounded-2xl p-6 max-w-md w-full border border-nordic-gold/20"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedNft.imageUrl}
                alt={selectedNft.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
                data-testid={`modal-img-${selectedNft.tokenId}`}
              />
              <h2 className="font-cinzel font-bold text-2xl text-white mb-2" data-testid={`modal-name-${selectedNft.tokenId}`}>
                {selectedNft.name}
              </h2>
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-nordic-gold text-black" data-testid={`modal-rarity-${selectedNft.tokenId}`}>
                  {selectedNft.rarity}
                </Badge>
                <Badge variant="secondary" data-testid={`modal-category-${selectedNft.tokenId}`}>
                  {selectedNft.category}
                </Badge>
              </div>
              <p className="text-gray-300 mb-4">
                Token ID: #{selectedNft.tokenId}
              </p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-nordic-gold font-bold text-xl" data-testid={`modal-price-${selectedNft.tokenId}`}>
                  {selectedNft.price} ETH
                </span>
                {selectedNft.isStaked && (
                  <Badge className="bg-green-600 text-white">STAKED</Badge>
                )}
              </div>
              <Button
                onClick={() => setSelectedNft(null)}
                className="w-full bg-nordic-gold text-black hover:bg-yellow-500"
                data-testid={`modal-close-${selectedNft.tokenId}`}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
