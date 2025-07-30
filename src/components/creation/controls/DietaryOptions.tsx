import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface DietaryOptionsProps {
  dietaryValues: {
    vegan: boolean;
    vegetarian: boolean;
    allergies: string;
    specialDiet: boolean;
  };
  onDietaryChange: (field: keyof DietaryOptionsProps['dietaryValues'], value: boolean | string) => void;
}

const DietaryOptions: React.FC<DietaryOptionsProps> = ({
  dietaryValues,
  onDietaryChange
}) => {
  return (
    <div className="w-full bg-black/20 backdrop-blur-sm border-2 border-green-400/20 rounded-2xl p-6 mb-6 shadow-lg shadow-green-400/5">
      <h3 className="text-center text-white/90 font-mono font-bold mb-4">Dietary Preferences</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Vegan Option */}
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="vegan"
            checked={dietaryValues.vegan}
            onCheckedChange={(checked) => onDietaryChange('vegan', checked as boolean)}
            className="border-green-400/50 data-[state=checked]:bg-green-400 data-[state=checked]:text-black"
          />
          <Label htmlFor="vegan" className="text-white/80 font-mono">Vegan</Label>
        </div>

        {/* Vegetarian Option */}
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="vegetarian"
            checked={dietaryValues.vegetarian}
            onCheckedChange={(checked) => onDietaryChange('vegetarian', checked as boolean)}
            className="border-green-400/50 data-[state=checked]:bg-green-400 data-[state=checked]:text-black"
          />
          <Label htmlFor="vegetarian" className="text-white/80 font-mono">Vegetarian</Label>
        </div>

        {/* Special Diet Option */}
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="specialDiet"
            checked={dietaryValues.specialDiet}
            onCheckedChange={(checked) => onDietaryChange('specialDiet', checked as boolean)}
            className="border-green-400/50 data-[state=checked]:bg-green-400 data-[state=checked]:text-black"
          />
          <Label htmlFor="specialDiet" className="text-white/80 font-mono">Special Diet</Label>
        </div>
      </div>

      {/* Allergies Text Area */}
      <div className="mt-4">
        <Label htmlFor="allergies" className="text-white/80 font-mono mb-2 block">Allergies (optional)</Label>
        <Textarea
          id="allergies"
          value={dietaryValues.allergies}
          onChange={(e) => onDietaryChange('allergies', e.target.value)}
          placeholder="Please describe any food allergies or intolerances..."
          className="bg-black/30 border-green-400/30 text-white/90 placeholder:text-white/50 focus:border-green-400 font-mono min-h-[80px]"
        />
      </div>
    </div>
  );
};

export default DietaryOptions;