import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const Navbar = () => {
  return (
    <>
      <div className="flex justify-between items-center bg-blue-950 p-2 m-3 gap-10">
        <h1 className="text-4xl">
          Fast<span className="text-green-500">Type</span>
        </h1>

        <div className="flex space-x-4 text-white text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-green-500 font-bold "
                : "hover:text-gray-300"
            }
          >
            <FaHome size={24}/>
          </NavLink>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive
                ? "text-green-500 font-bold "
                : "hover:text-gray-300"
            }
          >
            <FaSignInAlt size={24} />
          </NavLink>
          <NavLink
            to="/register"
            className={({ isActive }) =>
              isActive
                ? "text-green-500 font-bold "
                : "hover:text-gray-300"
            }
          >
            <FaUserPlus size={24} />
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Navbar;
