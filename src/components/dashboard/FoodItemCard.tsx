
import { FoodItem } from "@/contexts/FoodContext";
import { Trash2 } from "lucide-react";

interface FoodItemCardProps {
  food: FoodItem;
  onDelete: (id: string) => void;
  onEdit?: (food: FoodItem) => void;
}

const FoodItemCard = ({ food, onDelete, onEdit }: FoodItemCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 transition hover:shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-800">{food.name}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(food.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <button 
          onClick={() => onDelete(food.id)}
          className="text-gray-400 hover:text-red-500 transition"
          aria-label="Delete food"
        >
          <Trash2 size={18} />
        </button>
      </div>
      
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center">
          <span className="w-3 h-3 bg-calovate-primary rounded-full mr-2"></span>
          <span className="text-gray-600">{food.calories} cal</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
          <span className="text-gray-600">{food.protein}g protein</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
          <span className="text-gray-600">{food.carbs}g carbs</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
          <span className="text-gray-600">{food.fat}g fat</span>
        </div>
      </div>
      
      {onEdit && (
        <button 
          onClick={() => onEdit(food)}
          className="mt-3 text-sm text-calovate-secondary hover:text-calovate-primary transition"
        >
          Edit
        </button>
      )}
    </div>
  );
};

export default FoodItemCard;
