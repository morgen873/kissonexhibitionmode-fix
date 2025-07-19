
interface ValidationResult {
  isValid: boolean;
  score: number; // 0-100
  issues: string[];
  suggestions: string[];
}

export function validateImageGeneration(
  prompt: string,
  negativePrompt: string,
  context: any
): ValidationResult {
  console.log("=== VALIDATING IMAGE GENERATION SETUP ===");
  
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 100;
  
  // Validate prompt structure
  if (!prompt.includes('single')) {
    issues.push("Prompt should specify 'single dumpling'");
    score -= 20;
  }
  
  if (!prompt.includes(context.dumplingShape)) {
    issues.push(`Prompt should include shape: ${context.dumplingShape}`);
    score -= 15;
  }
  
  if (!prompt.includes('black background')) {
    issues.push("Prompt should specify black background");
    score -= 15;
  }
  
  // Validate negative prompt
  const negativeElements = negativePrompt.split(', ');
  if (!negativeElements.includes('multiple dumplings')) {
    issues.push("Negative prompt should prevent multiple dumplings");
    score -= 10;
  }
  
  if (negativeElements.length < 10) {
    suggestions.push("Consider adding more negative prompt elements");
    score -= 5;
  }
  
  // Check prompt length
  if (prompt.length > 400) {
    suggestions.push("Consider shortening prompt for better AI comprehension");
    score -= 5;
  }
  
  if (prompt.length < 80) {
    suggestions.push("Consider adding more descriptive details");
    score -= 10;
  }
  
  console.log(`📊 Validation score: ${score}/100`);
  console.log(`📋 Issues found: ${issues.length}`);
  console.log(`💡 Suggestions: ${suggestions.length}`);
  
  return {
    isValid: issues.length === 0,
    score,
    issues,
    suggestions
  };
}

export function logGenerationMetrics(
  modelUsed: string,
  attempts: number,
  success: boolean,
  generationTime?: number
) {
  console.log("=== GENERATION METRICS ===");
  console.log(`Model: ${modelUsed}`);
  console.log(`Attempts: ${attempts}`);
  console.log(`Success: ${success}`);
  console.log(`Time: ${generationTime || 'N/A'}ms`);
  
  // This could be sent to analytics/monitoring service
  const metrics = {
    timestamp: new Date().toISOString(),
    model: modelUsed,
    attempts,
    success,
    generationTime
  };
  
  console.log("GENERATION_METRICS", JSON.stringify(metrics));
}
