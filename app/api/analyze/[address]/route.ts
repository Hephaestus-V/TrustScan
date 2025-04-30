import { NextRequest, NextResponse } from 'next/server';
import { createThirdwebClient } from 'thirdweb';
import { fetchWalletData } from '@/lib/nebula';
import { analyzeThroughLLM } from '@/lib/openrouter';
import { cacheResult, checkCache } from '@/lib/cache';

export async function GET(
  request: NextRequest,
  context: { params: { address: string } }
) {
  try {
    // Validate address parameter
    const address = context.params.address;
    
    if (!address || typeof address !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid address parameter',
        },
        { status: 400 }
      );
    }
    
    console.log(`Processing analysis request for address: ${address}`);
    
    try {
      // Fetch on-chain data using thirdweb Nebula AI API
      console.log(`Fetching on-chain data for address: ${address}`);
      // Fetch on-chain data using thirdweb Nebula AI API
      console.log(`Fetching on-chain data for address: ${address}`);
      const walletData = await fetchWalletData(address);
      
      // Send to LLM for analysis
      console.log(`Sending data to OpenRouter API for analysis`);
      const analysis = await analyzeThroughLLM(walletData, address);
      
      // Cache the result
      await cacheResult(address, analysis);
      
      // Return complete result
      console.log(`Analysis complete for address: ${address}`);
      return NextResponse.json({
        success: true,
        source: 'fresh',
        address,
        data: analysis,
        rawData: walletData
      });
    } catch (fetchError: any) {
      console.error(`Error processing address ${address}:`, fetchError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to analyze wallet data',
          message: fetchError.message,
          details: fetchError.stack
        },
        { status: 422 }
      );
    }
  } catch (error: any) {
    console.error('Unexpected API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process request',
        message: error.message,
        details: error.stack
      },
      { status: 500 }
    );
  }
} 