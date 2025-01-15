import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "./Layout/Layout";
import Typing from "./Components/Typing";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserProfile from "./Components/UserProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Typing />} />
          <Route path="login" element={<Login />} />
          <Route path="userprofile" element={<UserProfile />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;