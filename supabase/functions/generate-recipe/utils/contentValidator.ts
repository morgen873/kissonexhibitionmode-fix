
interface ValidationResult {
  isValid: boolean;
  reason?: string;
}

export function validateRecipeContent(recipeData: any): ValidationResult {
  // Basic content validation for exhibition safety
  const prohibitedWords = [
    'fuck', 'shit', 'damn', 'bitch', 'ass', 'hell',
    'viagra', 'penis', 'sex', 'porn', 'nude',
    'kill', 'die', 'murder', 'suicide', 'bomb',
    'hitler', 'nazi', 'terrorist'
  ];

  const textToCheck = [
    recipeData.title,
    recipeData.description,
    recipeData.cooking_recipe,
    JSON.stringify(recipeData.ingredients)
  ].join(' ').toLowerCase();

  for (const word of prohibitedWords) {
    if (textToCheck.includes(word)) {
      return {
        isValid: false,
        reason: 'Content contains inappropriate language'
      };
    }
  }

  // Check for minimum content quality
  if (!recipeData.title || recipeData.title.trim().length < 3) {
    return {
      isValid: false,
      reason: 'Recipe title too short'
    };
  }

  if (!recipeData.description || recipeData.description.trim().length < 10) {
    return {
      isValid: false,
      reason: 'Recipe description too short'
    };
  }

  return { isValid: true };
}
