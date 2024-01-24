import React, { useState, useEffect } from "react";
import { validateProperty } from "../../js/validationLogic.js";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { usersApiUrl } from "../../../server/api.js";
import {
  clearUserStateForNewPassword,
  selectUserDataForNewPassword,
  setUserDataForLogin,
  setUserDataForNewPassword,
} from "../../app/features/user/userSlice.js";
import Input from "../form/formUtils/Input";
import Button from "../form/formUtils/Button";
import Joi from "joi-browser";
import axios from "axios";

function NewPassword() {
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const user = useSelector(selectUserDataForNewPassword);

  const userId = location.state ? location.state.userId : "";

  const schema = {
    password: Joi.string().min(5).max(8).required(),
  };

  useEffect(() => {
    dispatch(clearUserStateForNewPassword());
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = Joi.validate(user, schema, {
      abortEarly: false,
    });

    const { error } = result;
    if (!error) {
      if (userId) {
        alert("Your password has been successfuly changed!");

        const response = await axios.put(usersApiUrl + `/${userId}`, {
          password: user.password,
        });

        const ourUser = response.data;

        dispatch(setUserDataForLogin({ email: ourUser.email, password: "" }));

        navigate("/logIn", { state: { cleardata: false } });

        dispatch(clearUserStateForNewPassword());
      } else {
        const errorData = {
          password: "No user found!",
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
    dispatch(setUserDataForNewPassword(userData));
    setErrors(errorData);
  };

  return (
    <div
      className="
  bg-white px-10 
  py-5 md:w-1/3 h-2/3 
  mx-auto mt-10 rounded-lg 
  flex flex-col items-center 
  justify-evenly
  "
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          New Password
        </h2>
      </div>
      <form className="w-full h-3/4 space-y-6 flex flex-col items-center justify-center">
        <Input
          label="Password"
          id="password"
          name="password"
          type="password"
          placeholder="Enter your new Password here"
          onChange={handleOnChange}
          value={user.password}
          errorMessage={errors.password}
        />
        <Button text="Change Password" onClick={handleSubmit} />
      </form>
    </div>
  );
}

export default NewPassword;
