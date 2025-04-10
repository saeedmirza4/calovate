
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const NotFound = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-16 px-4 bg-calovate-neutral/30">
        <div className="text-center">
          <div className="inline-block mb-8">
            <div className="h-32 w-32 rounded-full bg-calovate-primary/10 flex items-center justify-center text-calovate-primary mx-auto">
              <span className="text-7xl font-bold">404</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <Button asChild size="lg" className="bg-calovate-primary hover:bg-calovate-primary/90">
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
