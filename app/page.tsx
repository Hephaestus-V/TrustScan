"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, SearchCode, Layers, BrainCircuit, ChevronRight, Shield, Lock, AlertCircle, Check, AlertTriangle } from 'lucide-react';
import { TrustAnalysis } from '@/lib/openrouter';

const features = [
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: "Objective Trust Metrics",
    description: "Get unbiased trust scores based on comprehensive on-chain data analysis."
  },
  {
    icon: <SearchCode className="h-8 w-8 text-primary" />,
    title: "Prevent Scams",
    description: "Identify potentially malicious addresses before interacting with them."
  },
  {
    icon: <Layers className="h-8 w-8 text-primary" />,
    title: "Reputation-Gated Access",
    description: "Enable new possibilities for DeFi, DAOs, and marketplaces based on reputation."
  },
  {
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    title: "AI-Powered Analysis",
    description: "Leverage advanced AI to understand complex wallet behaviors and patterns."
  }
];

// Custom TrustScan Logo Component
const TrustScanLogo = () => (
  <div className="flex items-center gap-2">
    <div className="relative">
      <Shield className="h-9 w-9 text-primary filter drop-shadow-[0_0_5px_#ff2a6d]" />
      <Lock className="h-4 w-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 filter drop-shadow-[0_0_3px_#05d9e8]" />
      <div className="absolute -inset-1 blur-lg bg-[#ff2a6d]/30 rounded-full -z-10"></div>
    </div>
    <div className="font-bold text-2xl md:text-3xl neon-text">
      <span className="bg-gradient-to-r from-[#f1f1f9] to-[#e6e6fa] bg-clip-text text-transparent">Trust</span>
      <span className="bg-gradient-to-r from-[#ff2a6d] to-[#ff2a6d]/80 bg-clip-text text-transparent">Scan</span>
    </div>
  </div>
);

// Custom Shiny SearchCode Icon Component
const ShinySearchIcon = () => (
  <div className="relative inline-flex items-center justify-center">
    {/* Base circle with gradient */}
    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ff2a6d]/20 via-[#ff2a6d]/60 to-[#05d9e8]/20 animate-pulse"></div>
    
    {/* Main icon background */}
    <div className="relative p-4 rounded-full bg-black/70 backdrop-blur-sm border border-[#05d9e8]/30 overflow-hidden shadow-[0_0_15px_rgba(255,42,109,0.5)]">
      {/* Shine effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shine"></div>
      {/* The actual icon */}
      <SearchCode className="h-12 w-12 text-[#05d9e8] relative z-10 filter drop-shadow-[0_0_5px_#05d9e8]" strokeWidth={1.5} />
    </div>
    
    {/* Outer glow */}
    <div className="absolute -inset-2 rounded-full bg-[#05d9e8]/20 blur-md -z-10"></div>
  </div>
);

// Trust Score Component
const TrustScoreGauge = ({ score, classification }: { score: number, classification: string }) => {
  // Color mapping based on score
  const getColor = () => {
    if (score <= 20) return '#FF4136'; // Red - High Risk
    if (score <= 40) return '#FF851B'; // Orange - Suspicious
    if (score <= 60) return '#FFDC00'; // Yellow - Neutral/New
    if (score <= 80) return '#2ECC40'; // Light Green - Trusted
    return '#01FF70'; // Green - Highly Trusted
  };

  const color = getColor();
  const rotation = (score / 100) * 180;
  
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-48 h-24 overflow-hidden">
        {/* Semi-circle background */}
        <div className="absolute w-48 h-48 rounded-full bg-black/30 top-0"></div>
        
        {/* Colored portion based on score */}
        <div 
          className="absolute w-48 h-48 rounded-full top-0 bg-gradient-to-r"
          style={{ 
            background: `conic-gradient(${color} 0deg, ${color} ${score * 1.8}deg, transparent ${score * 1.8}deg, transparent 360deg)` 
          }}
        ></div>
        
        {/* Gauge mask - only show top half */}
        <div className="absolute w-48 h-24 bg-[#1a1a2e] bottom-0"></div>
        
        {/* Needle */}
        <div 
          className="absolute w-1 h-24 bg-white top-0 left-1/2 transform -translate-x-1/2 origin-bottom z-10"
          style={{ transform: `translateX(-50%) rotate(${rotation - 90}deg)` }}
        >
          <div className="w-3 h-3 rounded-full bg-white absolute -top-1 -left-1"></div>
        </div>
        
        {/* Center point */}
        <div className="absolute w-4 h-4 rounded-full bg-white bottom-0 left-1/2 transform -translate-x-1/2 z-20"></div>
        
        {/* Score text */}
        <div className="absolute w-full text-center bottom-2 text-2xl font-bold text-white z-30">{score}</div>
      </div>
      
      {/* Classification badge */}
      <div 
        className="px-4 py-2 rounded-full font-bold text-black"
        style={{ backgroundColor: color }}
      >
        {classification}
      </div>
    </div>
  );
};

