// src/components/GoogleLogin.tsx
import React, { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Clock, User } from "lucide-react";
import axios from "axios";

interface GoogleLoginProps {
  onSuccess?: (user: any) => void;
  onCancel?: () => void;
}

const GoogleLoginCard: React.FC<GoogleLoginProps> = ({ onSuccess, onCancel }) => {
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLoginSuccess = async (credentialResponse: any) => {
    const idToken = credentialResponse.credential;
    if (!idToken) return setError("No token received from Google");

    try {
      setLoading(true);
      const res = await axios.post("https://edustream.somee.com/api/v1/User/LoginWithGoogle", {
        idToken,
      });

      const { accessToken, userDetails } = res.data.data;

      localStorage.setItem("access_token", accessToken);
      setUserData(userDetails);
      setError(null);

      if (onSuccess) onSuccess(userDetails);
    } catch (err: any) {
      setError(err.response?.data?.errorMessage || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setUserData(null);
  };

  if (userData) {
    return (
      <Card className="max-w-md mx-auto border-2 border-green-200">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-green-800">Login Successful</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-center">
            <div className="flex items-center justify-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">{userData.fullName}</span>
            </div>
            <div className="text-sm text-gray-500">{userData.emailAddress}</div>
          </div>
          <Button onClick={handleLogout} variant="outline" className="w-full">
            Sign Out
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto border-2 border-blue-200">
      <CardHeader className="text-center space-y-3">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="h-8 w-8 text-blue-600" />
        </div>
        <CardTitle>Sign in with Google</CardTitle>
        <p className="text-sm text-gray-600">Use your Google account to continue</p>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading && (
          <div className="text-center space-y-3">
            <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-sm text-gray-600">Authenticating...</p>
          </div>
        )}

        {!loading && (
          <div className="flex flex-col items-center space-y-4">
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => setError("Google login failed")}
              useOneTap
            />
            {onCancel && (
              <Button onClick={onCancel} variant="outline" className="w-full">
                Continue without login
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleLoginCard;
