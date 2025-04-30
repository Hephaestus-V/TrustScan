# TrustScan AI Prompt Submission

This document outlines the key AI prompts used in the TrustScan project for the (A)I BUIDL Lab Hackathon.

---

## 1. 🧠 AI-Powered Wallet Reputation Analysis

**Prompt Title:** Generate Standardized Trust Analysis for Rootstock Wallet

**Prompt Text:**
```
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
```

**Expected Output:**
A structured JSON object containing the calculated trust score, classification, analysis summary, breakdown of factor scores, actionable recommendations, and identified risk areas for the provided Rootstock wallet address.

**AI Model / Tool Used:** DeepSeek LLM (via OpenRouter API)

**Use Case:**
This prompt is the core engine of TrustScan. It takes structured on-chain wallet data (obtained via ThirdWeb Nebula AI) and uses the LLM's analytical capabilities to perform a complex, multi-factor reputation assessment according to a predefined, objective scoring system. This automates the generation of trust insights that would be extremely time-consuming for a human to calculate manually.

**Best Practices / Insights:**
- **Strict JSON Formatting:** Explicitly demanding a plain, parseable JSON object without any surrounding text (`IMPORTANT: Your response MUST be a valid, parseable JSON object...`) was crucial for reliable integration into the application.
- **Detailed Rubric:** Providing a very specific, mathematical scoring rubric (`SCORING RUBRIC`) ensures consistent and objective analysis across different wallets and analysis runs. This reduces LLM hallucination and subjectivity.
- **Structured Input Data:** Passing the wallet data within the prompt, formatted clearly with labels (e.g., `ADDRESS AGE:`, `TRANSACTION HISTORY:`), helps the LLM easily parse and utilize the relevant information.
- **Explicit Factor Naming:** Requesting specific names for the output factors (`Your factors array should include...`) ensures the JSON structure is predictable.
- **Low Temperature:** Using a low `temperature` (0.2) in the API call promotes deterministic and consistent outputs based on the rubric, rather than creative variations.

**Example Output:**
```json
{
  "trustScore": 78,
  "classification": "Trusted",
  "summary": "This wallet has a trust score of 78, indicating a generally trusted status. Key contributing factors include significant age, healthy transaction velocity, high address diversity, interaction with established DeFi protocols, and a diverse token portfolio. No major risk areas were identified, but standard precautions are always advised.",
  "factors": [
    {
      "name": "Age Factor",
      "score": 10,
      "description": "Address age of 569 days falls into the 181-365+ day category, contributing +10 points."
    },
    {
      "name": "Transaction Velocity Factor",
      "score": 5,
      "description": "Transaction velocity calculated at X tx/day, falling into the 3-10 tx/day range, adding +5 points."
    },
    {
      "name": "Address Diversity Factor",
      "score": 15,
      "description": "Unique address ratio calculated at Y, falling into the 0.81-1.0 range, indicating high diversity and adding +15 points."
    },
    {
      "name": "Contract Interaction Factor",
      "score": 10,
      "description": "Interaction with multiple unique contract types including recognized DeFi protocols contributes +10 points (max)."
    },
    {
      "name": "Token Holdings Factor",
      "score": 10,
      "description": "Holds established tokens (RBTC, DOC, rUSDT), a diverse portfolio (4+ types), contributing +10 points."
    }
  ],
  "recommendations": [
    "Address shows consistent positive indicators.",
    "Suitable for standard transaction volumes.",
    "Verify specific large transactions as standard practice."
  ],
  "riskAreas": [
    "No significant risk areas identified based on available data."
  ]
}
```
*(Note: Calculations like tx/day and ratio Y are illustrative and depend on actual data)*

---

## 2. 📊 Structured On-Chain Data Extraction

**Prompt Title:** Extract Comprehensive Rootstock Wallet Data

**Prompt Text:**
```
Provide comprehensive data about the wallet ${address} on Rootstock in a structured way. I need DETAILED information about:
1. Transaction history (last 50 transactions with dates, amounts, and counterparty addresses)
2. Smart contract interactions (which contracts, interaction types, how many times, and any known flagged contracts)
3. Token holdings (types, amounts, token classification like stablecoin/governance/NFT)
4. Age of address (first transaction date as well as age in days)
5. Unique addresses interacted with (exact count)
6. Current account balance

Format the response as structured data that can be parsed as JSON.
```

**Expected Output:**
A structured JSON object containing detailed on-chain data for the specified Rootstock wallet address, including transaction history, contract interactions, token holdings, address age, unique interactions count, and account balance.

**AI Model / Tool Used:** ThirdWeb Nebula AI API

**Use Case:**
This prompt is used to query the ThirdWeb Nebula AI API, which is specialized in accessing and structuring blockchain data. It serves as the essential data gathering step before the analysis prompt can be run. It translates a natural language request for specific blockchain data points into a format the Nebula API understands, returning structured data needed for the subsequent reputation analysis.

**Best Practices / Insights:**
- **Numbered List:** Using a numbered list for required data points makes the request clear and ensures all necessary information is requested.
- **Specifying Details:** Asking for specific details within each category (e.g., "dates, amounts, and counterparty addresses" for transactions; "types, amounts, token classification" for holdings) yields richer data.
- **JSON Format Request:** Explicitly requesting the output format as "structured data that can be parsed as JSON" helps ensure the API returns usable data.
- **Chain Specification:** Although not in the prompt text itself, specifying the `chain_ids: ["30"]` (Rootstock) in the API call context ensures the data comes from the correct blockchain.

**Example Output:**
*(Based on the static data used in `lib/nebula.ts`)*
```json
{
  "chain_id": 30,
  "chain_name": "Rootstock Mainnet (rsk)",
  "current_block": 7507166,
  "transaction_history": [
    {
      "tx_hash": "0xf0a68532b30b1fb69c698c1195906b1533bec2294c122e86d1d99ff348cb4f1c",
      "timestamp": "2024-11-06 15:33:06 UTC",
      "from": "0x72Bd32A5317ef2f392E1A0d580AbfC32750efD19",
      "to": "0x2bee6167f91d10db23252e03de039da6b9047d49",
      "value_rbtc": "0"
    }
    // ... (more transactions up to 50)
  ],
  "smart_contract_interactions": {
    "contracts": [
      {
        "contract_address": "0x2bee6167f91d10db23252e03de039da6b9047d49",
        "interaction_count": 12,
        "flagged": false,
        "type": "call"
      }
      // ... (more contracts)
    ],
    "known_flagged_contracts": []
  },
  "token_holdings": [
    {
      "token_address": "native",
      "name": "Smart Bitcoin",
      "symbol": "RBTC",
      "amount": "8.136192300279997625",
      "type": "Native Coin"
    },
    {
      "token_address": "0xe700691da7b9851f2f35f8b8182c69c53ccad9db",
      "name": "Dollar on Chain",
      "symbol": "DOC",
      "amount": "365.016674215480747989",
      "type": "Stablecoin"
    }
    // ... (more tokens)
  ],
  "account_balance": {
    "RBTC": "8.136192300279997625"
  },
  "age_of_address": {
    "first_transaction_observed": "2023-10-09 00:54:45 UTC",
    "age_in_days": 569
  },
  "unique_addresses_interacted_with": 25
}
``` 