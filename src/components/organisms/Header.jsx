import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Simulate user role - in real app this would come from context/store
  const currentUser = { role: "admin" }; // For demo purposes

  const navItems = [
    { label: "홈", path: "/" },
    { label: "멤버십", path: "/membership" },
    { label: "마스터", path: "/master" },
    { label: "인사이트", path: "/insights" },
    { label: "도전 후기", path: "/reviews" },
  ];

  // Add admin menu if user is admin
  if (currentUser?.role === "admin") {
    navItems.push({ label: "관리자", path: "/admin" });
  }

  const authItems = [
    { label: "로그인", path: "/login" },
    { label: "회원가입", path: "/signup" },
  ];

  const isActivePath = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <ApperIcon name="GraduationCap" size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold font-display bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              LearnHub Pro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "text-sm font-medium transition-all duration-200 hover:text-primary-600 relative",
                    isActivePath(item.path)
                      ? "text-primary-600"
                      : "text-gray-700"
                  )}
                >
                  {item.label}
                  {isActivePath(item.path) && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                      layoutId="activeTab"
                    />
                  )}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              {authItems.map((item) => (
                <Button
                  key={item.path}
                  variant={item.label === "회원가입" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => navigate(item.path)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="p-2"
            >
              <ApperIcon 
                name={isMenuOpen ? "X" : "Menu"} 
                size={24} 
                className="text-gray-700" 
              />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{
            height: isMenuOpen ? "auto" : 0,
            opacity: isMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="lg:hidden overflow-hidden"
        >
          <div className="py-4 space-y-4 border-t border-gray-200">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "block px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                  isActivePath(item.path)
                    ? "text-primary-600 bg-primary-50"
                    : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                )}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="pt-4 space-y-3 border-t border-gray-200">
              {authItems.map((item) => (
                <Button
                  key={item.path}
                  variant={item.label === "회원가입" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => {
                    navigate(item.path);
                    setIsMenuOpen(false);
                  }}
                  className="w-full"
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>
      </nav>
    </header>
  );
};

export default Header;