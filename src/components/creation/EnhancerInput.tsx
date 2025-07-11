
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
        <div className="touch-spacing">
            <textarea
                rows={1}
                className={`w-full bg-white/10 border-2 touch:border-4 rounded-lg touch:rounded-xl touch-padding responsive-text text-white block transition focus:ring-white focus:border-white font-mono text-center resize-none touch-target ${
                    profanityWarning ? 'border-red-500' : 'border-white/20'
                }`}
                value={value}
                onChange={handleTextChange}
                placeholder={placeholder}
            />
            {profanityWarning && (
                <p className="text-red-400 responsive-text-sm mt-3 touch:mt-4 font-mono text-center">
                    Please use appropriate language. Food-related terms like "black pepper" or "white sauce" are allowed.
                </p>
            )}
        </div>
    );
};

export default EnhancerInput;
