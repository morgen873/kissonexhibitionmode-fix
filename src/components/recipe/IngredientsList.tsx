
import React from 'react';

interface IngredientsProps {
    ingredients: any;
}

const IngredientsList: React.FC<IngredientsProps> = ({ ingredients }) => {
    if (!ingredients || typeof ingredients !== 'object' || Array.isArray(ingredients) || Object.keys(ingredients).length === 0) {
        return <p className="text-white/80 mt-4">No ingredients provided or format is incorrect.</p>;
    }

    return (
        <div className="text-white/80 mt-4 space-y-4 font-sans">
            {Object.entries(ingredients).map(([category, items]) => {
                if (!Array.isArray(items)) return null;

                return (
                    <div key={category}>
                        <h4 className="text-xl font-semibold text-white/90">{category}</h4>
                        <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
                            {items.map((item, index) => (
                                <li key={index}>{String(item)}</li>
                            ))}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
};

export default IngredientsList;
