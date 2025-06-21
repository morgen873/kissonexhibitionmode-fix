
// Food-related exceptions that contain words from the prohibited list
export const FOOD_EXCEPTIONS = [
  // Color + food combinations
  'black coffee', 'black tea', 'black pepper', 'black beans', 'black rice', 'black olives',
  'black sesame', 'black garlic', 'black truffle', 'black salt', 'black bread', 'black cake',
  'black forest', 'black cherry', 'black currant', 'black grape', 'black walnut',
  'white chocolate', 'white wine', 'white bread', 'white rice', 'white sauce', 'white pepper',
  'white beans', 'white onion', 'white cheese', 'white fish', 'white meat', 'white sugar',
  'white vinegar', 'white tea', 'white truffle', 'white chocolate chip',
  'brown sugar', 'brown rice', 'brown bread', 'brown butter', 'brown sauce',
  'red wine', 'red pepper', 'red beans', 'red onion', 'red meat', 'red sauce',
  'green tea', 'green beans', 'green pepper', 'green onion', 'green salad',
  'yellow pepper', 'yellow onion', 'yellow rice', 'yellow curry',
  
  // Specific food terms that might contain prohibited words
  'cocktail sauce', 'cocktail shrimp', 'fruit cocktail',
  'ginger root', 'ginger tea', 'ginger beer', 'ginger snap',
  'herb seasoning', 'herb butter', 'herb crust',
  'spice blend', 'spice rub', 'spice mix',
  'sweet potato', 'sweet corn', 'sweet pepper', 'sweet onion',
  'hot sauce', 'hot pepper', 'hot chocolate', 'hot tea', 'hot coffee',
  'ice cream', 'ice tea', 'ice coffee',
  'cream cheese', 'cream sauce', 'cream soup',
  'chicken breast', 'turkey breast', 'duck breast',
  'pork belly', 'beef belly',
  'bone broth', 'bone marrow',
  'sea salt', 'rock salt', 'table salt',
  'olive oil', 'coconut oil', 'sesame oil',
  'vanilla extract', 'almond extract', 'lemon extract'
];

// Common food-related color words that should be allowed
export const FOOD_COLOR_WORDS = [
  'black', 'white', 'brown', 'red', 'green', 'yellow', 'orange', 'purple', 'pink', 'golden'
];

// Common food-related words that might be in the prohibited list
export const FOOD_RELATED_WORDS = [
  'breast', 'thigh', 'leg', 'wing', 'cream', 'milk', 'cheese', 'butter', 'oil', 'juice',
  'sauce', 'soup', 'tea', 'coffee', 'wine', 'beer', 'cocktail', 'hot', 'cold', 'sweet',
  'sour', 'spicy', 'mild', 'fresh', 'dried', 'smoked', 'grilled', 'baked', 'fried',
  'steamed', 'roasted', 'raw', 'cooked'
];
