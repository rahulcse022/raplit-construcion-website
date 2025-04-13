import { Link } from "wouter";
import { X } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

const MobileMenu = ({ isOpen, onClose, navItems }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-white border-t fixed inset-0 z-50 pt-16">
      <div className="container mx-auto px-4 py-3 h-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 p-2"
          aria-label="Close menu"
        >
          <X className="h-6 w-6" />
        </button>

        <nav className="flex flex-col space-y-3 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-medium text-gray-700 hover:text-primary-600 transition-colors py-3 border-b border-gray-100"
              onClick={onClose}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
