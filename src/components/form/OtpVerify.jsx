import React, { useState, useEffect } from "react";
import { validateProperty } from "../../js/validationLogic.js";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { TailSpin } from "react-loader-spinner";
import { verifyEmailApiUrl } from "../../../server/api.js";
import {
  clearUserStateForOtpVerify,
  selectUserDataForOtpVerify,
  setUserDataForOtpVerify,
  setEmailIsValid,
} from "../../app/features/user/userSlice.js";
import "react-toastify/dist/ReactToastify.css";
import Input from "../form/formUtils/Input";
import Button from "../form/formUtils/Button";
import Joi from "joi-browser";
import SetTimer from "./../common/SetTimer";
import axios from "axios";

function OtpVerify() {
  const [errors, setErrors] = useState({});
  const [showResendTimer, setShowResendTimer] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const user = useSelector(selectUserDataForOtpVerify);

  const userId = location.state ? location.state.userId : "";
  const userEmail = location.state ? location.state.userEmail : "";
  const otp = location.state ? location.state.otp : "";
  const headerVal = location.state ? location.state.headerVal : "";

  const schema = {
    otp: Joi.number().integer().min(1000).max(9999).required(),
  };

  useEffect(() => {
    dispatch(clearUserStateForOtpVerify());
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = Joi.validate(user, schema, {
      abortEarly: false,
    });

    const { error } = result;
    if (!error) {
      try {
        if (headerVal === "true" && otp.code === Number(user.otp)) {
          const currentTime = Date.now();

          const timeDiff = currentTime - otp.creationTime;
          const timeDiffInMins = timeDiff / (1000 * 60);

          console.log("Time now: " + currentTime);
          console.log("OTP creation time: " + otp.creationTime);
          console.log("Time difference: " + timeDiff);
          console.log("Minutes passed: " + timeDiffInMins);

          if (timeDiffInMins >= 1) {
            const errorData = {
              otp: "This OTP is expired!",
            };
            setErrors(errorData);
          } else {
            toast.success("OTP verified successfully!", {
              onClose: () => {
                navigate("/newPassword", {
                  state: { userId: userId },
                });
                return;
              },
            });
          }
        } else if (otp.code === Number(user.otp)) {
          const currentTime = Date.now();

          const timeDiff = currentTime - otp.creationTime;
          const timeDiffInMins = timeDiff / (1000 * 60);

          console.log("Time now: " + currentTime);
          console.log("OTP creation time: " + otp.creationTime);
          console.log("Time difference: " + timeDiff);
          console.log("Minutes passed: " + timeDiffInMins);

          if (timeDiffInMins >= 1) {
            const errorData = {
              otp: "This OTP is expired!",
            };
            setErrors(errorData);
          } else {
            toast.success("Your email has been successfully verified!", {
              onClose: () => {
                dispatch(setEmailIsValid(true));

                navigate("/signUp", {
                  state: { cleardata: false },
                });

                dispatch(clearUserStateForOtpVerify());
              },
            });
          }
        } else {
          const errorData = {
            otp: "Invalid OTP!",
          };
          setErrors(errorData);
        }
      } catch (ex) {
        const errorData = {
          otp: "Invalid OTP!",
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
    dispatch(setUserDataForOtpVerify(userData));
    setErrors(errorData);
  };

  const handleExpire = () => {
    document.getElementById("resend").style.display = "flex";
    setShowResendTimer(false);
  };

  const handleResend = async () => {
    try {
      setShowSpinner(true);
      document.getElementById("resend").style.display = "none";

      const headers = { forget: "true" };

      const response = await axios.post(
        verifyEmailApiUrl,
        {
          email: userEmail,
        },
        { headers }
      );

      if (response.status === 200) {
        setShowSpinner(false);
        setShowResendTimer(true);

        const otp = response.data.otp;
        const userId = response.data.id;
        const headerVal = response.data.headerVal
          ? response.data.headerVal
          : "";

        navigate("/verifyOtp", {
          state: {
            userId: userId,
            userEmail: userEmail,
            otp: otp,
            headerVal: headerVal,
          },
        });
      }
    } catch (ex) {
      const errorData = {
        otp: ex.response.data,
      };
      setErrors(errorData);
    }
  };

  return (
    <>
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
            We have sent you a four digit OTP on your email
          </h2>
        </div>
        <form className="w-full h-3/4 space-y-6 flex flex-col items-center justify-center">
          <Input
            label="Four-digit OTP"
            id="otp"
            name="otp"
            type="text"
            length="4"
            placeholder="Enter your four-digit otp here"
            onChange={handleOnChange}
            value={user.otp}
            errorMessage={errors.otp}
          />

          <Button text="Verify" onClick={handleSubmit} />
          <div
            className="w-full flex items-center justify-between"
            style={{ height: "20px" }}
          >
            <span
              id="resend"
              className="text-sm text-gray-500 w-full font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              style={{ cursor: "pointer" }}
              onClick={handleResend}
            >
              Resend?
            </span>

            <TailSpin
              visible={showSpinner}
              height="30"
              width="30"
              color="blue"
              ariaLabel="tail-spin-loading"
              radius="2"
              wrapperStyle={{}}
              wrapperClass=""
            />

            {showResendTimer ? (
              <SetTimer
                timeInSeconds={60}
                size="12px"
                handleExpire={handleExpire}
              />
            ) : (
              <div></div>
            )}
          </div>
        </form>
      </div>
      <ToastContainer
        hideProgressBar="true"
        position="top-center"
        autoClose={1000}
        theme="dark"
      />
    </>
  );
}

export default OtpVerify;
