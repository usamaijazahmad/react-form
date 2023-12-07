import React, { useState } from "react";
import Input from "./Input";
import Joi from "joi-browser";
import { validateProperty } from "../js/validationLogic";
import Button from "./Button";
import QuickLink from "./QuickLink";
import { usersApiUrl } from "../../server/api";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

function LoginForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const emailFromSignUp = location.state?.emailFromSignUp || "";

  const [user, setUser] = useState({
    email: emailFromSignUp,
    password: "",
  });

  const [errors, setErrors] = useState({});

  const schema = {
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(8).required(),
  };

  const handleSumit = async (event) => {
    event.preventDefault();
    const result = Joi.validate(user, schema, {
      abortEarly: false,
    });

    const { error } = result;
    if (!error) {
      let result = await verifyUser(user.email, user.password);
      if (result === true) {
        alert("User authenticated!");
        login();
        navigate("/homePage", { state: { myEmailId: user.email } });
        setErrors({});
      } else {
        const errorData = {
          password: "Invalid username or password!",
        };
        setErrors(errorData);
      }
      return;
    } else {
      const errorData = {};
      for (let item of error.details) {
        const name = item.path[0];
        const message = item.message;
        errorData[name] = message;
      }

      setErrors(errorData);
      return errorData;
    }
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    let errorData = { ...errors };
    const errorMessage = validateProperty(event, schema);
    if (errorMessage) {
      errorData[name] = errorMessage;
    } else {
      delete errorData[name];
    }
    let userData = { ...user };
    userData[name] = value;
    setUser(userData);
    setErrors(errorData);
  };

  const verifyUser = async (emailId, pass) => {
    const response = await fetch(usersApiUrl);
    const data = await response.json();

    const userFound = data.some((user) => user.email === emailId);
    if (userFound) {
      const user1 = data.filter((user) => user.email === emailId);

      if (user1[0].email === emailId && user1[0].password === pass) {
        return true;
      }
      return false;
    }
    return;
  };

  return (
    <>
      <div
        className="
      bg-white px-10 
      py-5 md:w-1/3 h-full 
      mx-auto mt-10 rounded-lg 
      flex flex-col items-center 
      justify-evenly
      "
      >
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign In
          </h2>
        </div>
        <form className="w-full h-3/4 space-y-6 flex flex-col items-center justify-center">
          <Input
            label="Email Address"
            id="email"
            name="email"
            type="email"
            value={user.email}
            onChange={handleOnChange}
            errorMessage={errors.email}
            placeholder="Enter your email here"
          />
          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            value={user.password}
            onChange={handleOnChange}
            errorMessage={errors.password}
            placeholder="Enter your password here"
          />
          <Button text="Sign In" onClick={handleSumit} />
          <QuickLink
            text="Not a member?"
            linkText="Create Account"
            link="/signUp"
          />
        </form>
      </div>
    </>
  );
}

export default LoginForm;