// Factor Card Component
const FactorCard = ({ factor }: { factor: { name: string; score: number; description: string } }) => {
  // Color based on score impact (modified from the original to reflect the scoring system)
  const getColor = () => {
    // Since factor scores range from -25 to +15, map them to colors differently
    const score = factor.score;
    if (score <= -15) return '#FF4136'; // Very negative - Red
    if (score < 0) return '#FF851B'; // Negative - Orange 
    if (score === 0) return '#FFDC00'; // Neutral - Yellow
    if (score <= 10) return '#2ECC40'; // Positive - Light Green
    return '#01FF70'; // Very positive - Green
  };
  
  // Format the score for display with a + sign for positive scores
  const formattedScore = factor.score > 0 ? `+${factor.score}` : factor.score;
  
  return (
    <Card className="bg-black/30 border border-white/10 hover:border-[#05d9e8]/40 transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getColor() }}></div>
          {factor.name}
          <span className="ml-auto text-sm font-normal" style={{ color: getColor() }}>
            {formattedScore} points
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[#d1d1e9]">{factor.description}</p>
      </CardContent>
    </Card>
  );
};

export default function Home() {
  // State variables
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<TrustAnalysis | null>(null);
  
  // Function to handle address analysis
  const analyzeAddress = async () => {
    // Basic validation
    if (!address || !address.startsWith('0x')) {
      setError('Please enter a valid Rootstock address (starting with 0x)');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/analyze/${address}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to analyze address');
      }
      
      setAnalysis(data.data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while analyzing the address');
      setAnalysis(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-foreground font-[family-name:var(--font-geist-sans)]">
      {/* Header with improved logo */}
      <header className="py-6 px-8 bg-black/30 backdrop-blur-md shadow-lg border-b border-[#ff2a6d]/20 sticky top-0 z-10 shadow-[0_5px_15px_-5px_rgba(255,42,109,0.2)]">
        <div className="container mx-auto flex items-center justify-between">
          <TrustScanLogo />
          <div className="hidden md:flex items-center gap-8">
            <p className="text-muted-foreground text-[#d1d1e9]">AI-Powered Reputation System for Rootstock</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Input and Info */}
        <div className="md:col-span-1 space-y-8">
          {/* Address Input & Search Section - Glass card */}
          <Card className="bg-black/30 border border-white/10 shadow-xl backdrop-blur-xl hover:shadow-primary/5 transition duration-300 neon-border bg-[#1a1a2e]/80 border-[#05d9e8]/20 hover:border-[#05d9e8]/40 shadow-[0_0_20px_-5px_rgba(5,217,232,0.3)]">
            <CardHeader>
              <CardTitle className="text-xl text-white neon-text-cyan">Analyze Rootstock Address</CardTitle>
              <CardDescription className="text-[#d1d1e9]">Enter an address to begin analysis.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-y-3 flex-col">
                <Input
                  type="text"
                  placeholder="Enter Rootstock address (0x...)"
                  className="bg-[#0a0a16]/40 border-[#7b61ff]/30 focus:border-[#7b61ff]/70 focus:ring-[#7b61ff]/30"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <Button 
                  className="w-full group relative overflow-hidden bg-[#1a1a2e] border-[#ff2a6d]/50 text-white"
                  onClick={analyzeAddress}
                  disabled={isLoading}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? 'Analyzing...' : 'Analyze'} 
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-[#ff2a6d] to-[#7b61ff]/80 group-hover:opacity-90 transition-opacity"></span>
                </Button>
              </div>
              {/* Loading/error messages */}
              {error && (
                <div className="mt-4 text-sm text-red-500 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Information Section with Feature Cards */}
          <div className="space-y-4">
             <h2 className="text-2xl font-semibold text-center md:text-left text-white neon-text">Why TrustScan?</h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
              {features.map((feature, index) => (
                <Card key={index} className="bg-black/30 border border-white/10 shadow-md backdrop-blur-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 card hover:border-[#05d9e8]/40">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                      <div className="p-2 rounded-full bg-[#ff2a6d]/10 flex items-center justify-center">
                        <div className="filter drop-shadow-[0_0_3px_#ff2a6d]">
                          {feature.icon}
                        </div>
                      </div>
                      <CardTitle className="text-lg text-white neon-text">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed text-[#d1d1e9]">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Results Dashboard */}
        <div className="md:col-span-2 space-y-8">
          {!analysis ? (
            // Placeholder Area for Results - Initially or when no analysis
            <Card className="bg-black/30 border border-white/10 shadow-xl backdrop-blur-xl h-full flex items-center justify-center min-h-[450px] p-8 card border-[#05d9e8]/20 shadow-[0_0_30px_-10px_rgba(5,217,232,0.2)]">
              <div className="text-center space-y-6">
                {isLoading ? (
                  <>
                    <div className="w-16 h-16 border-4 border-t-[#05d9e8] border-b-[#05d9e8] border-l-transparent border-r-transparent rounded-full animate-spin mx-auto"></div>
                    <h3 className="text-2xl font-semibold text-white neon-text-cyan">Analyzing Address</h3>
                    <p className="text-muted-foreground max-w-md mx-auto text-[#d1d1e9]">
                      We're collecting on-chain data and performing AI analysis. This may take a moment...
                    </p>
                  </>
                ) : (
                  <>
                    <ShinySearchIcon />
                    <h3 className="text-2xl font-semibold text-white neon-text-cyan glitch-text" data-text="Ready to Analyze">Ready to Analyze</h3>
                    <p className="text-muted-foreground max-w-md mx-auto text-[#d1d1e9]">
                      Enter a Rootstock address in the search field to generate a comprehensive trust analysis using AI.
                    </p>
                  </>
                )}
              </div>
            </Card>
          ) : (
            // Analysis Results
            <div className="space-y-8">
              {/* Trust Score Dashboard */}
              <Card className="bg-black/30 border border-white/10 shadow-xl backdrop-blur-xl card border-[#05d9e8]/20">
                <CardHeader>
                  <CardTitle className="text-xl text-white neon-text-cyan">Trust Score Dashboard</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center md:flex-row gap-8">
                  <TrustScoreGauge 
                    score={analysis.trustScore} 
                    classification={analysis.classification} 
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 text-white">Analysis Summary</h3>
                    <p className="text-[#d1d1e9] leading-relaxed">{analysis.summary}</p>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>Standardized scoring system</span>
                      </div>
                      {analysis.riskAreas.length === 0 ? (
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500" />
                          <span>No risk areas detected</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          <span>{analysis.riskAreas.length} risk areas detected</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Factor Breakdown */}
              <Card className="bg-black/30 border border-white/10 shadow-xl backdrop-blur-xl card border-[#05d9e8]/20">
                <CardHeader>
                  <CardTitle className="text-xl text-white neon-text-cyan">Trust Factors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysis.factors.map((factor, index) => (
                      <FactorCard key={index} factor={factor} />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations & Risk Areas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Recommendations */}
                <Card className="bg-black/30 border border-white/10 shadow-xl backdrop-blur-xl card border-[#05d9e8]/20">
                  <CardHeader>
                    <CardTitle className="text-lg text-white neon-text-cyan">Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-[#d1d1e9]">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Risk Areas */}
                <Card className="bg-black/30 border border-white/10 shadow-xl backdrop-blur-xl card border-[#05d9e8]/20">
                  <CardHeader>
                    <CardTitle className="text-lg text-white neon-text-cyan">Risk Areas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analysis.riskAreas.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-4 text-center">
                        <div className="p-2 rounded-full bg-green-500/20 mb-2">
                          <Check className="h-8 w-8 text-green-500" />
                        </div>
                        <p className="text-sm text-[#d1d1e9]">No risk areas detected for this address</p>
                      </div>
                    ) : (
                      <ul className="space-y-2">
                        {analysis.riskAreas.map((risk, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-[#d1d1e9]">
                            <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="text-center py-6 px-8 mt-12 text-sm text-muted-foreground border-t border-[#7b61ff]/10 text-[#d1d1e9]">
        <div className="container mx-auto">
          TrustScan Hackathon Project | Built with Next.js, Tailwind CSS, shadcn/ui, and AI
        </div>
      </footer>
    </div>
  );
}
