import { WalletData } from './nebula';

// Interface for trust analysis results
export interface TrustAnalysis {
  trustScore: number;
  classification: string;
  summary: string;
  factors: {
    name: string;
    score: number;
    description: string;
  }[];
  recommendations: string[];
  riskAreas: string[];
}

/**
 * Analyzes wallet data through OpenRouter LLM API
 * @param walletData Formatted wallet data
 * @param address Rootstock address analyzed
 * @returns Trust analysis results
 */
export async function analyzeThroughLLM(walletData: WalletData, address: string): Promise<TrustAnalysis> {
  try {
    // Prepare prompt for analysis
    const prompt = createAnalysisPrompt(walletData, address);
    
    // Get API key
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    // Ensure API key is available
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY is not defined in environment variables');
    }

    
    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'TrustScan',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1:free', 
        messages: [
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
        max_tokens: 10000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenRouter API error details: ${errorText}`);
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Parse LLM response and convert to structured format
    return parseAnalysisResponse(data);
  } catch (error) {
    console.error('Error analyzing through LLM:', error);
    throw error;
  }
}

/**
 * Creates a prompt for the LLM to analyze wallet data
 * @param walletData Wallet data to analyze
 * @param address Rootstock address being analyzed
 * @returns Formatted prompt string
 */
function createAnalysisPrompt(walletData: WalletData, address: string): string {
  return `
You are TrustScan's reputation analyzer, an expert blockchain forensic system designed to evaluate wallet addresses on Rootstock and produce consistent trust scores. Your task is to analyze wallet data and produce a standardized trust evaluation.

ANALYSIS GUIDELINES
- Always use the EXACT same scoring methodology for consistent results
- Always produce scores between 0-100
- Always follow the scoring rubric exactly as defined below
- Never introduce random factors not specified in the scoring system
- Always show your mathematical calculations
- Format your output using the exact template provided

SCORING RUBRIC
Start with a base score of 50 points, then apply the following modifiers:

AGE FACTOR (Range: -25 to +15)
- Less than 7 days: -25 points
- 7-30 days: -15 points
- 31-90 days: -5 points
- 91-180 days: +5 points
- 181-365 days: +10 points
- Over 365 days: +15 points

TRANSACTION COUNT FACTOR (Range: -10 to +15)
- Analyze transaction velocity (tx count ÷ age in days)
- 0-2 tx/day: 0 points (neutral)
- 3-10 tx/day: +5 points
- 11-20 tx/day: +10 points
- 21-50 tx/day: +15 points
- 51-100 tx/day: -5 points (unusually high)
- Over 100 tx/day: -10 points (extremely high, potentially suspicious)

ADDRESS DIVERSITY FACTOR (Range: -10 to +15)
- Calculate unique address ratio: (unique addresses ÷ transaction count)
- 0-0.1: -10 points (very repetitive)
- 0.11-0.2: -5 points
- 0.21-0.4: 0 points (neutral)
- 0.41-0.6: +5 points
- 0.61-0.8: +10 points
- 0.81-1.0: +15 points (high diversity)

CONTRACT INTERACTION FACTOR (Range: -10 to +10)
- Recognized DeFi protocols (Uniswap, AAVE, etc.): +5 points
- NFT interactions: +5 points
- Multiple unique contract types: +5 points
- Interaction with any flagged/suspicious contracts: -10 points
- No contract interactions: -5 points
- Maximum total for this category: +10 points

TOKEN HOLDINGS FACTOR (Range: -15 to +15)
- Holds established tokens (ETH, BTC, stablecoins): +5 points
- Diverse portfolio (5+ different token types): +5 points
- Holds governance tokens: +5 points
- Holds NFTs: +5 points
- Extremely large token amounts for account age: -15 points
- Maximum total for this category: +15 points

TRUST CLASSIFICATION
Based on final score, assign one of these classifications:
- 0-20: "High Risk"
- 21-40: "Suspicious"
- 41-60: "New/Neutral"
- 61-80: "Trusted"
- 81-100: "Highly Trusted"

Please analyze the following wallet data:

ADDRESS: ${address}
ADDRESS AGE: ${walletData.addressAge}
TRANSACTION HISTORY: 
${JSON.stringify(walletData.transactionHistory, null, 2)}

TRANSACTION COUNT: ${walletData.transactionHistory.length}
UNIQUE ADDRESSES: ${walletData.uniqueInteractions}
CONTRACT INTERACTIONS: 
${JSON.stringify(walletData.contractInteractions, null, 2)}

TOKEN HOLDINGS: 
${JSON.stringify(walletData.tokenHoldings, null, 2)}

ACCOUNT BALANCE: ${walletData.accountBalance}

IMPORTANT: Your response MUST be a valid, parseable JSON object with NO explanatory text before or after. Follow this EXACT structure and include all required fields:

{
  "trustScore": number,
  "classification": string,
  "summary": string,
  "factors": [
    {
      "name": string,
      "score": number,
      "description": string
    }
  ],
  "recommendations": string[],
  "riskAreas": string[]
}

Your factors array should include:
1. Age Factor
2. Transaction Velocity Factor
3. Address Diversity Factor
4. Contract Interaction Factor
5. Token Holdings Factor

Make sure your summary includes the calculated trust score and explains the key factors influencing it. The recommendations should provide action items based on the analysis, and riskAreas should highlight any potential risks identified.

IMPORTANT: Do not use markdown formatting. Do not include backticks or code blocks. Return just the plain JSON object text that can be directly parsed.
`;
}

/**
 * Parses LLM API response to extract trust analysis
 * @param response Raw LLM API response
 * @returns Formatted trust analysis
 */
function parseAnalysisResponse(response: any): TrustAnalysis {
  try {
    // Extract content from LLM response
    if (!response.choices || !response.choices[0] || !response.choices[0].message) {
      console.error('Unexpected OpenRouter API response format:', JSON.stringify(response));
      throw new Error('Invalid response format from OpenRouter API');
    }
    
    const content = response.choices[0].message.content;
    
    if (!content) {
      throw new Error('Empty content in OpenRouter API response');
    }
    
    // Parse JSON from content
    let parsedData;
    try {
      parsedData = JSON.parse(content);
    } catch (jsonError) {
      console.error('Error parsing JSON from content:', content);
      throw new Error('Failed to parse JSON from OpenRouter response');
    }
    
    // Validate the required fields
    if (typeof parsedData.trustScore !== 'number') {
      console.warn('Missing or invalid trustScore in parsed data:', parsedData);
    }
    
    // Return with validation and defaults
    return {
      trustScore: parsedData.trustScore || 0,
      classification: parsedData.classification || 'Unknown',
      summary: parsedData.summary || 'Could not analyze address',
      factors: Array.isArray(parsedData.factors) ? parsedData.factors : [],
      recommendations: Array.isArray(parsedData.recommendations) ? parsedData.recommendations : [],
      riskAreas: Array.isArray(parsedData.riskAreas) ? parsedData.riskAreas : [],
    };
  } catch (error) {
    console.error('Error parsing LLM response:', error);
    // Return default analysis in case of error
    return {
      trustScore: 0,
      classification: 'Error',
      summary: 'There was an error analyzing this address',
      factors: [],
      recommendations: ['Try again later'],
      riskAreas: ['Analysis error'],
    };
  }
} 