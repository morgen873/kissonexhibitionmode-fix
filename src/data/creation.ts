
import { Step } from "@/types/creation";

export const stepThemes = [
    { // Original theme for step 0
        bg: "from-purple-900 via-pink-900 to-orange-900",
        cardShadow: "shadow-purple-500/20",
        progress: "from-pink-500 to-cyan-500",
        title: "from-cyan-300 via-pink-300 to-yellow-300",
        optionSelectedBorder: "border-cyan-400",
        optionSelectedShadow: "shadow-cyan-400/30",
        optionHover: "hover:border-pink-500",
        textAreaFocus: "focus:ring-pink-500 focus:border-pink-500",
    },
    { // Red theme for step 1
        bg: "from-red-900 via-rose-900 to-orange-800",
        cardShadow: "shadow-red-500/20",
        progress: "from-rose-500 to-red-500",
        title: "from-red-300 via-rose-300 to-orange-300",
        optionSelectedBorder: "border-red-400",
        optionSelectedShadow: "shadow-red-400/30",
        optionHover: "hover:border-rose-500",
        textAreaFocus: "focus:ring-rose-500 focus:border-rose-500",
    },
    { // Blue theme for step 2
        bg: "from-blue-900 via-cyan-900 to-teal-800",
        cardShadow: "shadow-blue-500/20",
        progress: "from-cyan-500 to-blue-500",
        title: "from-blue-300 via-cyan-300 to-teal-300",
        optionSelectedBorder: "border-cyan-400",
        optionSelectedShadow: "shadow-cyan-400/30",
        optionHover: "hover:border-cyan-500",
        textAreaFocus: "focus:ring-cyan-500 focus:border-cyan-500",
    },
    { // Orange theme for step 3
        bg: "from-orange-900 via-amber-900 to-yellow-800",
        cardShadow: "shadow-orange-500/20",
        progress: "from-amber-500 to-orange-500",
        title: "from-orange-300 via-amber-300 to-yellow-300",
        optionSelectedBorder: "border-orange-400",
        optionSelectedShadow: "shadow-orange-400/30",
        optionHover: "hover:border-amber-500",
        textAreaFocus: "focus:ring-amber-500 focus:border-amber-500",
    },
    { // Yellow theme for new steps
        bg: "from-yellow-900 via-amber-800 to-zinc-900",
        cardShadow: "shadow-yellow-500/20",
        progress: "from-amber-500 to-yellow-400",
        title: "from-yellow-300 via-amber-200 to-slate-300",
        optionSelectedBorder: "border-yellow-400",
        optionSelectedShadow: "shadow-yellow-400/30",
        optionHover: "hover:border-yellow-500",
        textAreaFocus: "focus:ring-yellow-500 focus:border-yellow-500",
    },
    { // Same yellow theme for consistency
        bg: "from-yellow-900 via-amber-800 to-zinc-900",
        cardShadow: "shadow-yellow-500/20",
        progress: "from-amber-500 to-yellow-400",
        title: "from-yellow-300 via-amber-200 to-slate-300",
        optionSelectedBorder: "border-yellow-400",
        optionSelectedShadow: "shadow-yellow-400/30",
        optionHover: "hover:border-yellow-500",
        textAreaFocus: "focus:ring-yellow-500 focus:border-yellow-500",
    },
    { // Green theme for the new step
        bg: "from-green-900 via-emerald-900 to-teal-800",
        cardShadow: "shadow-green-500/20",
        progress: "from-emerald-500 to-green-500",
        title: "from-green-300 via-emerald-300 to-teal-300",
        optionSelectedBorder: "border-emerald-400",
        optionSelectedShadow: "shadow-emerald-400/30",
        optionHover: "hover:border-emerald-500",
        textAreaFocus: "focus:ring-emerald-500 focus:border-emerald-500",
    },
    { // Indigo theme for timeline step
        bg: "from-indigo-900 via-purple-900 to-slate-800",
        cardShadow: "shadow-indigo-500/20",
        progress: "from-purple-500 to-indigo-500",
        title: "from-indigo-300 via-purple-300 to-slate-300",
        optionSelectedBorder: "border-indigo-400",
        optionSelectedShadow: "shadow-indigo-400/30",
        optionHover: "hover:border-purple-500",
        textAreaFocus: "focus:ring-purple-500 focus:border-purple-500",
    }
];

