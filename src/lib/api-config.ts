/**
 * API Configuration Utilities
 * Helper functions to check API configuration status
 */

export interface ApiConfigStatus {
  googleAI: boolean;
  allConfigured: boolean;
  missingConfigs: string[];
}

/**
 * Check if all required API configurations are present
 */
export function checkApiConfig(): ApiConfigStatus {
  const googleAI = !!process.env.GOOGLE_GENAI_API_KEY;

  const missingConfigs: string[] = [];
  
  if (!googleAI) {
    missingConfigs.push('Google AI API Key (GOOGLE_GENAI_API_KEY)');
  }

  return {
    googleAI,
    allConfigured: googleAI,
    missingConfigs,
  };
}

/**
 * Get user-friendly error message for missing API configuration
 */
export function getApiConfigErrorMessage(): string | null {
  // Only check for Google AI API key in development
  if (!process.env.GOOGLE_GENAI_API_KEY) {
    return "Missing Google AI API key. Please add GOOGLE_GENAI_API_KEY to your .env.local file. Check the API_SETUP.md file for setup instructions.";
  }

  return null;
}
