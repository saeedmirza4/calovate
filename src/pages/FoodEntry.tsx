import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useFood, FoodItem } from "@/contexts/FoodContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Apple, Fish, Egg, Utensils, Pizza, Sandwich, CupSoda, Coffee, IceCreamCone, Cookie, Beef, Salad } from "lucide-react";
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FoodItemCard from "@/components/dashboard/FoodItemCard";

interface FoodFormValues {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  sugar: number;
  fat: number;
}

const initialValues: FoodFormValues = {
  name: "",
  calories: 0,
  protein: 0,
  carbs: 0,
  sugar: 0,
  fat: 0,
};

const FoodEntry = () => {
  const [formValues, setFormValues] = useState<FoodFormValues>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser, isLoading } = useAuth();
  const { addFood, getTodaysFoods, deleteFood } = useFood();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const todaysFoods = getTodaysFoods();

  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate("/login");
    }
  }, [currentUser, isLoading, navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-calovate-primary border-t-transparent"></div>
      </div>
    );
  }
  
  if (!currentUser) {
    return null; // Will redirect in the useEffect
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "calories" || name === "protein" || name === "carbs" || name === "sugar" || name === "fat") {
      setFormValues({
        ...formValues,
        [name]: value ? parseFloat(value) : 0,
      });
    } else {
      setFormValues({
        ...formValues,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formValues.name) {
      toast({
        title: "Error",
        description: "Please enter a food name",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      addFood(formValues);
      setFormValues(initialValues);
      toast({
        title: "Food added!",
        description: `${formValues.name} has been added to your log.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleQuickAdd = (template: Partial<FoodFormValues>) => {
    setFormValues({
      ...initialValues,
      ...template,
    });
    
    toast({
      title: "Template loaded",
      description: "Food details loaded. Adjust as needed and click 'Add Food'.",
    });
  };

  const commonFoods = {
    proteins: [
      {
        name: "Chicken Breast",
        calories: 165,
        protein: 31,
        carbs: 0,
        sugar: 0,
        fat: 3.6,
        icon: <Utensils className="mr-2 h-4 w-4" />
      },
      {
        name: "Eggs (2)",
        calories: 143,
        protein: 12.6,
        carbs: 0.8,
        sugar: 0.8,
        fat: 9.5,
        icon: <Egg className="mr-2 h-4 w-4" />
      },
      {
        name: "Salmon (100g)",
        calories: 206,
        protein: 22,
        carbs: 0,
        sugar: 0,
        fat: 13,
        icon: <Fish className="mr-2 h-4 w-4" />
      },
      {
        name: "Ground Beef (100g)",
        calories: 250,
        protein: 26,
        carbs: 0,
        sugar: 0,
        fat: 17,
        icon: <Beef className="mr-2 h-4 w-4" />
      }
    ],
    carbs: [
      {
        name: "Oatmeal (1 cup)",
        calories: 150,
        protein: 5,
        carbs: 27,
        sugar: 1,
        fat: 2.5,
        icon: <Utensils className="mr-2 h-4 w-4" />
      },
      {
        name: "Brown Rice (1 cup)",
        calories: 216,
        protein: 5,
        carbs: 45,
        sugar: 0,
        fat: 1.8,
        icon: <Utensils className="mr-2 h-4 w-4" />
      },
      {
        name: "Whole Wheat Bread (1 slice)",
        calories: 81,
        protein: 4,
        carbs: 13.8,
        sugar: 1.4,
        fat: 1.1,
        icon: <Sandwich className="mr-2 h-4 w-4" />
      }
    ],
    fruits: [
      {
        name: "Banana",
        calories: 105,
        protein: 1.3,
        carbs: 27,
        sugar: 14,
        fat: 0.4,
        icon: <Apple className="mr-2 h-4 w-4" />
      },
      {
        name: "Apple",
        calories: 95,
        protein: 0.5,
        carbs: 25,
        sugar: 19,
        fat: 0.3,
        icon: <Apple className="mr-2 h-4 w-4" />
      },
      {
        name: "Blueberries (1 cup)",
        calories: 84,
        protein: 1.1,
        carbs: 21,
        sugar: 15,
        fat: 0.5,
        icon: <Apple className="mr-2 h-4 w-4" />
      }
    ],
    dairy: [
      {
        name: "Greek Yogurt (1 cup)",
        calories: 100,
        protein: 17,
        carbs: 6,
        sugar: 4,
        fat: 0.7,
        icon: <Utensils className="mr-2 h-4 w-4" />
      },
      {
        name: "Milk (1 cup)",
        calories: 103,
        protein: 8,
        carbs: 12,
        sugar: 12,
        fat: 2.4,
        icon: <CupSoda className="mr-2 h-4 w-4" />
      },
      {
        name: "Cheddar Cheese (30g)",
        calories: 113,
        protein: 7,
        carbs: 0.4,
        sugar: 0.1,
        fat: 9.3,
        icon: <Utensils className="mr-2 h-4 w-4" />
      }
    ],
    snacks: [
      {
        name: "Mixed Nuts (30g)",
        calories: 173,
        protein: 5.5,
        carbs: 6.1,
        sugar: 1.2,
        fat: 15.2,
        icon: <Utensils className="mr-2 h-4 w-4" />
      },
      {
        name: "Dark Chocolate (30g)",
        calories: 170,
        protein: 2,
        carbs: 13,
        sugar: 10,
        fat: 12,
        icon: <Cookie className="mr-2 h-4 w-4" />
      },
      {
        name: "Ice Cream (1 scoop)",
        calories: 137,
        protein: 2.5,
        carbs: 16,
        sugar: 14,
        fat: 7.3,
        icon: <IceCreamCone className="mr-2 h-4 w-4" />
      }
    ],
    meals: [
      {
        name: "Pizza (1 slice)",
        calories: 285,
        protein: 12,
        carbs: 36,
        sugar: 3.8,
        fat: 10.4,
        icon: <Pizza className="mr-2 h-4 w-4" />
      },
      {
        name: "Caesar Salad",
        calories: 230,
        protein: 8,
        carbs: 12,
        sugar: 3,
        fat: 16,
        icon: <Salad className="mr-2 h-4 w-4" />
      },
      {
        name: "Cheeseburger",
        calories: 354,
        protein: 20,
        carbs: 27,
        sugar: 5,
        fat: 17,
        icon: <Sandwich className="mr-2 h-4 w-4" />
      }
    ],
    beverages: [
      {
        name: "Coffee (black)",
        calories: 2,
        protein: 0.2,
        carbs: 0,
        sugar: 0,
        fat: 0,
        icon: <Coffee className="mr-2 h-4 w-4" />
      },
      {
        name: "Orange Juice (1 cup)",
        calories: 111,
        protein: 1.7,
        carbs: 26,
        sugar: 21,
        fat: 0.5,
        icon: <CupSoda className="mr-2 h-4 w-4" />
      },
      {
        name: "Soda (12 oz)",
        calories: 140,
        protein: 0,
        carbs: 39,
        sugar: 39,
        fat: 0,
        icon: <CupSoda className="mr-2 h-4 w-4" />
      }
    ]
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Log Your Food</CardTitle>
                  <CardDescription>
                    Track what you're eating by adding food details below
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="name">Food Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="e.g., Grilled Chicken Salad"
                        value={formValues.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label htmlFor="calories">Calories</Label>
                        <Input
                          id="calories"
                          name="calories"
                          type="number"
                          min="0"
                          step="1"
                          placeholder="0"
                          value={formValues.calories || ""}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="protein">Protein (g)</Label>
                        <Input
                          id="protein"
                          name="protein"
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="0"
                          value={formValues.protein || ""}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="carbs">Carbs (g)</Label>
                        <Input
                          id="carbs"
                          name="carbs"
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="0"
                          value={formValues.carbs || ""}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="sugar">Sugar (g)</Label>
                        <Input
                          id="sugar"
                          name="sugar"
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="0"
                          value={formValues.sugar || ""}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="fat">Fat (g)</Label>
                        <Input
                          id="fat"
                          name="fat"
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="0"
                          value={formValues.fat || ""}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full bg-calovate-primary hover:bg-calovate-primary/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Add Food
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-xl">Quick Add</CardTitle>
                  <CardDescription>
                    Common food templates to help you log faster
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Proteins</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {commonFoods.proteins.map((food) => (
                          <Button
                            key={food.name}
                            variant="outline"
                            className="justify-start"
                            onClick={() => handleQuickAdd(food)}
                          >
                            {food.icon}
                            {food.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Carbs</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {commonFoods.carbs.map((food) => (
                          <Button
                            key={food.name}
                            variant="outline"
                            className="justify-start"
                            onClick={() => handleQuickAdd(food)}
                          >
                            {food.icon}
                            {food.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Fruits</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {commonFoods.fruits.map((food) => (
                          <Button
                            key={food.name}
                            variant="outline"
                            className="justify-start"
                            onClick={() => handleQuickAdd(food)}
                          >
                            {food.icon}
                            {food.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Dairy</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {commonFoods.dairy.map((food) => (
                          <Button
                            key={food.name}
                            variant="outline"
                            className="justify-start"
                            onClick={() => handleQuickAdd(food)}
                          >
                            {food.icon}
                            {food.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Snacks</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {commonFoods.snacks.map((food) => (
                          <Button
                            key={food.name}
                            variant="outline"
                            className="justify-start"
                            onClick={() => handleQuickAdd(food)}
                          >
                            {food.icon}
                            {food.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Common Meals</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {commonFoods.meals.map((food) => (
                          <Button
                            key={food.name}
                            variant="outline"
                            className="justify-start"
                            onClick={() => handleQuickAdd(food)}
                          >
                            {food.icon}
                            {food.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Beverages</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {commonFoods.beverages.map((food) => (
                          <Button
                            key={food.name}
                            variant="outline"
                            className="justify-start"
                            onClick={() => handleQuickAdd(food)}
                          >
                            {food.icon}
                            {food.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Today's Entries</CardTitle>
                  <CardDescription>
                    Food you've logged today
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {todaysFoods.length > 0 ? (
                    <div className="space-y-3">
                      {todaysFoods.map((food) => (
                        <FoodItemCard key={food.id} food={food} onDelete={deleteFood} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No foods logged today
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/dashboard")}
                  >
                    Back to Dashboard
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FoodEntry;
