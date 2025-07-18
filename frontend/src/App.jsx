import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import SignUp from "./pages/SignUp";
import Settings from "./pages/Settings";
import HomePage from "./pages/HomePage";
import useAuthHook from "./hooks/useAuthHooks";
import ProfilePage from "./pages/ProfilePage";
import NavBar from "./components/NavBar";

function App() {
  const { authUser, checkAuth } = useAuthHook();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div>
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/signup" />}
        />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignInPage />} />
      </Routes>
    </div>
  );
}

export default App;