export const steps: Step[] = [
    {
        type: 'explanation' as const,
        title: "A Moment of Reflection",
        description: "Before we start cooking, let's pause for a moment. Imagine you're standing in front of an empty table. You can choose any type of dumpling and any emotional connection."
    },
    {
        type: 'question' as const,
        id: 1,
        question: "What kind of memory are you ready to transform into a recipe?",
        options: [
            { title: "A childhood memory", description: "Revisit the flavors and emotions of your early years." },
            { title: "A feeling you want to cherish", description: "Preserve an emotion that brings you warmth." },
            { title: "A profound emotional event", description: "Transform a meaningful life moment into taste." },
            { title: "A story you'd like to pass on to someone", description: "Share wisdom or experience through flavor." },
            { title: "Write your own memory", description: "Express your memory in your own words." },
        ],
        customOption: {
            title: "Write your own memory",
            placeholder: "Describe the memory that inspires your dumpling..."
        }
    },
    {
        type: 'explanation' as const,
        title: "Preparing the Ingredients",
        description: "You've chosen what we're going to cook together.\nNow it's time to prepare the ingredients that will give your story its flavors."
    },
    {
        type: 'question' as const,
        id: 2,
        question: "What emotional ingredients are in your dumpling?",
        options: [
            { title: "Warmth", description: "A comforting and gentle feeling." },
            { title: "Nostalgia", description: "A fond remembrance of the past." },
            { title: "Adventure", description: "A thrilling sense of the unknown." },
            { title: "Curiosity", description: "A desire to explore and understand." },
            { title: "Bittersweet sadness", description: "A beautiful ache of what was." },
            { title: "Silence", description: "A peaceful and contemplative state." },
            { title: "Love", description: "A deep and affectionate connection." },
            { title: "Fear", description: "An intense emotion of facing the unknown." },
            { title: "Add your own emotional ingredient", description: "Define a unique emotion for your recipe." },
        ],
        customOption: {
            title: "Add your own emotional ingredient",
            placeholder: "Enter an emotion not listed above..."
        }
    },
    {
        type: 'explanation' as const,
        title: "Cooking and Dedication",
        description: "Your ingredients are ready. Now it's time to combine, season, and transform.\nThis step is not just about following instructions. It's about temperature, time, intention, and most importantly, who you choose to share it with.\nEvery gesture in this mixture carries the essence of that special person, pet, or soul who will receive this creation."
    },
    {
        type: 'question' as const,
        id: 3,
        question: "Who would you like to dedicate this recipe to?",
        options: [
            { title: "To my grandmother", description: "For the warmth and wisdom she shared." },
            { title: "To a love that is no longer here", description: "Cherishing a bond that transcends presence." },
            { title: "To my past self", description: "Honoring the journey and growth you've experienced." },
            { title: "To someone I haven't met yet", description: "An open invitation of flavor and kindness." },
            { title: "To myself", description: "A delicious act of self-care and appreciation." },
            { title: "To whoever comes next", description: "A welcoming taste for a future connection." },
            { title: "Someone specific", description: "This will personalize your recipe with their special essence." }
        ],
        customOption: {
            title: "Someone specific",
            placeholder: "A name, pet, or someone special..."
        }
    },
    {
        type: 'controls' as const,
        id: 4,
        title: "Adjusting the Intensity",
        description: "How intensely should this memory be experienced? Drag the knobs to adjust temperature, shape, and flavor.",
        controls: {
            temperature: {
                min: 0,
                max: 250,
                unit: "°C",
                defaultValue: 125,
            },
            shape: {
                options: ["star", "triangle", "oval", "bundle", "organic"],
                defaultValue: "oval",
            },
            flavor: {
                options: ["savory", "sweet"],
                defaultValue: "savory",
            },
            enhancer: {
                placeholder: "Add any special touches or modifications...",
                defaultValue: "",
            },
        }
    },
    {
        type: 'timeline' as const,
        id: 5,
        title: "Presentation and Final Emotion",
        description: "Your dish is almost ready.\nIt has been created with memory, emotion, and care. If this dish could be served in a specific time period, when would that be?",
        options: [
            { title: "Distant Past", description: "Traditional recipes featuring ancestral techniques, heritage ingredients, and time-honored methods passed down through generations.", value: "Past 1" },
            { title: "Recent Past", description: "Classic approaches with familiar ingredients and established cooking methods, celebrating culinary traditions from the last century.", value: "Past 2" },
            { title: "Present Day", description: "Contemporary cooking balancing traditional techniques with modern innovations, using seasonally available ingredients.", value: "Present" },
            { title: "Near Future", description: "Forward-thinking recipes incorporating emerging techniques, sustainable practices, and novel ingredient combinations.", value: "Future 1" },
            { title: "Distant Future", description: "Experimental cuisine featuring innovative proteins, molecular gastronomy, cutting-edge techniques, and unexpected flavor pairings.", value: "Future 2" }
        ]
    }
];
