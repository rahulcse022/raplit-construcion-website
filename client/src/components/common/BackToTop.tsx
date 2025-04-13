import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when user scrolls down 300px
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top when button is clicked
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 bg-primary-600 hover:bg-primary-700 text-white h-12 w-12 rounded-full shadow-lg flex items-center justify-center transition-all ${
        isVisible
          ? "opacity-100 visible transform translate-y-0"
          : "opacity-0 invisible transform translate-y-4"
      }`}
      aria-label="Back to top"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
};

export default BackToTop;
