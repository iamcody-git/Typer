import React, { useState } from "react";
import Form from "./Form";
import { auth } from "../../firebaseConfig.js";
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [value, setValue] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { email, password } = value;

    if (!email || !password) {
      toast.warn('Please fill the required fields!', {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      return;
    }

    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        toast.success("🎉 Login successful!", {
          position: "top-right",
          autoClose: 3000,
        });

        setValue({
          email: "",
          password: "",
        });
      })
      .catch((err) => {
        console.error(err.message);
        toast.error(`🚨 ${err.message}`, {
          position: "top-right",
          autoClose: 3000,
        });
      });
  };

  return <Form type="login" value={value} onChange={handleChange} onSubmit={handleSubmit} />;
};

export default Login;
