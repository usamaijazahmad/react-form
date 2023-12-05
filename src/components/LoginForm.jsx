import React, { useState } from "react";
import Input from "./Input";
import Joi from "joi-browser";
import { validateProperty } from "../js/validationLogic";
import Button from "./Button";
import QuickLink from "./QuickLink";

function LoginForm() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const schema = {
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(8).required(),
  };

  const handleSumit = (event) => {
    event.preventDefault();
    const result = Joi.validate(user, schema, {
      abortEarly: false,
    });

    const { error } = result;
    if (!error) {
      return alert("Data successfuly received!");
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

  return (
    <>
      <div
        className="
      bg-white px-10 
      py-5 w-1/3 h-full 
      mx-auto mt-10 rounded-lg 
      flex flex-col items-center 
      justify-evenly"
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
