"use client"

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, SearchCode, Layers, BrainCircuit, ChevronRight, Shield, Lock } from 'lucide-react';

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

export default function Home() {
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
                />
                <Button className="w-full group relative overflow-hidden bg-[#1a1a2e] border-[#ff2a6d]/50 text-white">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Analyze 
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-[#ff2a6d] to-[#7b61ff]/80 group-hover:opacity-90 transition-opacity"></span>
                </Button>
              </div>
              {/* Placeholder for loading/error messages */}
              <div className="mt-4 text-sm text-muted-foreground"></div>
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
          {/* Placeholder Area for Results - Initially hidden or showing a prompt */}
          <Card className="bg-black/30 border border-white/10 shadow-xl backdrop-blur-xl h-full flex items-center justify-center min-h-[450px] p-8 card border-[#05d9e8]/20 shadow-[0_0_30px_-10px_rgba(5,217,232,0.2)]">
             <div className="text-center space-y-6">
               {/* Replaced with ShinySearchIcon component */}
               <ShinySearchIcon />
               <h3 className="text-2xl font-semibold text-white neon-text-cyan glitch-text" data-text="Ready to Analyze">Ready to Analyze</h3>
               <p className="text-muted-foreground max-w-md mx-auto text-[#d1d1e9]">
                 Enter a Rootstock address in the search field to generate a comprehensive trust analysis using AI.
               </p>
             </div>
          </Card>

          {/* ---- Results Sections (Placeholders using Card) ---- */}
          {/* Trust Score Dashboard Placeholder */}
          {/* <Card className="bg-card/60 border shadow-md">
               <CardHeader>
                 <CardTitle className="text-xl">Trust Score Dashboard</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="text-muted-foreground">[Trust Score Gauge and Classification Badge]</div>
                 <div className="text-muted-foreground mt-2">[Summary of Analysis]</div>
               </CardContent>
             </Card> */}

          {/* Factor Breakdown Placeholder */}
          {/* <Card className="bg-card/60 border shadow-md">
               <CardHeader>
                 <CardTitle className="text-xl">Factor Breakdown</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="text-muted-foreground">[Visual Representation of Scoring Factors]</div>
               </CardContent>
             </Card> */}

          {/* Data Visualization Placeholder */}
          {/* <Card className="bg-card/60 border shadow-md">
               <CardHeader>
                 <CardTitle className="text-xl">Wallet Activity Visualization</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="text-muted-foreground">[Charts showing activity, interactions, holdings]</div>
               </CardContent>
             </Card> */}
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
