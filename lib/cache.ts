import { TrustAnalysis } from './openrouter';

// Simple in-memory cache
interface CacheEntry {
  data: TrustAnalysis;
  timestamp: number;
}

// Cache object to store analysis results
const cache: Record<string, CacheEntry> = {};

// TTL in milliseconds (24 hours)
const CACHE_TTL = 24 * 60 * 60 * 1000;

/**
 * Check if a result exists in cache
 * @param address Wallet address to check
 * @returns Cached analysis or null if not found or expired
 */
export async function checkCache(address: string): Promise<TrustAnalysis | null> {
  // Normalize address for cache key
  const cacheKey = address.toLowerCase();
  
  // Check if entry exists and is not expired
  const entry = cache[cacheKey];
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data;
  }
  
  // Not found or expired
  return null;
}

/**
 * Store analysis result in cache
 * @param address Wallet address
 * @param data Analysis result to cache
 */
export async function cacheResult(address: string, data: TrustAnalysis): Promise<void> {
  // Normalize address for cache key
  const cacheKey = address.toLowerCase();
  
  // Store with current timestamp
  cache[cacheKey] = {
    data,
    timestamp: Date.now(),
  };
}

/**
 * Clear a specific address from cache
 * @param address Wallet address to clear
 */
export async function clearCache(address: string): Promise<void> {
  const cacheKey = address.toLowerCase();
  delete cache[cacheKey];
}

/**
 * Clear all items from cache
 */
export async function clearAllCache(): Promise<void> {
  Object.keys(cache).forEach(key => {
    delete cache[key];
  });
} 