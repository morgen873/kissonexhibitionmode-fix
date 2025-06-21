
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
  
  // Common color words that should be allowed in appropriate contexts
  const colorWords = ['black', 'white', 'brown', 'red', 'green', 'yellow', 'orange', 'purple', 'pink', 'golden', 'blue', 'gray', 'grey'];
  
  // Split text into words for analysis
  const words = normalizedText.split(/\s+/);
  
  // Only check for prohibited words if we have complete words (more than 2 characters)
  // This prevents blocking partial typing
  if (normalizedText.length < 3) {
    console.log(`Allowing text "${text}" because it's too short to be problematic`);
    return false;
  }
  
  // Check if the text matches any food exceptions FIRST (most specific)
  for (const exception of FOOD_EXCEPTIONS) {
    if (normalizedText.includes(exception.toLowerCase())) {
      console.log(`Allowing text "${text}" because it matches food exception: "${exception}"`);
      return false;
    }
  }
  
  // Check if it's clearly food-related context with safe words
  if (isFoodRelated(normalizedText) && hasOnlyFoodSafeWords(normalizedText, PROHIBITED_WORDS)) {
    console.log(`Allowing text "${text}" because it's food-related with safe words`);
    return false;
  }
  
  // Check if text contains only safe words (including color words in appropriate context)
  const allWordsAreSafe = words.every(word => 
    colorWords.includes(word) || 
    FOOD_COLOR_WORDS.includes(word) ||
    FOOD_RELATED_WORDS.includes(word) ||
    ['and', 'or', 'the', 'a', 'an', 'with', 'of', 'in', 'to', 'for', 'like', 'as', 'sauce', 'pepper', 'bean', 'beans', 'rice', 'bread'].includes(word) ||
    word.length < 3 // Allow short words like "a", "an", "to", etc.
  );
  
  if (allWordsAreSafe) {
    console.log(`Allowing text "${text}" because all words are safe`);
    return false;
  }
  
  // Now check for prohibited words - this happens AFTER safe word checks
  for (const word of PROHIBITED_WORDS) {
    // Skip color words when they appear as standalone prohibited words
    if (colorWords.includes(word.toLowerCase())) {
      continue;
    }
    
    // Use word boundaries to avoid false positives, but only for words 3+ characters
    if (word.length >= 3) {
      const regex = new RegExp(`\\b${word.toLowerCase()}\\b`, 'i');
      if (regex.test(normalizedText)) {
        console.log(`Blocking text "${text}" because of prohibited word: "${word}"`);
        return true;
      }
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
    return '';
  }
  
  return text;
}
