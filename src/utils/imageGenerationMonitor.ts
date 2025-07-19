interface GenerationAttempt {
  timestamp: Date;
  success: boolean;
  model?: string;
  attempts?: number;
  error?: string;
}

class ImageGenerationMonitor {
  private attempts: GenerationAttempt[] = [];
  private maxHistory = 100;

  logAttempt(attempt: GenerationAttempt) {
    this.attempts.unshift(attempt);
    
    // Keep only recent attempts
    if (this.attempts.length > this.maxHistory) {
      this.attempts = this.attempts.slice(0, this.maxHistory);
    }
    
    console.log('📊 IMAGE GENERATION ATTEMPT LOGGED:', {
      success: attempt.success,
      model: attempt.model,
      totalAttempts: this.attempts.length,
      recentSuccessRate: this.getRecentSuccessRate()
    });
  }

  getRecentSuccessRate(lastN: number = 10): number {
    const recent = this.attempts.slice(0, lastN);
    if (recent.length === 0) return 0;
    
    const successful = recent.filter(a => a.success).length;
    return Math.round((successful / recent.length) * 100);
  }

  getStats() {
    const total = this.attempts.length;
    const successful = this.attempts.filter(a => a.success).length;
    const failed = total - successful;
    
    return {
      total,
      successful,
      failed,
      successRate: total > 0 ? Math.round((successful / total) * 100) : 0,
      recentSuccessRate: this.getRecentSuccessRate()
    };
  }
}

export const imageGenerationMonitor = new ImageGenerationMonitor();

export const logImageGenerationResult = (
  success: boolean,
  model?: string,
  attempts?: number,
  error?: string
) => {
  imageGenerationMonitor.logAttempt({
    timestamp: new Date(),
    success,
    model,
    attempts,
    error
  });
};
