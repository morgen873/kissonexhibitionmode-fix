
import { Heart, Sparkles, Clock } from 'lucide-react';

export interface IntroStepData {
  type: 'hero' | 'explanation' | 'quote';
  title: string | string[];
  description: string;
  buttonText: string;
  icon?: any;
  theme?: {
    border: string;
    shadow: string;
    iconGradient: string;
    titleGradient: string;
  };
  gifUrl?: string; // Add GIF URL property
}

export const introSteps: IntroStepData[] = [
  {
    type: 'hero',
    title: 'Welcome to KissOn',
    description: 'Our AI transforms your feelings into delicious, one-of-a-kind dumpling recipes.',
    buttonText: 'Start Your Journey'
  },
  {
    type: 'explanation',
    title: ['TRANSFORM', 'EMOTIONS'],
    description: 'Every feeling becomes a unique flavor profile, creating recipes as individual as your memories.',
    buttonText: 'Continue',
    icon: Heart,
    theme: {
      border: 'border-pink-400',
      shadow: 'shadow-pink-400/20',
      iconGradient: 'from-pink-400 to-red-500',
      titleGradient: 'from-pink-300 to-red-400'
    }
  },
  {
    type: 'explanation',
    title: ['CRAFT', 'RECIPES'],
    description: 'AI analyzes your emotional journey and creates personalized dumpling recipes with custom ingredients.',
    buttonText: 'Continue',
    icon: Sparkles,
    theme: {
      border: 'border-purple-400',
      shadow: 'shadow-purple-400/20',
      iconGradient: 'from-purple-400 to-blue-500',
      titleGradient: 'from-purple-300 to-blue-400'
    }
  },
  {
    type: 'quote',
    title: 'EVERY DUMPLING IS A PORTAL, EVERY BITE A TIME MACHINE',
    description: 'What kind of memory are you ready to transform into a recipe?',
    buttonText: 'Create My Recipe',
    gifUrl: 'https://ofhteeexidattwcdilpw.supabase.co/storage/v1/object/public/videos//01step.gif'
  }
];
