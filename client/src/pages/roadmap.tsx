import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Clock } from "lucide-react";


const roadmapPhases = [
  {
    phase: 1,
    title: "Genesis Launch",
    status: "completed",
    timeline: "Q1 2024 - COMPLETED",
    description: "Launch of 10,000 unique Viking warriors with legendary traits and attributes.",
    features: [
      { name: "NFT Collection Mint", completed: true },
      { name: "Community Building", completed: true },
      { name: "Discord & Social Launch", completed: true },
      { name: "Marketplace Integration", completed: true },
    ],
  },
  {
    phase: 2,
    title: "Valhalla Staking",
    status: "in-progress",
    timeline: "Q2 2024 - IN PROGRESS",
    description: "Launch of $ODIN token and comprehensive staking mechanism for all warriors.",
    features: [
      { name: "$ODIN Token Launch", completed: true },
      { name: "Staking Platform", completed: true },
      { name: "Enhanced Rewards", completed: false },
      { name: "Governance Features", completed: false },
    ],
  },
  {
    phase: 3,
    title: "Viking Raids",
    status: "upcoming",
    timeline: "Q3 2024 - UPCOMING",
    description: "Interactive gaming features including PvP battles and cooperative raid mechanics.",
    features: [
      { name: "PvP Battle System", completed: false },
      { name: "Raid Mechanics", completed: false },
      { name: "Leaderboards", completed: false },
      { name: "Special Events", completed: false },
    ],
  },
  {
    phase: 4,
    title: "Metaverse Expansion",
    status: "planned",
    timeline: "Q4 2024 - PLANNED",
    description: "3D Valhalla world with immersive experiences and cross-platform integration.",
    features: [
      { name: "3D Valhalla World", completed: false },
      { name: "VR/AR Integration", completed: false },
      { name: "Land Ownership", completed: false },
      { name: "Cross-chain Bridge", completed: false },
    ],
  },
];

const tokenDistribution = [
  { category: "Staking Rewards", percentage: 40, description: "Long-term holder incentives", color: "border-nordic-gold" },
  { category: "Community Treasury", percentage: 25, description: "DAO governance & events", color: "border-bronze" },
  { category: "Team & Development", percentage: 15, description: "2-year vesting schedule", color: "border-yellow-600" },
  { category: "Marketing & Partnerships", percentage: 10, description: "Growth initiatives", color: "border-blue-500" },
  { category: "Liquidity & Exchange", percentage: 10, description: "DEX pools & CEX listings", color: "border-purple-500" },
];

const tokenInfo = [
  { label: "Token Name", value: "Odin Token" },
  { label: "Symbol", value: "$ODIN" },
  { label: "Total Supply", value: "1,000,000,000" },
  { label: "Network", value: "Ethereum (ERC-20)" },
  { label: "Initial Price", value: "$0.001" },
];

const utilityFeatures = [
  "Governance voting rights",
  "Staking rewards multiplier",
  "In-game currency for battles",
  "Access to exclusive events",
  "NFT breeding & evolution",
];

export default function Roadmap() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-6 w-6 text-nordic-gold" />;
      default:
        return <Circle className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-500/50';
      case 'in-progress':
        return 'border-nordic-gold/50';
      default:
        return 'border-nordic-gold/20';
    }
  };

  const getTimelineColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'in-progress':
        return 'text-nordic-gold';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="font-cinzel font-bold text-4xl md:text-6xl text-white mb-6">
            The Viking <span className="text-nordic-gold" data-testid="text-roadmap-title">Journey</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto" data-testid="text-roadmap-description">
            Chart our course through the realms of development and expansion
          </p>
        </div>

        {/* Roadmap Timeline */}
        <div className="mb-20">
          <h2 className="font-cinzel font-bold text-3xl text-white text-center mb-12">
            Project Roadmap
          </h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-nordic-gold h-full hidden lg:block"></div>

            {roadmapPhases.map((phase, index) => (
              <div
                key={phase.phase}
                className={`relative flex flex-col lg:${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                } items-center mb-12`}
              >
                <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-8' : 'lg:pl-8'} mb-6 lg:mb-0`}>
                  <Card className={`bg-viking-dark ${getStatusColor(phase.status)}`}>
                    <CardContent className="p-8">
                      <div className="flex items-center mb-4">
                        <div className="bg-nordic-gold text-black w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mr-4">
                          {phase.phase}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-cinzel font-bold text-2xl text-white" data-testid={`phase-title-${phase.phase}`}>
                            {phase.title}
                          </h3>
                          <div className="flex items-center mt-1">
                            {getStatusIcon(phase.status)}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-300 mb-4" data-testid={`phase-description-${phase.phase}`}>
                        {phase.description}
                      </p>
                      <ul className="space-y-1 mb-4">
                        {phase.features.map((feature, featureIndex) => (
                          <li 
                            key={featureIndex} 
                            className={`text-sm flex items-center ${
                              feature.completed ? 'text-green-400' : 'text-gray-400'
                            }`}
                            data-testid={`feature-${phase.phase}-${featureIndex}`}
                          >
                            <span className="mr-2">{feature.completed ? '✓' : '○'}</span>
                            {feature.name}
                          </li>
                        ))}
                      </ul>
                      <div className={`text-sm font-semibold ${getTimelineColor(phase.status)}`} data-testid={`phase-timeline-${phase.phase}`}>
                        {phase.timeline}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="hidden lg:block w-6 h-6 bg-nordic-gold rounded-full absolute left-1/2 transform -translate-x-1/2 z-10"></div>

              </div>
            ))}
          </div>
        </div>

        

        {/* Token Distribution */}
        <Card className="bg-rune-gray border-nordic-gold/20">
          <CardHeader>
            <CardTitle className="font-cinzel font-bold text-3xl text-white text-center">
              $ODIN Token Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Distribution Chart */}
              <div className="space-y-6">
                {tokenDistribution.map((item, index) => (
                  <div
                    key={index}
                    className={`flex justify-between items-center p-4 bg-viking-dark rounded-lg border-l-4 ${item.color}`}
                    data-testid={`distribution-${index}`}
                  >
                    <div>
                      <div className="font-semibold text-white" data-testid={`distribution-category-${index}`}>
                        {item.category}
                      </div>
                      <div className="text-sm text-gray-400">{item.description}</div>
                    </div>
                    <div className="font-bold text-xl" style={{ color: item.color.replace('border-', '') }} data-testid={`distribution-percentage-${index}`}>
                      {item.percentage}%
                    </div>
                  </div>
                ))}
              </div>

              {/* Token Info */}
              <div className="bg-viking-dark rounded-xl p-6">
                <h3 className="font-cinzel font-bold text-2xl text-white mb-6">Token Information</h3>

                <div className="space-y-4">
                  {tokenInfo.map((info, index) => (
                    <div key={index} className="flex justify-between" data-testid={`token-info-${index}`}>
                      <span className="text-gray-400">{info.label}:</span>
                      <span className="text-white font-semibold">{info.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-nordic-gold/20">
                  <h4 className="font-semibold text-white mb-3">Utility Features</h4>
                  <ul className="text-sm text-gray-300 space-y-2">
                    {utilityFeatures.map((feature, index) => (
                      <li key={index} data-testid={`utility-feature-${index}`}>
                        • {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
