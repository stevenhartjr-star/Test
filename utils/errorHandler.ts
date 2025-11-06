
export function getFriendlyErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        const message = error.message.toLowerCase();

        // API Key issues
        if (message.includes('api key not valid') || message.includes('api key is invalid')) {
            return 'Authentication failed: Your API key is invalid. Please check your key and try again.';
        }
        if (message.includes('requested entity was not found')) {
             return 'The resource was not found. This can sometimes be caused by an invalid API key or incorrect model name. Please verify your settings.';
        }

        // Quota and Rate Limiting
        if (message.includes('quota') || message.includes('rate limit')) {
            return 'You have exceeded your request quota or rate limit. Please wait a while before trying again.';
        }

        // Network errors
        if (message.includes('failed to fetch')) {
            return 'A network error occurred. Please check your internet connection and try again.';
        }

        // Content/Safety issues
        if (message.includes('safety policy') || message.includes('blocked')) {
            return 'The response was blocked due to a safety policy. Please modify your prompt.';
        }
         if (message.includes('invalid argument')) {
            return 'There was an issue with the request. Please check if your prompt or attached file is valid.';
        }

        // Generic SDK/Server errors
        if (message.includes('[500') || message.includes('internal error')) {
             return 'The server encountered an internal error. Please try again later.';
        }

        // Return the original message if no specific pattern is matched
        return error.message;
    }
    return 'An unknown error occurred. Please check the console for more details.';
}
