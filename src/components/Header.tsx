import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookOpen, Mountain, Coins, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GoogleLoginCard from "@/components/GoogleLoginCard";
import { useNDIAuth } from "@/hooks/useNDIAuth"; // ✅ Optional fallback if NDI is still used

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useNDIAuth(); // fallback NDI support
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [googleUser, setGoogleUser] = useState<any>(null);

  // Check localStorage for token and set Google user on page load
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("google_user");

    if (accessToken && storedUser) {
      setGoogleUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = (userData: any) => {
    setGoogleUser(userData);
    localStorage.setItem("google_user", JSON.stringify(userData));
    setShowLoginModal(false);
    console.log("✅ Google user logged in:", userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("google_user");
    setGoogleUser(null);
    if (logout) logout(); // If still using NDI fallback
  };

  const currentUser = user || googleUser;
  const isUserLoggedIn = isAuthenticated || googleUser;

  return (
    <>
      <header className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <Mountain className="h-8 w-8 text-orange-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Edustream
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => navigate("/")}
                className="text-gray-700 hover:text-orange-600 transition-colors"
              >
                Lessons
              </button>
              <button
                onClick={() => navigate("/web3bhutan")}
                className="text-gray-700 hover:text-orange-600 transition-colors"
              >
                Web3 
              </button>
              <button
                onClick={() => navigate("/community")}
                className="text-gray-700 hover:text-orange-600 transition-colors"
              >
                Community
              </button>
              <button
                onClick={() => navigate("/rewards")}
                className="text-gray-700 hover:text-orange-600 transition-colors"
              >
                Rewards
              </button>
            </nav>

            {/* Right-side user block */}
            <div className="flex items-center space-x-4">
              {isUserLoggedIn && currentUser ? (
                <>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Coins className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">77,000,000 EDU</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="hidden md:block">
                      <p className="text-sm font-medium">{currentUser.fullName}</p>
                      <p className="text-xs text-gray-500">{currentUser.institution || "Learner"}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Coins className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">Start Earning EDU</span>
                  </div>
                  <Button
                    className="bg-orange-600 hover:bg-orange-700"
                    onClick={() => setShowLoginModal(true)}
                  >
                    Sign in with Google
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Google Login Modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Sign in to EduStream</DialogTitle>
          </DialogHeader>
          <GoogleLoginCard
            onSuccess={handleLoginSuccess}
            onCancel={() => setShowLoginModal(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;
