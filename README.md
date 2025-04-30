# TrustScan

TrustScan is an AI-powered reputation and identity verification system for the Rootstock ecosystem that analyzes on-chain wallet activity to generate trust scores.

## Core Value Proposition

- Provides objective trust metrics for any Rootstock address
- Helps prevent scams and malicious activity in the ecosystem
- Enables reputation-gated access for DeFi, marketplaces, and DAOs
- Accelerates development with AI-powered analysis of on-chain behavior

## Features

- Trust Score calculation for any Rootstock address using a standardized scoring system
- Classification of addresses from High Risk to Highly Trusted
- Detailed breakdown of trust factors
- Recommendations when interacting with addresses
- Risk area identification and analysis

## Standardized Scoring System

TrustScan uses a consistent methodology to evaluate addresses:

1. **Starting Base Score**: 50 points
2. **Age Factor**: -25 to +15 points based on account age
3. **Transaction Velocity**: -10 to +15 points based on transaction frequency
4. **Address Diversity**: -10 to +15 points based on unique address interactions
5. **Contract Interaction**: -10 to +10 points based on contract types
6. **Token Holdings**: -15 to +15 points based on token portfolio

Final scores are classified as follows:
- 0-20: High Risk
- 21-40: Suspicious
- 41-60: New/Neutral
- 61-80: Trusted
- 81-100: Highly Trusted

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui, Recharts
- **Backend**: Next.js API routes
- **AI**: OpenRouter LLM API (Claude/ChatGPT)
- **Blockchain Data**: ThirdWeb Nebula AI API
- **Cache**: In-memory cache (can be extended to database)

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone https://github.com/yourusername/trustscan.git
   cd trustscan
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Create environment variables**:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   # ThirdWeb Nebula API Keys
   THIRDWEB_SECRET_KEY=your_thirdweb_secret_key

   # OpenRouter API Keys (for LLM access)
   OPENROUTER_API_KEY=your_openrouter_api_key

   # Optional: App URL (for HTTP referrer)
   NEXT_PUBLIC_APP_URL= http://localhost:3000/
   ```

   **Important Note**: The ThirdWeb Nebula API requires a paid subscription for full functionality, especially when deployed. The free tier might have limitations that cause errors during deployment or runtime. Ensure you are using a Nebula API key with an active subscription for testing and deployment.

4. **Run the development server**:
   ```
   npm run dev
   ```

5. **Open the application**:
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

- `GET /api/analyze/[address]`: Analyzes a Rootstock address and returns trust metrics

## Project Structure

- `/app`: Next.js application pages and API routes
- `/components`: React components
- `/lib`: Utility functions and API integrations
- `/public`: Static assets

## License

MIT
