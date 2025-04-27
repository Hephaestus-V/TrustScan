import { NextRequest, NextResponse } from 'next/server';
import { createThirdwebClient } from 'thirdweb';
import { fetchWalletData } from '@/lib/nebula';
import { analyzeThroughLLM } from '@/lib/openrouter';
import { cacheResult, checkCache } from '@/lib/cache';

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    // Ensure params is properly awaited 
    const address = await params.address;
    
    console.log("Fetching on-chain data using thirdweb Nebula AI API");
    
    try {
      // Check if we have a cached result first
      const cachedResult = await checkCache(address);
      if (cachedResult) {
        return NextResponse.json({
          success: true,
          source: 'cache',
          address,
          data: cachedResult
        });
      }
      
      // Fetch on-chain data using thirdweb Nebula AI API
      const walletData = await fetchWalletData(address);
      
      // Send to LLM for analysis
      const analysis = await analyzeThroughLLM(walletData, address);
      
      // Cache the result
      await cacheResult(address, analysis);
      
      // Return complete result
      return NextResponse.json({
        success: true,
        source: 'fresh',
        address,
        data: analysis,
        rawData: walletData
      });
    } catch (fetchError: any) {
      console.error('Error fetching wallet data:', fetchError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch wallet data',
          message: fetchError.message
        },
        { status: 422 }
      );
    }
  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to analyze address',
        message: error.message
      },
      { status: 500 }
    );
  }
} 