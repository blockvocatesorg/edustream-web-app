import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignIn = () => {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential; // Google ID token
    try {
      // Send the Google ID token to the backend endpoint
      const res = await axios.post('https://edustream.somee.com/api/v1/User/RegisterWithGoogle', {
        tokenId: token, // Adjust the payload key based on backend requirements
      });
      
      // Assuming the backend returns user data or a token
      const user = res.data;
      
      // Store user info or backend token in localStorage (adjust based on backend response)
      localStorage.setItem('user', JSON.stringify(user));
      
      // Navigate to profile or dashboard after successful registration/login
      navigate('/profile');
    } catch (error) {
      console.error('Login/Registration failed:', error.response?.data || error.message);
    }
  };

  const handleError = () => {
    console.log('Google Login Failed');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap
        />
      </div>
    </div>
  );
};

export default SignIn;