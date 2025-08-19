import { supabase } from '@/shared/lib/supabase';
import { RecipeGenerationRequest, RecipeGenerationResponse, RecipeResult } from '@/shared/types/creation';

/**
 * Service for handling recipe generation and storage
 * Provides a clean API layer over Supabase functions
 */
class RecipeService {
  /**
   * Generate a new recipe based on user inputs
   */
  async generateRecipe(request: RecipeGenerationRequest): Promise<RecipeResult> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-recipe', {
        body: request,
      });

      if (error) {
        throw new Error(`Recipe generation failed: ${error.message}`);
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Recipe generation failed');
      }

      return data.recipe;
    } catch (error) {
      console.error('Recipe generation error:', error);
      throw error;
    }
  }

  /**
   * Get recipe by ID
   */
  async getRecipe(id: string): Promise<RecipeResult | null> {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Record not found
          return null;
        }
        throw new Error(`Failed to fetch recipe: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Recipe fetch error:', error);
      throw error;
    }
  }

  /**
   * Save recipe to favorites (if user system implemented)
   */
  async saveToFavorites(recipeId: string, userId?: string): Promise<void> {
    if (!userId) {
      // For now, save to localStorage
      const favorites = this.getFavoritesFromStorage();
      if (!favorites.includes(recipeId)) {
        favorites.push(recipeId);
        localStorage.setItem('favorite-recipes', JSON.stringify(favorites));
      }
      return;
    }

    try {
      const { error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: userId,
          recipe_id: recipeId,
        });

      if (error && error.code !== '23505') { // Ignore duplicate key error
        throw new Error(`Failed to save favorite: ${error.message}`);
      }
    } catch (error) {
      console.error('Save favorite error:', error);
      throw error;
    }
  }

  /**
   * Get user's favorite recipes
   */
  async getFavorites(userId?: string): Promise<RecipeResult[]> {
    if (!userId) {
      // Get from localStorage
      const favoriteIds = this.getFavoritesFromStorage();
      if (favoriteIds.length === 0) return [];

      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .in('id', favoriteIds);

      if (error) {
        console.error('Failed to fetch favorite recipes:', error);
        return [];
      }

      return data || [];
    }

    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          recipe_id,
          recipes (*)
        `)
        .eq('user_id', userId);

      if (error) {
        throw new Error(`Failed to fetch favorites: ${error.message}`);
      }

      return data?.map(item => item.recipes).filter(Boolean) || [];
    } catch (error) {
      console.error('Fetch favorites error:', error);
      return [];
    }
  }

  /**
   * Generate 360-degree video for recipe
   */
  async generate360Video(recipeId: string, prompt: string): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-360-video', {
        body: {
          recipeId,
          prompt,
        },
      });

      if (error) {
        throw new Error(`360 video generation failed: ${error.message}`);
      }

      if (!data?.success) {
        throw new Error(data?.error || '360 video generation failed');
      }

      return data.videoUrl;
    } catch (error) {
      console.error('360 video generation error:', error);
      throw error;
    }
  }

  /**
   * Send recipe via email
   */
  async sendRecipeEmail(recipeId: string, email: string): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('send-recipe-email', {
        body: {
          recipeId,
          email,
        },
      });

      if (error) {
        throw new Error(`Failed to send email: ${error.message}`);
      }
    } catch (error) {
      console.error('Send email error:', error);
      throw error;
    }
  }

  private getFavoritesFromStorage(): string[] {
    try {
      const favorites = localStorage.getItem('favorite-recipes');
      return favorites ? JSON.parse(favorites) : [];
    } catch {
      return [];
    }
  }
}

export const recipeService = new RecipeService();