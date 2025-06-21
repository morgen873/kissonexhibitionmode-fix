
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
  
  // Common color words that should ALWAYS be allowed in ANY context
  const colorWords = ['black', 'white', 'brown', 'red', 'green', 'yellow', 'orange', 'purple', 'pink', 'golden', 'blue', 'gray', 'grey'];
  
  // Split text into words for analysis
  const words = normalizedText.split(/\s+/);
  
  // FIRST: Check if ANY word is a color word - if so, IMMEDIATELY allow the entire text
  for (const word of words) {
    if (colorWords.includes(word)) {
      console.log(`Allowing text "${text}" because it contains color word: "${word}"`);
      return false;
    }
  }
  
  // Check if text contains only safe words
  const allWordsAreSafe = words.every(word => 
    colorWords.includes(word) || 
    FOOD_COLOR_WORDS.includes(word) ||
    FOOD_RELATED_WORDS.includes(word) ||
    ['and', 'or', 'the', 'a', 'an', 'with', 'of', 'in', 'to', 'for', 'like', 'as'].includes(word)
  );
  
  if (allWordsAreSafe) {
    return false;
  }
  
  // Check if the text matches any food exceptions
  for (const exception of FOOD_EXCEPTIONS) {
    if (normalizedText.includes(exception.toLowerCase())) {
      return false;
    }
  }
  
  // Check if it's clearly food-related context
  if (isFoodRelated(normalizedText) && hasOnlyFoodSafeWords(normalizedText, PROHIBITED_WORDS)) {
    return false;
  }
  
  // Check for prohibited words, but exclude all color words completely
  for (const word of PROHIBITED_WORDS) {
    // Skip ALL color words - they should never be flagged
    if (colorWords.includes(word.toLowerCase())) {
      continue;
    }
    
    // Use word boundaries to avoid false positives
    const regex = new RegExp(`\\b${word.toLowerCase()}\\b`, 'i');
    if (regex.test(normalizedText)) {
      console.log(`Blocking text "${text}" because of prohibited word: "${word}"`);
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
    return '';
  }
  
  return text;
}
