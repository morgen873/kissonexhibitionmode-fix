
import React, { useState } from 'react';
import { containsProfanity } from '@/utils/profanityFilter';

interface EnhancerInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
}

const EnhancerInput: React.FC<EnhancerInputProps> = ({
    value,
    onChange,
    placeholder = "You can add a special ingredient here..."
}) => {
    const [profanityWarning, setProfanityWarning] = useState(false);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        
        // Check for profanity
        if (containsProfanity(text)) {
            setProfanityWarning(true);
            // Don't update the value if it contains profanity
            return;
        } else {
            setProfanityWarning(false);
            onChange(e);
        }
    };

    return (
        <div className="w-full">
            <textarea
                className={`w-full bg-black/30 border-2 border-green-400/30 text-white/90 placeholder:text-white/50 focus:border-green-400 font-mono touch-32-textarea rounded-lg px-3 py-2 text-center resize-none transition focus:outline-none ${
                    profanityWarning ? 'border-red-500' : ''
                }`}
                value={value}
                onChange={handleTextChange}
                placeholder={placeholder}
            />
            {profanityWarning && (
                <p className="text-red-400 responsive-text-sm mt-3 font-mono text-center">
                    Please use appropriate language. Food-related terms like "black pepper" or "white sauce" are allowed.
                </p>
            )}
        </div>
    );
};

export default EnhancerInput;
