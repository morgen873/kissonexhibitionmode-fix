import { Step } from "@/types/creation";

export const stepThemes = [
    { // Black and white theme for step 0
        bg: "from-gray-900 via-gray-800 to-black",
        cardShadow: "shadow-gray-500/20",
        progress: "from-gray-400 to-white",
        title: "from-gray-100 via-white to-gray-200",
        optionSelectedBorder: "border-white",
        optionSelectedShadow: "shadow-white/30",
        optionHover: "hover:border-gray-300",
        textAreaFocus: "focus:ring-gray-400 focus:border-gray-400",
    },
    { // Black and white theme for step 1
        bg: "from-black via-gray-900 to-gray-800",
        cardShadow: "shadow-black/20",
        progress: "from-gray-500 to-gray-300",
        title: "from-white via-gray-100 to-gray-200",
        optionSelectedBorder: "border-gray-300",
        optionSelectedShadow: "shadow-gray-300/30",
        optionHover: "hover:border-gray-400",
        textAreaFocus: "focus:ring-gray-300 focus:border-gray-300",
    },
    { // Black and white theme for step 2
        bg: "from-gray-800 via-black to-gray-900",
        cardShadow: "shadow-gray-600/20",
        progress: "from-white to-gray-400",
        title: "from-gray-200 via-white to-gray-100",
        optionSelectedBorder: "border-gray-200",
        optionSelectedShadow: "shadow-gray-200/30",
        optionHover: "hover:border-white",
        textAreaFocus: "focus:ring-white focus:border-white",
    },
    { // Black and white theme for step 3
        bg: "from-gray-900 via-black to-gray-700",
        cardShadow: "shadow-gray-400/20",
        progress: "from-gray-300 to-gray-600",
        title: "from-gray-100 via-gray-200 to-white",
        optionSelectedBorder: "border-gray-400",
        optionSelectedShadow: "shadow-gray-400/30",
        optionHover: "hover:border-gray-500",
        textAreaFocus: "focus:ring-gray-500 focus:border-gray-500",
    },
    { // Black and white theme for step 4
        bg: "from-black via-gray-800 to-gray-900",
        cardShadow: "shadow-white/20",
        progress: "from-gray-600 to-gray-200",
        title: "from-white via-gray-100 to-gray-300",
        optionSelectedBorder: "border-gray-500",
        optionSelectedShadow: "shadow-gray-500/30",
        optionHover: "hover:border-gray-600",
        textAreaFocus: "focus:ring-gray-600 focus:border-gray-600",
    },
    { // Black and white theme for step 5
        bg: "from-gray-800 via-gray-900 to-black",
        cardShadow: "shadow-gray-300/20",
        progress: "from-gray-400 to-gray-700",
        title: "from-gray-200 via-gray-100 to-white",
        optionSelectedBorder: "border-gray-300",
        optionSelectedShadow: "shadow-gray-300/30",
        optionHover: "hover:border-gray-400",
        textAreaFocus: "focus:ring-gray-400 focus:border-gray-400",
    },
    { // Black and white theme for step 6
        bg: "from-gray-900 via-gray-700 to-black",
        cardShadow: "shadow-gray-500/20",
        progress: "from-white to-gray-500",
        title: "from-gray-100 via-white to-gray-200",
        optionSelectedBorder: "border-white",
        optionSelectedShadow: "shadow-white/30",
        optionHover: "hover:border-gray-200",
        textAreaFocus: "focus:ring-gray-200 focus:border-gray-200",
    },
    { // Black and white theme for timeline step
        bg: "from-black via-gray-800 to-gray-900",
        cardShadow: "shadow-gray-400/20",
        progress: "from-gray-500 to-gray-300",
        title: "from-white via-gray-100 to-gray-200",
        optionSelectedBorder: "border-gray-400",
        optionSelectedShadow: "shadow-gray-400/30",
        optionHover: "hover:border-gray-500",
        textAreaFocus: "focus:ring-gray-500 focus:border-gray-500",
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
        multiSelect: true,
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
            { 
                title: "Past", 
                description: "Traditional recipes featuring ancestral techniques, heritage ingredients, and time-honored methods passed down through generations with authentic historical preparation.", 
                value: "Past" 
            },
            { 
                title: "Present", 
                description: "Contemporary cooking balancing traditional techniques with modern innovations, using seasonally available ingredients and current culinary trends.", 
                value: "Present" 
            },
            { 
                title: "Future", 
                description: "Experimental cuisine featuring innovative proteins, molecular gastronomy, cutting-edge techniques, and unexpected flavor pairings with futuristic presentation.", 
                value: "Future" 
            }
        ]
    }
];
