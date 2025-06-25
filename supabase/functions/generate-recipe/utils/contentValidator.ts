
interface RecipeContent {
  title: string;
  description: string;
  cooking_recipe: string;
  ingredients: any;
}

interface ValidationResult {
  isValid: boolean;
  reason?: string;
}

// More targeted inappropriate content detection for exhibition safety
const TRULY_INAPPROPRIATE_WORDS = [
  // Only include clearly inappropriate terms that would be unsuitable for a public exhibition
  'explicit_term_1', 'explicit_term_2' // Placeholder - actual implementation would have specific terms
];

// Common cooking and emotional terms that should NOT be flagged
const COOKING_EXCEPTIONS = [
  'heat', 'hot', 'warm', 'cool', 'cold', 'spicy', 'mild', 'tender', 'firm', 'soft', 'hard',
  'beat', 'whip', 'fold', 'mix', 'stir', 'blend', 'combine', 'melt', 'boil', 'simmer',
  'grandmother', 'memory', 'nostalgia', 'emotion', 'feeling', 'love', 'sadness', 'joy',
  'bitter', 'sweet', 'sour', 'salty', 'umami', 'rich', 'deep', 'intense', 'gentle',
  'steam', 'pressure', 'temperature', 'degrees', 'celsius', 'fahrenheit'
];

export function validateRecipeContent(content: RecipeContent): ValidationResult {
  console.log('🔍 VALIDATING RECIPE CONTENT FOR EXHIBITION SAFETY');
  console.log('- Title:', content.title);
  console.log('- Description length:', content.description.length);
  console.log('- Recipe length:', content.cooking_recipe.length);

  // Combine all text content for validation
  const allText = [
    content.title,
    content.description,
    content.cooking_recipe,
    JSON.stringify(content.ingredients)
  ].join(' ').toLowerCase();

  // Check for truly inappropriate content only
  for (const word of TRULY_INAPPROPRIATE_WORDS) {
    if (allText.includes(word.toLowerCase())) {
      // Double-check it's not a cooking exception
      if (!COOKING_EXCEPTIONS.some(exception => 
        allText.includes(exception.toLowerCase()) && 
        allText.indexOf(word.toLowerCase()) > allText.indexOf(exception.toLowerCase()) - 10 &&
        allText.indexOf(word.toLowerCase()) < allText.indexOf(exception.toLowerCase()) + 10
      )) {
        console.log('❌ Content validation failed: inappropriate word detected');
        return {
          isValid: false,
          reason: 'Content contains inappropriate language for exhibition'
        };
      }
    }
  }

  // Check for extremely long content that might indicate generation issues
  if (content.title.length > 200) {
    console.log('❌ Content validation failed: title too long');
    return {
      isValid: false,
      reason: 'Recipe title is too long'
    };
  }

  if (content.description.length > 2000) {
    console.log('❌ Content validation failed: description too long');
    return {
      isValid: false,
      reason: 'Recipe description is too long'
    };
  }

  if (content.cooking_recipe.length > 5000) {
    console.log('❌ Content validation failed: instructions too long');
    return {
      isValid: false,
      reason: 'Cooking instructions are too long'
    };
  }

  // Check for empty or invalid content
  if (!content.title || content.title.trim().length < 3) {
    console.log('❌ Content validation failed: invalid title');
    return {
      isValid: false,
      reason: 'Recipe title is too short or empty'
    };
  }

  if (!content.description || content.description.trim().length < 10) {
    console.log('❌ Content validation failed: invalid description');
    return {
      isValid: false,
      reason: 'Recipe description is too short or empty'
    };
  }

  if (!content.cooking_recipe || content.cooking_recipe.trim().length < 20) {
    console.log('❌ Content validation failed: invalid instructions');
    return {
      isValid: false,
      reason: 'Cooking instructions are too short or empty'
    };
  }

  console.log('✅ Content validation passed - recipe is suitable for exhibition');
  return {
    isValid: true
  };
}
