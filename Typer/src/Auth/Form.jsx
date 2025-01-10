import React from "react";
import { Link } from "react-router-dom";
import GoogleButton from 'react-google-button'

const Form = ({ type, value, onChange, onSubmit }) => {

  const handleSignIn = async() => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User Info: ", user);
      
    } catch (error) {
      console.log("Error during sign-in: ",error.message);
      
    }
  }
  return (
    <form
      onSubmit={onSubmit}
      className="flex justify-center items-center h-screen"
    >
      <div className="bg-gray-100 p-4 rounded-lg shadow-md w-80">
        <h1 className="text-lg font-semibold text-green-600 mb-2">
          {type === "login" ? "Welcome Back!" : "Create Your Account"}
        </h1>

        <h2 className="text-xl font-bold mb-4 text-amber-700">
          {type === "login" ? "Login" : "Register"}
        </h2>

        {type === "register" && (
          <div className="mb-3">
            <label
              htmlFor="username"
              className="block text-gray-700 text-sm mb-1"
            >
              Username
            </label>
            <input
              style={{ color: "black" }}
              type="text"
              name="username"
              value={value.username}
              onChange={onChange}
              id="username"
              className="w-full border p-0 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="email" className="block text-gray-700 text-sm mb-1">
            Email
          </label>
          <input
            style={{ color: "black" }}
            type="email"
            name="email"
            value={value.email}
            onChange={onChange}
            id="email"
            className="w-full border p-0 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-3">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm mb-1"
          >
            Password
          </label>
          <input
            style={{ color: "black" }}
            type="password"
            name="password"
            value={value.password}
            onChange={onChange}
            id="password"
            className="w-full border p-0 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {type === "login" ? "Login" : "Register"}
        </button>

        <span className="text-black text-sm">OR</span>
        
        <span className="p-2 justify-center items-center flex">
        <GoogleButton onClick={handleSignIn} />
        </span>

        <p className="text-blue-500 mt-4 text-center text-sm">
          {type === "login" ? (
            <Link to="/register">Don't have an account? Register</Link>
          ) : (
            <Link to="/login">Already have an account? Login</Link>
          )}
        </p>
      </div>
    </form>
  );
};

export default Form;
