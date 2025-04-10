
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useFood, FoodItem } from "@/contexts/FoodContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
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
    
    // Convert to number if it's a numeric field
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
            {/* Food Entry Form */}
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
              
              {/* Quick Add Templates */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-xl">Quick Add</CardTitle>
                  <CardDescription>
                    Common food templates to help you log faster
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() =>
                        handleQuickAdd({
                          name: "Chicken Breast",
                          calories: 165,
                          protein: 31,
                          carbs: 0,
                          sugar: 0,
                          fat: 3.6,
                        })
                      }
                    >
                      Chicken Breast
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        handleQuickAdd({
                          name: "Oatmeal",
                          calories: 150,
                          protein: 5,
                          carbs: 27,
                          sugar: 1,
                          fat: 2.5,
                        })
                      }
                    >
                      Oatmeal
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        handleQuickAdd({
                          name: "Banana",
                          calories: 105,
                          protein: 1.3,
                          carbs: 27,
                          sugar: 14,
                          fat: 0.4,
                        })
                      }
                    >
                      Banana
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        handleQuickAdd({
                          name: "Greek Yogurt",
                          calories: 100,
                          protein: 17,
                          carbs: 6,
                          sugar: 4,
                          fat: 0.7,
                        })
                      }
                    >
                      Greek Yogurt
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Entries */}
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
