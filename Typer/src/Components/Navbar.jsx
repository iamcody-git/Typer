import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
  FaUserPlus,
} from "react-icons/fa";
import { GiCometSpark } from "react-icons/gi";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { toast } from "react-toastify";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      toast.success("Logged out successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/");
    } catch (error) {
      toast.error("Failed to log out. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Logout Error:", error);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center bg-blue-950 p-2 m-3 gap-10">
        <NavLink to="/">
          <h1 className="text-4xl flex items-center">
            Fast
            <span className="text-green-500 flex items-center">
              <GiCometSpark />
              Type
            </span>
          </h1>
        </NavLink>

        <div className="flex space-x-10 text-white text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-green-500 font-bold" : "hover:text-gray-300"
            }
          >
            <span>
              <FaHome size={24} />
              Home
            </span>
          </NavLink>

          {!user && (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "text-green-500 font-bold" : "hover:text-gray-300"
                }
              >
                <span>
                  {" "}
                  <FaSignInAlt size={24} />
                  Login
                </span>
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive ? "text-green-500 font-bold" : "hover:text-gray-300"
                }
              >
                <span>
                  <FaUserPlus size={24} />
                  Register
                </span>
              </NavLink>
            </>
          )}

          {user && (
            <div
              onClick={handleLogout}
              className="text-white hover:text-red-500 flex items-center space-x-2"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>
                <FaSignOutAlt size={18} /> Logout
              </span>
            </div>
          )}

          <div>
            <NavLink
              to="/userprofile"
              className="text-white hover:text-red-500 flex items-center space-x-2"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>
                <FaUser size={24} /> Profile
              </span>
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;