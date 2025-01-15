import React, { useState } from "react";
import Form from "./Form";
import { auth } from "../../firebaseConfig.js";
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [value, setValue] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { email, password, username } = value;

    if (!email || !password || !username) {
      toast.warning('All fields are required', {
        position: "top-left",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      return;
    }

    auth
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        toast.success('Registration successful!', {
          position: "top-right",
          autoClose: 3000,
        });

        setValue({
          username: "",
          email: "",
          password: "",
        });
      })
      .catch((err) => {
        const errorMessage = errorMapping[err.code] || 'An error occurred during registration';
        toast.error(`🚨 ${errorMessage}`, {
          position: "top-right",
          autoClose: 3000,
        });
      });
  };

  return <Form type="register" value={value} onChange={handleChange} onSubmit={handleSubmit} />;
};


export default Register;
