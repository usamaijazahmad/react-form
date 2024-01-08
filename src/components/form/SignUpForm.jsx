import React, { useState } from "react";
import { registerApiUrl } from "../../../server/api";
import { useNavigate } from "react-router-dom";
import { validateProperty } from "../../js/validationLogic";
import { useDispatch } from "react-redux";
import { setUserDataForLogin } from "../../app/features/user/userSlice";
import Joi from "joi-browser";
import Button from "../form/formUtils/Button";
import QuickLink from "../form/formUtils/QuickLink";
import Input from "../form/formUtils/Input";
import axios from "axios";

function SignUpForm() {
  const dispatch = useDispatch();

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
      try {
        const response = await axios.post(registerApiUrl, {
          name: user.name,
          email: user.email,
          password: user.password,
        });
        if (response.status === 200) {
          alert("You've successfuly signed up!");
          clearSignedUpUserState();
          dispatch(setUserDataForLogin({ email: user.email, password: "" }));
          navigate("/logIn");
          return;
        }
      } catch (err) {
        console.log(err);
        if (err.response.status === 409) {
          const errorData = {
            email: err.response.data,
          };
          setErrors(errorData);
        }
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

  const clearSignedUpUserState = () => {
    setUser({
      name: "",
      email: "",
      password: "",
    });
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
