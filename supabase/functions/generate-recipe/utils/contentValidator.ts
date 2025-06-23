
interface RecipeContent {
  title: string;
  description: string;
  ingredients: any;
  cooking_recipe: string;
}

interface ValidationResult {
  isValid: boolean;
  reason?: string;
}

// Very conservative list of truly inappropriate words for exhibition
const PROHIBITED_WORDS = [
  'fuck', 'shit', 'bitch', 'damn', 'hell', 'ass', 'bastard', 'crap',
  'piss', 'cock', 'dick', 'pussy', 'slut', 'whore', 'faggot', 'nigger',
  'retard', 'rape', 'nazi', 'hitler', 'kill', 'murder', 'death', 'suicide',
  'bomb', 'terrorist', 'weapon', 'gun', 'knife', 'blood', 'violence'
];

// Words that are food-related and should NEVER be flagged
const FOOD_SAFE_WORDS = [
  'dumpling', 'dumplings', 'whisper', 'whispers', 'nostalgic', 'nostalgia',
  'silence', 'silent', 'memory', 'memories', 'childhood', 'kiss', 'kisses',
  'love', 'loving', 'sweet', 'bitter', 'sour', 'spicy', 'tender', 'soft',
  'warm', 'cold', 'hot', 'fresh', 'crispy', 'steamed', 'boiled', 'fried',
  'flour', 'dough', 'filling', 'wrapper', 'ingredient', 'ingredients',
  'recipe', 'cooking', 'preparation', 'traditional', 'modern', 'future',
  'past', 'present', 'historical', 'contemporary', 'futuristic'
];

function containsProhibitedContent(text: string): boolean {
  const lowercaseText = text.toLowerCase();
  
  // First check if it contains any food-safe words - if so, it's likely legitimate
  const containsFoodWords = FOOD_SAFE_WORDS.some(word => 
    lowercaseText.includes(word.toLowerCase())
  );
  
  if (containsFoodWords) {
    console.log('✅ Content contains food-related words, likely safe');
    // Only flag if it contains truly prohibited words
    const hasProhibited = PROHIBITED_WORDS.some(word => 
      lowercaseText.includes(word.toLowerCase())
    );
    return hasProhibited;
  }
  
  // For non-food content, check against prohibited words
  return PROHIBITED_WORDS.some(word => 
    lowercaseText.includes(word.toLowerCase())
  );
}

export function validateRecipeContent(content: RecipeContent): ValidationResult {
  console.log('=== CONTENT VALIDATION ===');
  console.log('Validating recipe:', content.title);
  
  // Check title
  if (containsProhibitedContent(content.title)) {
    console.log('❌ Title contains prohibited content:', content.title);
    return {
      isValid: false,
      reason: `Title contains inappropriate language: ${content.title}`
    };
  }
  
  // Check description
  if (containsProhibitedContent(content.description)) {
    console.log('❌ Description contains prohibited content');
    return {
      isValid: false,
      reason: 'Description contains inappropriate language'
    };
  }
  
  // Check cooking recipe
  if (containsProhibitedContent(content.cooking_recipe)) {
    console.log('❌ Cooking recipe contains prohibited content');
    return {
      isValid: false,
      reason: 'Cooking instructions contain inappropriate language'
    };
  }
  
  // Check ingredients (if they're strings)
  if (content.ingredients && typeof content.ingredients === 'object') {
    const ingredientText = JSON.stringify(content.ingredients);
    if (containsProhibitedContent(ingredientText)) {
      console.log('❌ Ingredients contain prohibited content');
      return {
        isValid: false,
        reason: 'Ingredients contain inappropriate language'
      };
    }
  }
  
  console.log('✅ Content validation passed for:', content.title);
  return { isValid: true };
}
