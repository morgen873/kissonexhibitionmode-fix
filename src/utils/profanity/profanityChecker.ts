
import { PROHIBITED_WORDS } from './prohibitedWords';
import { FOOD_EXCEPTIONS, FOOD_COLOR_WORDS, FOOD_RELATED_WORDS } from './foodExceptions';
import { isFoodRelated, hasOnlyFoodSafeWords } from './foodDetection';

/**
 * Checks if the provided text contains profanity
 * Returns true if profanity is detected, false otherwise
 */
export function containsProfanity(text: string): boolean {
  if (!text || typeof text !== 'string') return false;
  
  const normalizedText = text.toLowerCase().trim();
  
  // Check if the text matches any food exceptions first
  for (const exception of FOOD_EXCEPTIONS) {
    if (normalizedText.includes(exception.toLowerCase())) {
      return false; // Allow food-related terms
    }
  }
  
  // Check if it's clearly food-related context
  if (isFoodRelated(normalizedText)) {
    // Allow common food color words in food context
    if (hasOnlyFoodSafeWords(normalizedText, PROHIBITED_WORDS)) {
      return false;
    }
  }
  
  // Allow single color words that are commonly used in food
  if (FOOD_COLOR_WORDS.includes(normalizedText)) {
    return false;
  }
  
  // Allow common food-related words even if they're in the prohibited list
  if (FOOD_RELATED_WORDS.includes(normalizedText)) {
    return false;
  }
  
  // Check for prohibited words
  for (const word of PROHIBITED_WORDS) {
    // Use word boundaries to avoid false positives
    const regex = new RegExp(`\\b${word.toLowerCase()}\\b`, 'i');
    if (regex.test(normalizedText)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Filters out profanity from text
 * Returns empty string if profanity is detected, otherwise returns the original text
 */
export function filterProfanity(text: string): string {
  if (!text || typeof text !== 'string') return text;
  
  if (containsProfanity(text)) {
    return ''; // Return empty string if profanity is detected
  }
  
  return text;
}
