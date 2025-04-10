
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 overflow-hidden sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Calovate. All rights reserved.
        </p>
        <div className="mt-4 flex justify-center space-x-6">
          <Link to="/" className="text-gray-500 hover:text-calovate-primary">
            Home
          </Link>
          <a href="#" className="text-gray-500 hover:text-calovate-primary">
            Privacy
          </a>
          <a href="#" className="text-gray-500 hover:text-calovate-primary">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
