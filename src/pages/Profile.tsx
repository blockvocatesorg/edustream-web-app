// src/pages/Profile.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfilePage from "@/components/ProfilePage";
import { useNDIAuth } from "@/hooks/useNDIAuth";
import { enhancedLearnerProfileServiceInstance as learnerProfileService } from "@/services/enhancedLearnerProfileService";
import { LearnerProfile } from "@/types/learnerProfile";
import { NDIUser } from "@/types/ndi";
import { journeyData } from "@/data/journeyData";
import axiosInstance from "@/lib/axiosInstance";

const Profile = () => {
  const { isAuthenticated, user: ndiUser } = useNDIAuth();
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [learnerProfile, setLearnerProfile] = useState<LearnerProfile | null>(null);
  const [guestUser, setGuestUser] = useState<NDIUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // 1. Load guest or Google user
  useEffect(() => {
    const savedGuestUser = localStorage.getItem("guestUser");
    const token = localStorage.getItem("access_token");

    if (savedGuestUser) {
      try {
        setGuestUser(JSON.parse(savedGuestUser));
      } catch (error) {
        console.error("Error parsing guest user:", error);
        localStorage.removeItem("guestUser");
      }
    }

    if (token && !ndiUser) {
      axiosInstance
        .get("/User/Profile")
        .then((res) => {
          setGoogleUser(res.data.userDetails);
        })
        .catch((err) => {
          console.error("Failed to fetch Google user:", err);
          navigate("/");
        });
    }

    setIsLoading(false);
  }, []);

  // 2. Handle profile creation based on any available user
  useEffect(() => {
    if (isLoading) return;

    const currentUser = ndiUser || guestUser || googleUser;

    if (!currentUser && !isAuthenticated) {
      console.log("No user found after loading, redirecting to homepage");
      navigate("/");
      return;
    }

    if (currentUser) {
      let profile = learnerProfileService.getLearnerProfile();

      if (!profile || profile.ndiUser?.citizenId !== currentUser.citizenId) {
        profile = learnerProfileService.createLearnerProfile(currentUser);
      } else {
        profile = learnerProfileService.updateLoginActivity(profile);
      }

      setLearnerProfile(profile);
    }
  }, [isAuthenticated, ndiUser, guestUser, googleUser, navigate, isLoading]);

  // 3. Show loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading Profile...</h2>
          <p className="text-gray-600">Please wait while we load your profile.</p>
        </div>
      </div>
    );
  }

  const currentUser = ndiUser || guestUser || googleUser;

  if (!currentUser) return null;

  if (!learnerProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Setting up Profile...</h2>
          <p className="text-gray-600">Preparing your learning dashboard.</p>
        </div>
      </div>
    );
  }

  const selectedJourney = journeyData.find((j) =>
    learnerProfile?.progress.some((p) => p.journeyId === j.id)
  );

  return (
    <ProfilePage
      user={currentUser}
      learnerProfile={learnerProfile}
      selectedJourney={selectedJourney}
    />
  );
};

export default Profile;
