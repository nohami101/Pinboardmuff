import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, FolderOpen, Camera, Home, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

interface HeaderProps {
  onSearch: (query: string) => void;
  onCreateCollection: () => void;
}

export default function Header({ onSearch, onCreateCollection }: HeaderProps) {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Debounce search
    setTimeout(() => {
      onSearch(query);
    }, 500);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 z-50 shadow-sm border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          {/* Logo - Hidden on mobile, visible on larger screens */}
          <div className="hidden sm:flex items-center space-x-6">
            <Link href="/">
              <h1 className="text-2xl font-bold text-pinterest-red cursor-pointer">
                <Camera className="inline mr-2" size={24} />
                PinGallery
              </h1>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/">
                <button className={`font-medium transition-colors ${
                  location === "/" 
                    ? "text-pinterest-red" 
                    : "text-gray-700 dark:text-gray-300 hover:text-pinterest-red"
                }`}>
                  Home
                </button>
              </Link>
              <Link href="/collections">
                <button className={`font-medium transition-colors ${
                  location === "/collections" 
                    ? "text-pinterest-red" 
                    : "text-gray-700 dark:text-gray-300 hover:text-pinterest-red"
                }`}>
                  Collections
                </button>
              </Link>
            </nav>
          </div>
          
          {/* Mobile navigation - home icon */}
          <div className="sm:hidden">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full ${
                  location === "/" 
                    ? "text-pinterest-red" 
                    : "text-gray-700 dark:text-gray-300 hover:text-pinterest-red"
                }`}
              >
                <Home className="h-5 w-5" />
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1 sm:flex-initial justify-end">
            <div className="relative flex-1 sm:flex-initial max-w-xs sm:max-w-none">
              <Input
                type="text"
                placeholder="Search for photos..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full sm:w-48 md:w-64 pl-8 sm:pl-10 text-sm rounded-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-pinterest-red"
              />
              <Search className="absolute left-2 sm:left-3 top-2.5 sm:top-3 h-3 w-3 sm:h-4 sm:w-4 text-gray-400 dark:text-gray-500" />
            </div>
            
            <ThemeToggle />
            
            <Link href="/collections">
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full ${
                  location === "/collections" 
                    ? "text-pinterest-red" 
                    : "text-gray-700 dark:text-gray-300 hover:text-pinterest-red"
                }`}
              >
                <FolderOpen className="h-5 w-5" />
              </Button>
            </Link>
            
            <Button 
              onClick={onCreateCollection}
              size="sm"
              className="bg-pinterest-red hover:bg-red-700 text-white rounded-full px-2 sm:px-4"
            >
              <FolderOpen className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Create</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
