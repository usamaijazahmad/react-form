import React from "react";

function Input(props) {
  return (
    <>
      <div className="w-full">
        <label
          htmlFor={props.id}
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {props.label}
        </label>
        <div className="mt-2">
          <input
            id={props.id}
            name={props.name}
            type={props.type}
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.onChange}
            className="block w-full 
            rounded-3xl border-0 py-1.5
           text-gray-900 shadow-sm ring-1 ring-inset 
           ring-gray-300 placeholder:text-gray-400 
           focus:ring-2 focus:ring-inset 
           focus:ring-indigo-600 sm:text-sm sm:leading-6  
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100"
          />
          {props.errorMessage && (
            <div className="text-red-600 text-xs mt-2">
              {props.errorMessage}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Input;
