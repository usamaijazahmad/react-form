import React, { useState } from "react";
import Input from "./Input";
import Joi from "joi-browser";
import { validateProperty } from "../js/validationLogic";
import Button from "./Button";
import QuickLink from "./QuickLink";
import { usersApiUrl } from "../../server/api";
import { useNavigate } from "react-router-dom";

function SignUpForm() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const schema = {
    name: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(8).required(),
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = Joi.validate(user, schema, {
      abortEarly: false,
    });

    const { error } = result;
    if (!error) {
      const emailExists = await isEmailExists(user.email);

      if (emailExists) {
        const errorData = {
          email: "This email address is not available!",
        };
        setErrors(errorData);
      } else {
        fetch(usersApiUrl, {
          method: "POST",
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            password: user.password,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
        alert("You've successfuly signed up!");
        clearUserState();
        navigate("/logIn", { state: { emailFromSignUp: user.email } });
        return;
      }
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

  const clearUserState = () => {
    setUser({
      name: "",
      email: "",
      password: "",
    });
  };

  const isEmailExists = async (emailId) => {
    const response = await fetch(usersApiUrl);
    const data = await response.json();
    return data.some((user) => user.email === emailId);
  };

  return (
    <>
      <div
        className="
      bg-white px-10 py-5 md:w-1/3 
      mx-auto mt-10 
      rounded-lg flex flex-col 
      items-center justify-evenly con"
      >
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign Up
          </h2>
        </div>
        <form className="w-full h-3/4 space-y-6 flex flex-col items-center justify-center">
          <Input
            label="Name"
            id="nameInp"
            name="name"
            value={user.name}
            onChange={handleOnChange}
            errorMessage={errors.name}
            type="text"
            placeholder="Enter your name here"
          />
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
          <Input
            label="Upload Profile Picture"
            id="file"
            name="file"
            type="file"
          />

          <Button text="Sign Up" onClick={handleSubmit} />
          <QuickLink
            text="Already have an account?"
            linkText="Sign In"
            link="/logIn"
          />
        </form>
      </div>
    </>
  );
}

export default SignUpForm;
