import { createThirdwebClient } from 'thirdweb';
import { fallbackResponse } from '@/utils/fallbackResponse';
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

    const staticNebulaResponse = fallbackResponse;
    let rawData: any; // Variable to hold API response or fallback static data

    try {
      console.log(`Attempting Nebula API call for address: ${address}`);
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

      console.log("API Response Status:", response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error response text: ${errorText}`);
        // Throw an error to trigger the catch block and use fallback data
        throw new Error(`Nebula API error: ${response.status} ${response.statusText}`);
      }

      rawData = await response.json();
      console.log(`Successfully received data from Nebula API. Message length: ${rawData.message?.length || 0}`);
      // --- END: Nebula API call ---
      
    } catch (apiError) {
      console.warn(`Nebula API call failed for address ${address}. Using static fallback data. Error:`, apiError);
      // Use static data as fallback
      rawData = staticNebulaResponse;
      console.log(`API call for address: ${address} (Using static data due to error)`); 
    }
    
    // Process and format the rawData (either from API or static fallback)
    const formattedResponse = formatNebulaResponse(rawData);
    return formattedResponse;
  } catch (error) {
    console.error('Error processing wallet data:', error);
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
    // Extract the response data
    let parsedData = response;
    
    // Check if response has a message field that needs to be parsed
    if (response.message) {
      // If message is a string, try to extract JSON data from it
      if (typeof response.message === 'string') {
        try {
          // First try to directly parse the message if it's JSON
          parsedData = JSON.parse(response.message);
        } catch (e) {
          // If direct parsing fails, try to extract JSON from the text
          const jsonRegexes = [
            /```json\s*([\s\S]*?)\s*```/, // Matches ```json ... ```
            /```\s*([\s\S]*?)\s*```/,     // Matches ``` ... ```
            /({[\s\S]*})/              // Matches { ... } (Captures the object itself)
          ];
          let jsonText: string | null = null;

          for (const regex of jsonRegexes) {
            const match = response.message.match(regex);
            // Use captured group 1 if it exists (for ``` regexes), otherwise use group 0 (for {} regex)
            if (match && (match[1] || match[0])) {
              jsonText = (match[1] || match[0]).trim();
              break; // Found a match, stop searching
            }
          }

          if (jsonText) {
            try {
              // Try to parse the extracted JSON text
              parsedData = JSON.parse(jsonText);
            } catch (jsonError) {
              console.error('Error parsing extracted JSON:', jsonError);
              console.error('Problematic JSON Text:', jsonText);
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
    }
    
    console.log(parsedData);
    
    // Map the fields from the static response to the expected WalletData interface
    
    // Handle transaction history - map from transaction_history
    const transactionHistory = Array.isArray(parsedData.transaction_history) 
      ? parsedData.transaction_history 
      : [];
    
    // Handle contract interactions - map from smart_contract_interactions.contracts
    const contractInteractions = parsedData.smart_contract_interactions && Array.isArray(parsedData.smart_contract_interactions.contracts)
      ? parsedData.smart_contract_interactions.contracts
      : [];
    
    // Handle token holdings - map from token_holdings
    const tokenHoldings = Array.isArray(parsedData.token_holdings)
      ? parsedData.token_holdings
      : [];
    
    // Map address age from age_of_address, as a string in the format "X days"
    let addressAge = 'Unknown';
    if (parsedData.age_of_address) {
      if (parsedData.age_of_address.age_in_days) {
        addressAge = `${parsedData.age_of_address.age_in_days} days`;
      } else if (parsedData.age_of_address.first_transaction_observed) {
        // If we have a first transaction date but no age in days, calculate it
        try {
          const creationDate = new Date(parsedData.age_of_address.first_transaction_observed);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - creationDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          addressAge = `${diffDays} days`;
        } catch (e) {
          addressAge = parsedData.age_of_address.first_transaction_observed || 'Unknown';
        }
      }
    }
    
    // Map unique interactions from unique_addresses_interacted_with
    const uniqueInteractions = parsedData.unique_addresses_interacted_with || 0;
    
    // Map account balance
    let accountBalance = '0';
    if (parsedData.account_balance) {
      if (typeof parsedData.account_balance === 'string') {
        accountBalance = parsedData.account_balance;
      } else if (typeof parsedData.account_balance === 'object') {
        // If it's an object with cryptocurrency keys, format as "amount symbol"
        const balanceEntries = Object.entries(parsedData.account_balance);
        if (balanceEntries.length > 0) {
          const [symbol, amount] = balanceEntries[0];
          accountBalance = `${amount} ${symbol}`;
        }
      }
    }
    
    return {
      transactionHistory,
      contractInteractions,
      tokenHoldings,
      addressAge,
      uniqueInteractions,
      accountBalance,
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