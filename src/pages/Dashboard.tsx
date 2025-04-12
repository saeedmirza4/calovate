
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useFood } from "@/contexts/FoodContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NutrientProgressBar from "@/components/dashboard/NutrientProgressBar";
import CircularProgress from "@/components/dashboard/CircularProgress";
import FoodItemCard from "@/components/dashboard/FoodItemCard";
import MonthlyNutritionChart from "@/components/dashboard/MonthlyNutritionChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Utensils, CalendarRange } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { currentUser, isLoading } = useAuth();
  const { foods, getTodaysFoods, getTotalNutrition, deleteFood } = useFood();
  const navigate = useNavigate();
  
  const todaysFoods = getTodaysFoods();
  const totalNutrition = getTotalNutrition(todaysFoods);
  
  const caloriePercentage = Math.min(
    Math.round((totalNutrition.calories / (currentUser?.goals.calories || 1)) * 100),
    100
  );
  
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
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            
            {/* Left Section - Summary and Progress */}
            <div className="w-full md:w-2/3 space-y-6">
              
              {/* Welcome & Summary Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-medium">
                    Welcome back, {currentUser?.name}!
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-6 items-center">
                    <div className="flex-shrink-0">
                      <CircularProgress
                        percentage={caloriePercentage}
                        size={160}
                        strokeWidth={12}
                        circleOneStroke="#ddd"
                        circleTwoStroke="#4ade80"
                      >
                        <div className="text-center">
                          <div className="text-3xl font-bold">{caloriePercentage}%</div>
                          <div className="text-sm text-gray-500">of daily goal</div>
                        </div>
                      </CircularProgress>
                    </div>
                    
                    <div className="flex-grow w-full">
                      <h3 className="text-lg font-medium mb-3">Today's Progress</h3>
                      
                      <NutrientProgressBar
                        label="Calories"
                        current={totalNutrition.calories}
                        goal={currentUser?.goals.calories || 2000}
                        color="green"
                        unit=""
                      />
                      
                      <NutrientProgressBar
                        label="Protein"
                        current={totalNutrition.protein}
                        goal={currentUser?.goals.protein || 120}
                        color="blue"
                      />
                      
                      <NutrientProgressBar
                        label="Carbs"
                        current={totalNutrition.carbs}
                        goal={currentUser?.goals.carbs || 250}
                        color="yellow"
                      />
                      
                      <NutrientProgressBar
                        label="Sugar"
                        current={totalNutrition.sugar}
                        goal={currentUser?.goals.sugar || 50}
                        color="red"
                      />
                      
                      <NutrientProgressBar
                        label="Fat"
                        current={totalNutrition.fat}
                        goal={currentUser?.goals.fat || 70}
                        color="purple"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Monthly Nutrition Chart */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-xl font-medium">Monthly Nutrition Overview</CardTitle>
                  <div className="flex items-center text-gray-500">
                    <CalendarRange size={18} className="mr-1" />
                    <span className="text-sm">Current Month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <MonthlyNutritionChart foods={foods} />
                </CardContent>
              </Card>
              
              {/* Today's Foods */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="text-xl font-medium">Today's Foods</CardTitle>
                  <Button asChild size="sm" variant="outline" className="border-calovate-primary text-calovate-primary hover:bg-calovate-neutral">
                    <Link to="/food-entry">
                      <PlusCircle size={16} className="mr-1" />
                      Add Food
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {todaysFoods.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {todaysFoods.map((food) => (
                        <FoodItemCard key={food.id} food={food} onDelete={deleteFood} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Utensils className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No foods logged today</h3>
                      <p className="text-gray-500 mb-4">Start tracking your nutrition by adding what you eat</p>
                      <Button asChild variant="default" className="bg-calovate-primary hover:bg-calovate-primary/90">
                        <Link to="/food-entry">Add Your First Meal</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Right Section - Nutrient Breakdown */}
            <div className="w-full md:w-1/3 space-y-6">
              {/* Nutrient Breakdown Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-medium">Nutrient Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Protein</span>
                        <span className="text-sm">{totalNutrition.protein}g</span>
                      </div>
                      <div className="w-full bg-blue-100 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{
                            width: `${Math.min(
                              (totalNutrition.protein / (currentUser?.goals.protein || 1)) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Carbs</span>
                        <span className="text-sm">{totalNutrition.carbs}g</span>
                      </div>
                      <div className="w-full bg-yellow-100 rounded-full h-1.5">
                        <div
                          className="bg-yellow-500 h-1.5 rounded-full"
                          style={{
                            width: `${Math.min(
                              (totalNutrition.carbs / (currentUser?.goals.carbs || 1)) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Fat</span>
                        <span className="text-sm">{totalNutrition.fat}g</span>
                      </div>
                      <div className="w-full bg-purple-100 rounded-full h-1.5">
                        <div
                          className="bg-purple-500 h-1.5 rounded-full"
                          style={{
                            width: `${Math.min(
                              (totalNutrition.fat / (currentUser?.goals.fat || 1)) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <h4 className="font-medium mb-3">Calorie Sources</h4>
                      <div className="relative h-40">
                        {/* This would be a pie chart in a real implementation */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                            <div className="relative w-full h-full">
                              <div className="absolute inset-0" style={{ 
                                background: `conic-gradient(
                                  #60a5fa ${(totalNutrition.protein * 4 / (totalNutrition.calories || 1) || 0) * 360}deg, 
                                  #facc15 0 ${((totalNutrition.protein * 4 + totalNutrition.carbs * 4) / (totalNutrition.calories || 1) || 0) * 360}deg,
                                  #a855f7 0
                                )` 
                              }}></div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Legend */}
                        <div className="absolute bottom-0 left-0 right-0">
                          <div className="flex justify-center space-x-4">
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                              <span className="text-xs text-gray-600">Protein</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                              <span className="text-xs text-gray-600">Carbs</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-purple-500 rounded-full mr-1"></div>
                              <span className="text-xs text-gray-600">Fat</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Quick Tips Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-medium">Quick Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 rounded-full bg-calovate-primary/20 text-calovate-primary flex items-center justify-center text-xs mr-2 mt-0.5">
                        •
                      </span>
                      <span className="text-sm text-gray-600">
                        {totalNutrition.protein < (currentUser?.goals.protein || 0) * 0.5
                          ? "Try adding more protein-rich foods like eggs, chicken, or beans to your meals."
                          : "Great job getting your protein! Keep it up."}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 rounded-full bg-calovate-primary/20 text-calovate-primary flex items-center justify-center text-xs mr-2 mt-0.5">
                        •
                      </span>
                      <span className="text-sm text-gray-600">
                        {totalNutrition.sugar > (currentUser?.goals.sugar || 0) * 0.8
                          ? "You're approaching your daily sugar limit. Consider reducing sugary snacks."
                          : "You're doing well with managing your sugar intake."}
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 rounded-full bg-calovate-primary/20 text-calovate-primary flex items-center justify-center text-xs mr-2 mt-0.5">
                        •
                      </span>
                      <span className="text-sm text-gray-600">
                        {totalNutrition.calories < (currentUser?.goals.calories || 0) * 0.3
                          ? "Try to eat regularly throughout the day to maintain energy levels."
                          : "You're on track with your calorie goals for today."}
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
