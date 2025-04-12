
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

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

// Sample food items for demo
const sampleFoods: FoodItem[] = [
  {
    id: "food-1",
    name: "Oatmeal with Berries",
    calories: 350,
    protein: 12,
    carbs: 60,
    sugar: 15,
    fat: 6,
    date: new Date().toISOString(),
  },
  {
    id: "food-2",
    name: "Grilled Chicken Salad",
    calories: 420,
    protein: 35,
    carbs: 20,
    sugar: 5,
    fat: 22,
    date: new Date().toISOString(),
  },
  // Add some sample foods from previous days for the monthly chart
  {
    id: "food-3",
    name: "Avocado Toast",
    calories: 320,
    protein: 8,
    carbs: 30,
    sugar: 2,
    fat: 18,
    date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
  },
  {
    id: "food-4",
    name: "Protein Smoothie",
    calories: 280,
    protein: 25,
    carbs: 35,
    sugar: 20,
    fat: 5,
    date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
  },
  {
    id: "food-5",
    name: "Salmon with Veggies",
    calories: 450,
    protein: 40,
    carbs: 15,
    sugar: 3,
    fat: 25,
    date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
  },
];

export const FoodProvider = ({ children }: { children: ReactNode }) => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const { toast } = useToast();

  // Load foods from localStorage on initial load
  useEffect(() => {
    try {
      const storedFoods = localStorage.getItem('calovate_foods');
      if (storedFoods) {
        const parsedFoods = JSON.parse(storedFoods);
        console.log("Loaded foods from localStorage:", parsedFoods.length, "items");
        setFoods(parsedFoods);
      } else {
        // Use sample foods for demo
        console.log("No stored foods found, using sample data");
        setFoods(sampleFoods);
        // Store sample foods in localStorage
        localStorage.setItem('calovate_foods', JSON.stringify(sampleFoods));
      }
    } catch (error) {
      console.error("Error loading foods from localStorage:", error);
      // Fallback to sample foods
      setFoods(sampleFoods);
    }
  }, []);

  // Save foods to localStorage when it changes
  useEffect(() => {
    try {
      if (foods.length > 0) {
        console.log("Saving foods to localStorage:", foods.length, "items");
        localStorage.setItem('calovate_foods', JSON.stringify(foods));
      }
    } catch (error) {
      console.error("Error saving foods to localStorage:", error);
    }
  }, [foods]);

  const addFood = (food: Omit<FoodItem, "id" | "date">) => {
    const newFood: FoodItem = {
      ...food,
      id: `food-${Date.now()}`,
      date: new Date().toISOString(),
    };
    
    setFoods((prevFoods) => [...prevFoods, newFood]);
    console.log("Food added:", newFood);
    
    toast({
      title: "Food added!",
      description: `${food.name} has been added to your log.`,
    });
  };

  const editFood = (id: string, food: Omit<FoodItem, "id" | "date">) => {
    setFoods((prevFoods) =>
      prevFoods.map((item) =>
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
  };

  const deleteFood = (id: string) => {
    const foodToDelete = foods.find((food) => food.id === id);
    setFoods((prevFoods) => prevFoods.filter((food) => food.id !== id));
    
    console.log("Food deleted:", id);
    
    if (foodToDelete) {
      toast({
        title: "Food removed",
        description: `${foodToDelete.name} has been removed from your log.`,
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

  const clearFoods = () => {
    setFoods([]);
    localStorage.removeItem('calovate_foods');
    console.log("Food log cleared");
    
    toast({
      title: "Food log cleared",
      description: "All food entries have been cleared.",
    });
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
