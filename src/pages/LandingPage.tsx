
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ClipboardCheck, BarChart3, Activity, TrendingUp } from "lucide-react";

const LandingPage = () => {
  const { currentUser } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-calovate-neutral to-white py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="mb-8 relative inline-block">
              <div className="absolute inset-0 rounded-full bg-calovate-primary opacity-10 animate-pulse-ring"></div>
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-calovate-primary to-calovate-secondary flex items-center justify-center text-white text-2xl font-bold mx-auto">
                C
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Track Your Nutrition <br className="hidden md:block" />
              <span className="text-calovate-primary">Simply & Effectively</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Calovate helps you understand your eating habits, meet your nutrition goals, and make healthier choices every day.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {currentUser ? (
                <Button asChild size="lg" className="bg-calovate-primary hover:bg-calovate-primary/90">
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="bg-calovate-primary hover:bg-calovate-primary/90">
                    <Link to="/signup">Get Started</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-calovate-primary text-calovate-primary hover:bg-calovate-neutral">
                    <Link to="/login">Log In</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Calovate?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="h-12 w-12 bg-calovate-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <ClipboardCheck className="h-6 w-6 text-calovate-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Simple Tracking</h3>
                <p className="text-gray-600">
                  Log your meals quickly and easily with our intuitive food entry system.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="h-12 w-12 bg-calovate-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-calovate-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Visual Insights</h3>
                <p className="text-gray-600">
                  See your nutrition data visualized in clear, informative charts and graphs.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="h-12 w-12 bg-calovate-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-calovate-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
                <p className="text-gray-600">
                  Monitor your progress over time and celebrate your consistency.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="h-12 w-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Activity className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Personalized Goals</h3>
                <p className="text-gray-600">
                  Set custom nutrition goals that fit your personal health journey.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-calovate-neutral">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Your Nutrition Journey?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of users who are taking control of their health with Calovate.
            </p>
            <Button asChild size="lg" className="bg-calovate-primary hover:bg-calovate-primary/90">
              <Link to={currentUser ? "/dashboard" : "/signup"}>
                {currentUser ? "Go to Dashboard" : "Start Tracking Today"}
              </Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;
