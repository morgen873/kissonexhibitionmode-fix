
import { FOOD_COLOR_WORDS, FOOD_RELATED_WORDS } from './foodExceptions';

/**
 * Checks if the provided text appears to be food-related based on common food indicators
 */
export function isFoodRelated(text: string): boolean {
  const normalizedText = text.toLowerCase().trim();
  
  // Check if text contains multiple food-related indicators
  const foodIndicators = [
    'recipe', 'ingredient', 'food', 'dish', 'meal', 'cooking', 'baking', 'kitchen',
    'restaurant', 'cafe', 'dinner', 'lunch', 'breakfast', 'snack', 'beverage',
    'flavor', 'taste', 'spice', 'herb', 'vegetable', 'fruit', 'meat', 'fish',
    'chicken', 'beef', 'pork', 'turkey', 'lamb', 'seafood', 'dairy', 'grain',
    'pasta', 'bread', 'cake', 'cookie', 'pie', 'pizza', 'sandwich', 'salad'
  ];
  
  const hasMultipleFoodWords = foodIndicators.filter(indicator => 
    normalizedText.includes(indicator)
  ).length >= 1;
  
  return hasMultipleFoodWords;
}

/**
 * Checks if text contains only food-safe color words and food-related terms
 */
export function hasOnlyFoodSafeWords(text: string, prohibitedWords: string[]): boolean {
  const normalizedText = text.toLowerCase().trim();
  const words = normalizedText.split(/\s+/);
  
  return words.every(word => 
    FOOD_COLOR_WORDS.includes(word) || 
    FOOD_RELATED_WORDS.includes(word) ||
    !prohibitedWords.includes(word)
  );
}
