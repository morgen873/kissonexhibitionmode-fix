
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
  
  // Common color words that should always be allowed in any context
  const colorWords = ['black', 'white', 'brown', 'red', 'green', 'yellow', 'orange', 'purple', 'pink', 'golden', 'blue', 'gray', 'grey'];
  
  // If the text is just a color word or color words, always allow it
  const words = normalizedText.split(/\s+/);
  const isOnlyColorWords = words.every(word => colorWords.includes(word));
  if (isOnlyColorWords) {
    return false;
  }
  
  // If the text contains only color words and common safe words, allow it
  const allWordsAreSafe = words.every(word => 
    colorWords.includes(word) || 
    FOOD_COLOR_WORDS.includes(word) ||
    FOOD_RELATED_WORDS.includes(word) ||
    ['and', 'or', 'the', 'a', 'an', 'with', 'of', 'in', 'to', 'for', 'like', 'as'].includes(word)
  );
  
  if (allWordsAreSafe) {
    return false;
  }
  
  // Allow single color words that are commonly used
  if (FOOD_COLOR_WORDS.includes(normalizedText)) {
    return false;
  }
  
  // Allow common food-related words even if they're in the prohibited list
  if (FOOD_RELATED_WORDS.includes(normalizedText)) {
    return false;
  }
  
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
  
  // Check for prohibited words, but be very permissive with color words
  for (const word of PROHIBITED_WORDS) {
    // Skip all color words - they should always be allowed
    if (colorWords.includes(word.toLowerCase())) {
      continue;
    }
    
    // Use word boundaries to avoid false positives
    const regex = new RegExp(`\\b${word.toLowerCase()}\\b`, 'i');
    if (regex.test(normalizedText)) {
      // Check if this word is part of a color combination or food context
      const hasColorContext = colorWords.some(color => 
        normalizedText.includes(`${color} ${word}`) || 
        normalizedText.includes(`${word} ${color}`) ||
        normalizedText.includes(color)
      );
      
      // Check if it's in a food context
      const hasFoodContext = FOOD_RELATED_WORDS.some(foodWord => 
        normalizedText.includes(foodWord)
      );
      
      // Only flag as profanity if it's not in a color or food context
      if (!hasColorContext && !hasFoodContext) {
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
    return ''; // Return empty string if profanity is detected
  }
  
  return text;
}
