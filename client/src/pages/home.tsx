import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Shield, Coins, Crown, Users, ChevronDown } from "lucide-react";
import vikingWarriorImage from "@assets/viking01_1756051824095.jpg";

export default function Home() {
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')",
          }}
        ></div>

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <div className="animate-float">
            <h1 className="font-cinzel font-bold text-5xl md:text-7xl lg:text-8xl text-white mb-6">
              <span className="text-nordic-gold" data-testid="text-hero-title">VALHALLA</span>
              <br />
              AWAITS
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed" data-testid="text-hero-description">
            Enter the realm of legendary Viking warriors. Collect, stake, and conquer in the most epic NFT adventure ever created.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/collection">
              <Button
                size="lg"
                className="bg-nordic-gold text-black hover:bg-yellow-500 transition-all transform hover:scale-105 animate-glow font-semibold"
                data-testid="button-explore-collection"
              >
                Explore Collection
              </Button>
            </Link>
            <Link href="/stake">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-nordic-gold text-nordic-gold hover:bg-nordic-gold hover:text-black transition-all transform hover:scale-105 font-semibold"
                data-testid="button-start-staking"
              >
                Start Staking
              </Button>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="text-nordic-gold text-2xl h-8 w-8" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-rune-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-cinzel font-bold text-nordic-gold mb-2" data-testid="stat-total-supply">
                {stats?.totalNfts?.toLocaleString() || "10,000"}
              </div>
              <div className="text-gray-400">Total Warriors</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-cinzel font-bold text-nordic-gold mb-2" data-testid="stat-floor-price">
                {stats?.floorPrice || "0.5"} ETH
              </div>
              <div className="text-gray-400">Floor Price</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-cinzel font-bold text-nordic-gold mb-2" data-testid="stat-total-rewards">
                {parseFloat(stats?.totalRewards || "250000") > 1000 
                  ? `${Math.floor(parseFloat(stats?.totalRewards || "250000") / 1000)}K+` 
                  : stats?.totalRewards || "250K+"}
              </div>
              <div className="text-gray-400">$ODIN Staked</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-cinzel font-bold text-nordic-gold mb-2" data-testid="stat-holders">
                {stats?.totalHolders?.toLocaleString() || "3,500"}
              </div>
              <div className="text-gray-400">Holders</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-cinzel font-bold text-4xl md:text-5xl text-white mb-6">
                The <span className="text-nordic-gold">Legend</span> Begins
              </h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed" data-testid="text-about-description-1">
                In the mystical realm of Valhalla, 10,000 legendary Viking warriors have risen from the mists of time. Each warrior carries unique traits, weapons, and powers forged in the fires of Norse mythology.
              </p>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed" data-testid="text-about-description-2">
                Join our community of digital Vikings, stake your warriors for $ODIN rewards, and participate in epic battles for glory and treasure.
              </p>
              <div className="flex space-x-6">
                <a href="https://discord.gg/valhalla" className="text-nordic-gold hover:text-yellow-500 transition-colors" data-testid="link-social-discord">
                  <i className="fab fa-discord text-3xl"></i>
                </a>
                <a href="https://twitter.com/valhalla_nft" className="text-nordic-gold hover:text-yellow-500 transition-colors" data-testid="link-social-twitter">
                  <i className="fab fa-twitter text-3xl"></i>
                </a>
                <a href="https://instagram.com/valhalla_nft" className="text-nordic-gold hover:text-yellow-500 transition-colors" data-testid="link-social-instagram">
                  <i className="fab fa-instagram text-3xl"></i>
                </a>
              </div>
            </div>
            <div className="relative">
              <img
                src={vikingWarriorImage}
                alt="Viking warrior with battle axe"
                className="rounded-2xl shadow-2xl w-full h-auto transform hover:scale-105 transition-transform duration-500"
                data-testid="img-about-hero"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 viking-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-cinzel font-bold text-4xl md:text-5xl text-white mb-6">
              Forge Your <span className="text-nordic-gold">Destiny</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto" data-testid="text-features-subtitle">
              Discover the powerful features that make Valhalla the ultimate Viking NFT experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-viking-dark/80 p-8 rounded-2xl border border-nordic-gold/20 hover:border-nordic-gold/50 transition-all transform hover:-translate-y-2">
              <div className="text-nordic-gold text-4xl mb-4">
                <Coins className="h-12 w-12" />
              </div>
              <h3 className="font-cinzel font-bold text-2xl text-white mb-4" data-testid="text-feature-stake-title">
                Stake & Earn
              </h3>
              <p className="text-gray-300 leading-relaxed" data-testid="text-feature-stake-description">
                Stake your Viking warriors to earn $ODIN tokens. The longer you stake, the greater your rewards in Valhalla's treasury.
              </p>
            </div>

            <div className="bg-viking-dark/80 p-8 rounded-2xl border border-nordic-gold/20 hover:border-nordic-gold/50 transition-all transform hover:-translate-y-2">
              <div className="text-nordic-gold text-4xl mb-4">
                <Crown className="h-12 w-12" />
              </div>
              <h3 className="font-cinzel font-bold text-2xl text-white mb-4" data-testid="text-feature-access-title">
                Exclusive Access
              </h3>
              <p className="text-gray-300 leading-relaxed" data-testid="text-feature-access-description">
                Holders gain access to exclusive Viking halls, special events, and early access to future collections and partnerships.
              </p>
            </div>

            <div className="bg-viking-dark/80 p-8 rounded-2xl border border-nordic-gold/20 hover:border-nordic-gold/50 transition-all transform hover:-translate-y-2">
              <div className="text-nordic-gold text-4xl mb-4">
                <Users className="h-12 w-12" />
              </div>
              <h3 className="font-cinzel font-bold text-2xl text-white mb-4" data-testid="text-feature-community-title">
                Strong Community
              </h3>
              <p className="text-gray-300 leading-relaxed" data-testid="text-feature-community-description">
                Join a brotherhood of Viking warriors. Participate in raids, governance decisions, and community-driven adventures.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
