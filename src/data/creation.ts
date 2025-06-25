
import { Heart, Clock, MapPin, Thermometer, Coffee, Utensils, Star, Sparkles } from 'lucide-react';
import { CreationStep } from '@/types/creation';

export const steps: CreationStep[] = [
  {
    id: 1,
    type: 'explanation',
    title: 'Let\'s Create Your Dumpling Recipe',
    description: 'We\'ll guide you through a series of questions to understand your story and transform it into a unique dumpling recipe.',
  },
  {
    id: 2,
    type: 'question',
    title: 'What type of memory are you trying to recreate?',
    description: 'Every great dumpling starts with a meaningful moment. What kind of experience do you want to capture?',
    options: [
      {
        title: 'A romantic evening',
        description: 'Intimate moments, candlelit dinners, first dates'
      },
      {
        title: 'Family gathering',
        description: 'Holiday celebrations, family reunions, traditions'
      },
      {
        title: 'Adventure or travel',
        description: 'Exotic locations, new experiences, discoveries'
      },
      {
        title: 'Personal achievement',
        description: 'Graduations, promotions, overcoming challenges'
      }
    ],
    customOption: {
      title: 'Something else entirely',
      placeholder: 'Describe your unique memory...'
    },
    gifUrl: 'https://ofhteeexidattwcdilpw.supabase.co/storage/v1/object/public/videos//02step.gif'
  },
  {
    id: 3,
    type: 'question',
    title: 'What emotions dominated this experience?',
    description: 'The emotional essence will influence the flavor profile of your dumpling.',
    options: [
      {
        title: 'Joy and excitement',
        description: 'Vibrant, energetic, uplifting feelings'
      },
      {
        title: 'Love and warmth',
        description: 'Tender, comforting, embracing emotions'
      },
      {
        title: 'Nostalgia and longing',
        description: 'Bittersweet, reflective, wistful feelings'
      },
      {
        title: 'Pride and accomplishment',
        description: 'Confident, satisfied, triumphant emotions'
      }
    ],
    customOption: {
      title: 'A different emotion',
      placeholder: 'Describe the emotions you felt...'
    },
    gifUrl: 'https://ofhteeexidattwcdilpw.supabase.co/storage/v1/object/public/videos//03step.gif'
  },
  {
    id: 4,
    type: 'question',
    title: 'Who shared this moment with you?',
    description: 'The people present will add layers of meaning to your recipe.',
    options: [
      {
        title: 'Just me',
        description: 'A personal, solitary experience'
      },
      {
        title: 'My partner',
        description: 'Shared with someone special'
      },
      {
        title: 'Family members',
        description: 'Parents, siblings, relatives'
      },
      {
        title: 'Close friends',
        description: 'Companions and confidants'
      }
    ],
    customOption: {
      title: 'Other people',
      placeholder: 'Tell us about who was there...'
    },
    gifUrl: 'https://ofhteeexidattwcdilpw.supabase.co/storage/v1/object/public/videos//04step.gif'
  },
  {
    id: 5,
    type: 'timeline',
    title: 'When did this happen?',
    description: 'The time period adds historical context and seasonal elements to your recipe.',
    options: [
      {
        title: 'Childhood',
        description: 'Simple, pure, foundational flavors',
        value: 'childhood'
      },
      {
        title: 'Teenage years',
        description: 'Bold, experimental, intense combinations',
        value: 'teenage'
      },
      {
        title: 'Young adult',
        description: 'Sophisticated, refined, complex tastes',
        value: 'young-adult'
      },
      {
        title: 'Recent years',
        description: 'Mature, balanced, nuanced flavors',
        value: 'recent'
      }
    ],
    gifUrl: 'https://ofhteeexidattwcdilpw.supabase.co/storage/v1/object/public/videos//05step.gif'
  },
  {
    id: 6,
    type: 'question',
    title: 'What was the setting or environment?',
    description: 'The atmosphere and location will influence the cooking method and presentation.',
    options: [
      {
        title: 'Cozy indoor space',
        description: 'Home, restaurant, intimate setting'
      },
      {
        title: 'Outdoor adventure',
        description: 'Beach, mountain, park, garden'
      },
      {
        title: 'Urban environment',
        description: 'City streets, cafes, bustling atmosphere'
      },
      {
        title: 'Special venue',
        description: 'Wedding hall, theater, unique location'
      }
    ],
    customOption: {
      title: 'A different place',
      placeholder: 'Describe where this happened...'
    },
    gifUrl: 'https://ofhteeexidattwcdilpw.supabase.co/storage/v1/object/public/videos//06step.gif'
  },
  {
    id: 7,
    type: 'controls',
    title: 'Fine-tune Your Recipe',
    description: 'Adjust the final details to perfect your dumpling recipe.',
    controls: {
      temperature: {
        label: 'Cooking Intensity',
        min: 0,
        max: 100,
        defaultValue: 50,
        icon: Thermometer
      },
      shape: {
        label: 'Dumpling Shape',
        options: ['Traditional Pleated', 'Half-Moon', 'Potsticker', 'Soup Dumpling', 'Wontons'],
        defaultIndex: 0,
        icon: Utensils
      },
      flavor: {
        label: 'Flavor Profile',
        options: ['Savory', 'Sweet & Savory', 'Spicy', 'Mild & Comforting', 'Bold & Complex'],
        defaultIndex: 0,
        icon: Star
      },
      enhancer: {
        label: 'Special Touch',
        placeholder: 'Add any special ingredients or techniques that would make this recipe uniquely yours...',
        icon: Sparkles
      }
    }
  }
];
