
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow h-full w-full">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
