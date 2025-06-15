
import { ChefHat, Heart, Sparkles } from "lucide-react";
import type { ComponentType } from "react";

export interface IntroStepData {
    type: 'hero' | 'explanation' | 'quote';
    icon?: ComponentType<{ className?: string }>;
    title: string | string[];
    description?: string;
    theme?: {
        border: string;
        shadow: string;
        hoverBorder: string;
        titleGradient: string;
        iconGradient: string;
    };
    buttonText?: string;
}

export const introSteps: IntroStepData[] = [
    {
        type: 'hero',
        title: 'From Feeling To Filling',
        description: 'Our AI transforms your feelings into delicious, one-of-a-kind dumpling recipes.',
        buttonText: 'Start The Experience',
    },
    {
        type: 'explanation',
        icon: Heart,
        title: ['SHARE A', 'FEELING'],
        description: 'Share a feeling, a memory, or a dream with our AI.',
        theme: {
            border: "border-pink-400/50",
            shadow: "hover:shadow-pink-500/25",
            hoverBorder: "hover:border-pink-300",
            titleGradient: "from-pink-300 to-yellow-300",
            iconGradient: "from-pink-400 via-purple-500 to-cyan-400",
        }
    },
    {
        type: 'explanation',
        icon: Sparkles,
        title: ['AI', 'TRANSLATION'],
        description: 'Our AI translates your input into a unique dumpling recipe.',
        theme: {
            border: "border-purple-400/50",
            shadow: "hover:shadow-purple-500/25",
            hoverBorder: "hover:border-purple-300",
            titleGradient: "from-purple-300 to-cyan-300",
            iconGradient: "from-purple-400 via-indigo-500 to-pink-400",
        }
    },
    {
        type: 'explanation',
        icon: ChefHat,
        title: ['CREATE &', 'TASTE'],
        description: 'Create your KissOn dumpling and taste the feeling.',
        theme: {
            border: "border-cyan-400/50",
            shadow: "hover:shadow-cyan-500/25",
            hoverBorder: "hover:border-cyan-300",
            titleGradient: "from-cyan-300 to-green-300",
            iconGradient: "from-cyan-400 via-green-500 to-yellow-400",
        }
    },
    {
        type: 'quote',
        title: '"EVERY DUMPLING IS A PORTAL, EVERY BITE A TIME MACHINE"',
        description: "- KissOn",
        buttonText: "Let's Begin Creation"
    }
];
