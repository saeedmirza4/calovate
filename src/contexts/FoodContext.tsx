
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  addFoodItem, 
  getFoodsByUserId, 
  updateFoodItem, 
  deleteFoodItem,
  DbFood
} from "@/lib/supabase";

export type FoodItem = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  sugar: number;
  fat: number;
  date: string; // ISO String
};

interface FoodContextType {
  foods: FoodItem[];
  addFood: (food: Omit<FoodItem, "id" | "date">) => void;
  editFood: (id: string, food: Omit<FoodItem, "id" | "date">) => void;
  deleteFood: (id: string) => void;
  getTodaysFoods: () => FoodItem[];
  getTotalNutrition: (foods: FoodItem[]) => {
    calories: number;
    protein: number;
    carbs: number;
    sugar: number;
    fat: number;
  };
  clearFoods: () => void;
}

const FoodContext = createContext<FoodContextType | undefined>(undefined);

export const useFood = () => {
  const context = useContext(FoodContext);
  if (context === undefined) {
    throw new Error("useFood must be used within a FoodProvider");
  }
  return context;
};

export const FoodProvider = ({ children }: { children: ReactNode }) => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // Load foods from Supabase when user is signed in
  useEffect(() => {
    const loadFoods = async () => {
      if (!currentUser) {
        setFoods([]);
        return;
      }

      try {
        const loadedFoods = await getFoodsByUserId(currentUser.id);
        setFoods(loadedFoods.map(food => ({
          id: food.id,
          name: food.name,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          sugar: food.sugar,
          fat: food.fat,
          date: food.date,
        })));
        console.log("Loaded foods from Supabase:", loadedFoods.length, "items");
      } catch (error) {
        console.error("Error loading foods:", error);
      }
    };

    loadFoods();
  }, [currentUser]);

  const addFood = async (food: Omit<FoodItem, "id" | "date">) => {
    if (!currentUser) return;
    
    try {
      const today = new Date().toISOString();
      
      const newFood = await addFoodItem({
        ...food,
        user_id: currentUser.id,
        date: today,
      });
      
      const foodItem: FoodItem = {
        id: newFood.id,
        name: newFood.name,
        calories: newFood.calories,
        protein: newFood.protein,
        carbs: newFood.carbs,
        sugar: newFood.sugar,
        fat: newFood.fat,
        date: newFood.date,
      };
      
      setFoods(prevFoods => [...prevFoods, foodItem]);
      console.log("Food added:", foodItem);
      
      toast({
        title: "Food added!",
        description: `${food.name} has been added to your log.`,
      });
    } catch (error) {
      console.error("Error adding food:", error);
      toast({
        title: "Error",
        description: "Failed to add food. Please try again.",
        variant: "destructive",
      });
    }
  };

  const editFood = async (id: string, food: Omit<FoodItem, "id" | "date">) => {
    if (!currentUser) return;
    
    try {
      await updateFoodItem(id, food);
      
      setFoods(prevFoods =>
        prevFoods.map(item =>
          item.id === id
            ? { ...item, ...food }
            : item
        )
      );
      
      console.log("Food updated:", id);
      
      toast({
        title: "Food updated!",
        description: `${food.name} has been updated.`,
      });
    } catch (error) {
      console.error("Error updating food:", error);
      toast({
        title: "Error",
        description: "Failed to update food. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteFood = async (id: string) => {
    if (!currentUser) return;
    
    const foodToDelete = foods.find((food) => food.id === id);
    if (!foodToDelete) return;
    
    try {
      await deleteFoodItem(id);
      
      setFoods(prevFoods => prevFoods.filter(food => food.id !== id));
      console.log("Food deleted:", id);
      
      toast({
        title: "Food removed",
        description: `${foodToDelete.name} has been removed from your log.`,
      });
    } catch (error) {
      console.error("Error deleting food:", error);
      toast({
        title: "Error",
        description: "Failed to remove food. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getTodaysFoods = () => {
    const today = new Date().toISOString().split('T')[0];
    const todaysFoods = foods.filter((food) => food.date.startsWith(today));
    console.log("Today's foods:", todaysFoods.length, "items");
    return todaysFoods;
  };

  const getTotalNutrition = (foodList: FoodItem[]) => {
    return foodList.reduce(
      (acc, food) => {
        return {
          calories: acc.calories + food.calories,
          protein: acc.protein + food.protein,
          carbs: acc.carbs + food.carbs,
          sugar: acc.sugar + food.sugar,
          fat: acc.fat + food.fat,
        };
      },
      { calories: 0, protein: 0, carbs: 0, sugar: 0, fat: 0 }
    );
  };

  const clearFoods = async () => {
    if (!currentUser) return;
    
    // This is a potentially dangerous operation, so add confirmation in the UI before calling this
    try {
      // For each food item that belongs to the current user, delete it
      for (const food of foods) {
        await deleteFoodItem(food.id);
      }
      
      setFoods([]);
      console.log("Food log cleared");
      
      toast({
        title: "Food log cleared",
        description: "All food entries have been cleared.",
      });
    } catch (error) {
      console.error("Error clearing foods:", error);
      toast({
        title: "Error",
        description: "Failed to clear food log. Please try again.",
        variant: "destructive",
      });
    }
  };

  const value = {
    foods,
    addFood,
    editFood,
    deleteFood,
    getTodaysFoods,
    getTotalNutrition,
    clearFoods,
  };

  return <FoodContext.Provider value={value}>{children}</FoodContext.Provider>;
};
