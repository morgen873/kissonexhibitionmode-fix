
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
        <div className="space-y-2">
            <textarea
                rows={2}
                className={`w-full bg-white/10 border rounded-lg p-4 text-white block transition focus:ring-white focus:border-white font-mono text-center resize-none ${
                    profanityWarning ? 'border-red-500 border-2' : 'border-white/20'
                }`}
                value={value}
                onChange={handleTextChange}
                placeholder={placeholder}
            />
            {profanityWarning && (
                <p className="text-red-400 text-sm font-mono text-center">
                    Please use appropriate language. Food-related terms like "black pepper" or "white sauce" are allowed.
                </p>
            )}
        </div>
    );
};

export default EnhancerInput;
