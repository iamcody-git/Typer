import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, []);

  if (loading) {
    // Show a loading indicator while checking auth state
    return <div>Loading...</div>;
  }

  // If no user is authenticated, redirect to the login page
  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
