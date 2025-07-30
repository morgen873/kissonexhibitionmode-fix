
import React from 'react';

interface IngredientsProps {
    ingredients: any;
}

const IngredientsList: React.FC<IngredientsProps> = ({ ingredients }) => {
    if (!ingredients || typeof ingredients !== 'object' || Array.isArray(ingredients) || Object.keys(ingredients).length === 0) {
        return <p className="text-muted-foreground mt-4">No ingredients provided or format is incorrect.</p>;
    }

    return (
        <div className="text-muted-foreground mt-4 space-y-4">
            {Object.entries(ingredients).map(([category, items]) => {
                if (!Array.isArray(items)) return null;

                return (
                    <div key={category}>
                        <h4 className="responsive-text-md font-semibold text-foreground mb-2">{category}</h4>
                        <ul className="list-disc list-inside space-y-1 pl-4 responsive-text-sm">
                            {items.map((item, index) => {
                                // Clean up the ingredient text - remove extra quotes and formatting
                                const cleanItem = String(item)
                                    .replace(/^["']|["']$/g, '') // Remove leading/trailing quotes
                                    .replace(/\\"/g, '"') // Replace escaped quotes
                                    .trim();
                                return (
                                    <li key={index}>{cleanItem}</li>
                                );
                            })}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
};

export default IngredientsList;
