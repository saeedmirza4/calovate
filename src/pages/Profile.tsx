
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Profile = () => {
  const { currentUser, updateUserGoals, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [goals, setGoals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    sugar: 0,
    fat: 0,
  });
  
  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate("/login");
      return;
    }
    
    if (currentUser) {
      setGoals(currentUser.goals);
    }
  }, [currentUser, isLoading, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGoals({
      ...goals,
      [name]: value ? parseFloat(value) : 0,
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      updateUserGoals(goals);
      toast({
        title: "Profile updated",
        description: "Your nutrition goals have been updated successfully.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-calovate-primary border-t-transparent"></div>
      </div>
    );
  }
  
  if (!currentUser) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Profile Settings</CardTitle>
              <CardDescription>
                Manage your account information and nutrition goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/4">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-calovate-primary to-calovate-secondary flex items-center justify-center text-white text-2xl font-bold">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="w-full sm:w-3/4">
                  <div className="space-y-1 mb-4">
                    <Label>Name</Label>
                    <div className="text-md font-medium">{currentUser.name}</div>
                  </div>
                  <div className="space-y-1">
                    <Label>Email</Label>
                    <div className="text-md font-medium">{currentUser.email}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Nutrition Goals</CardTitle>
              <CardDescription>
                Set your daily nutrition targets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="calories">Daily Calorie Goal</Label>
                  <Input
                    id="calories"
                    name="calories"
                    type="number"
                    min="0"
                    step="50"
                    value={goals.calories || ""}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="protein">Protein Goal (g)</Label>
                    <Input
                      id="protein"
                      name="protein"
                      type="number"
                      min="0"
                      step="1"
                      value={goals.protein || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="carbs">Carbs Goal (g)</Label>
                    <Input
                      id="carbs"
                      name="carbs"
                      type="number"
                      min="0"
                      step="1"
                      value={goals.carbs || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="sugar">Sugar Limit (g)</Label>
                    <Input
                      id="sugar"
                      name="sugar"
                      type="number"
                      min="0"
                      step="1"
                      value={goals.sugar || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="fat">Fat Goal (g)</Label>
                    <Input
                      id="fat"
                      name="fat"
                      type="number"
                      min="0"
                      step="1"
                      value={goals.fat || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="submit"
                    className="bg-calovate-primary hover:bg-calovate-primary/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-red-500">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <p className="text-gray-600">
                  This action will log you out of your account.
                </p>
                <div>
                  <Button 
                    variant="destructive" 
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
