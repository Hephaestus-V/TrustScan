import { createThirdwebClient } from 'thirdweb';

// Interface for wallet data response
export interface WalletData {
  transactionHistory: any[];
  contractInteractions: any[];
  tokenHoldings: any[];
  addressAge: string;
  uniqueInteractions: number;
  accountBalance: string;
}

/**
 * Fetches wallet data from thirdweb Nebula AI API
 * @param address Rootstock address to analyze
 * @returns Formatted wallet data
 */
export async function fetchWalletData(address: string): Promise<WalletData> {
  try {
    // Get the secret key
    const secretKey = process.env.THIRDWEB_SECRET_KEY;
    
    // Ensure secret key is available
    if (!secretKey) {
      throw new Error('THIRDWEB_SECRET_KEY is not defined in environment variables');
    }

    console.log(`API call for address: ${address}`);
    
    // Call Nebula API with the correct request format based on documentation
    const response = await fetch("https://nebula-api.thirdweb.com/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-secret-key": secretKey,
      },
      body: JSON.stringify({
        message: `Provide comprehensive data about the wallet ${address} on Rootstock in a structured way. I need DETAILED information about:
        1. Transaction history (last 50 transactions with dates, amounts, and counterparty addresses)
        2. Smart contract interactions (which contracts, interaction types, how many times, and any known flagged contracts)
        3. Token holdings (types, amounts, token classification like stablecoin/governance/NFT)
        4. Age of address (first transaction date as well as age in days)
        5. Unique addresses interacted with (exact count)
        6. Current account balance
        
        Format the response as structured data that can be parsed as JSON.`,
        stream: false,
        response_format: {
          type: "json_object"
        },
        context_filter: {
          chain_ids: ["30"], // Rootstock mainnet chain ID
          wallet_address: address
        }
      }),
    });

    console.log("Response:", response);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error response: ${errorText}`);
      throw new Error(`Nebula API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Got response data with message length: ${data.message?.length || 0}`);
    
    // Process and format the response
    const formattedData = formatNebulaResponse(data);
    return formattedData;
  } catch (error) {
    console.error('Error fetching wallet data:', error);
    throw error;
  }
}

/**
 * Formats the raw Nebula API response into structured data
 * @param response Raw Nebula API response
 * @returns Formatted wallet data
 */
function formatNebulaResponse(response: any): WalletData {
  try {
    // Extract the response data - could be directly in response or in the message field
    let parsedData: any = {};
    
    if (response.message) {
      // If message is a string, try to extract JSON data from it
      if (typeof response.message === 'string') {
        try {
          // First try to directly parse the message if it's JSON
          parsedData = JSON.parse(response.message);
        } catch (e) {
          // If direct parsing fails, try to extract JSON from the text
          const jsonMatch = response.message.match(/```json\s*([\s\S]*?)\s*```/) || 
                            response.message.match(/```\s*([\s\S]*?)\s*```/) || 
                            response.message.match(/{[\s\S]*?}/);
          
          if (jsonMatch && jsonMatch[0]) {
            try {
              // Try to parse the extracted JSON text
              const jsonText = jsonMatch[0].replace(/```json\s*|\s*```|```\s*|\s*```/g, '');
              parsedData = JSON.parse(jsonText);
            } catch (jsonError) {
              console.error('Error parsing extracted JSON:', jsonError);
              // Fall back to text extraction
              parsedData = extractDataFromText(response.message);
            }
          } else {
            // If no JSON pattern found, extract data from text
            parsedData = extractDataFromText(response.message);
          }
        }
      } else if (typeof response.message === 'object') {
        // If message is already an object, use it directly
        parsedData = response.message;
      }
    } else {
      // If no message field, assume the response itself contains the data
      parsedData = response;
    }
    console.log(parsedData);
    
    let addressAge = 'Unknown';
    let formattedAge = '';
    
    // Try to extract a proper age in days format
    if (parsedData.addressAge) {
      addressAge = parsedData.addressAge;
      
      // If addressAge contains a date, try to convert it to days
      if (typeof addressAge === 'string' && addressAge.includes('-')) {
        try {
          const creationDate = new Date(addressAge);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - creationDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          formattedAge = `${diffDays} days`;
        } catch (e) {
          formattedAge = addressAge;
        }
      }
    }
    
    // Use the formatted age string if we were able to calculate it
    if (formattedAge) {
      addressAge = formattedAge;
    }
    
    // Handle transaction history
    const transactionHistory = Array.isArray(parsedData.transactionHistory) 
      ? parsedData.transactionHistory 
      : [];
    
    // Handle contract interactions
    const contractInteractions = Array.isArray(parsedData.contractInteractions)
      ? parsedData.contractInteractions
      : [];
    
    // Handle token holdings
    const tokenHoldings = Array.isArray(parsedData.tokenHoldings)
      ? parsedData.tokenHoldings
      : [];
    
    // Get unique interactions count
    let uniqueInteractions = parsedData.uniqueInteractions || 0;
    
    // If unique interactions is missing but we have transaction history,
    // we can try to calculate it by extracting unique addresses
    if (!uniqueInteractions && transactionHistory.length > 0) {
      const uniqueAddresses = new Set<string>();
      transactionHistory.forEach((tx: any) => {
        if (tx.from) uniqueAddresses.add(tx.from);
        if (tx.to) uniqueAddresses.add(tx.to);
      });
      // Remove the address being analyzed
      uniqueAddresses.delete(parsedData.address);
      uniqueInteractions = uniqueAddresses.size;
    }
    
    return {
      transactionHistory,
      contractInteractions,
      tokenHoldings,
      addressAge,
      uniqueInteractions,
      accountBalance: parsedData.accountBalance || '0',
    };
  } catch (error) {
    console.error('Error formatting Nebula response:', error);
    // Return empty data structure in case of error
    return {
      transactionHistory: [],
      contractInteractions: [],
      tokenHoldings: [],
      addressAge: 'Unknown',
      uniqueInteractions: 0,
      accountBalance: '0',
    };
  }
}

/**
 * Extract structured data from the text response when JSON parsing fails
 * @param text The text response from the API
 * @returns Structured data extracted from text
 */
function extractDataFromText(text: string): any {
  const result: any = {
    transactionHistory: [],
    contractInteractions: [],
    tokenHoldings: [],
    address: '',
    uniqueInteractions: 0,
    accountBalance: '0',
  };
  
  // Try to extract account balance
  const balanceMatch = text.match(/Amount:\s*([0-9.]+)\s*([A-Za-z]+)/);
  if (balanceMatch) {
    result.accountBalance = `${balanceMatch[1]} ${balanceMatch[2]}`;
  }
  
  // Try to extract address age
  const ageMatch = text.match(/created(?:.*?)([0-9]+)(?:\s*)days/i);
  if (ageMatch) {
    result.addressAge = `${ageMatch[1]} days`;
  }
  
  // Try to extract unique interactions
  const uniqueMatch = text.match(/unique(?:.*?)([0-9]+)(?:\s*)addresses/i);
  if (uniqueMatch) {
    result.uniqueInteractions = parseInt(uniqueMatch[1]);
  }
  
  return result;
} 