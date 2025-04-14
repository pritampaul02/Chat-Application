import React from "react";

const InputBox = ({
    type,
    placeholder,
    className,
    style,
    title,
    labelShow,
    props,
}) => {
    return (
        <div>
            {labelShow && <label>{title}</label>}

            <input
                type={type}
                placeholder={placeholder}
                className={className}
                style={style}
                {...props}
            />
            {/* <input
                id="email"
                className={`w-full p-3 bg-white/20 text-white border ${
                    error.email ? "border-red-500" : "border-gray-300 "
                } rounded-md focus:outline-none placeholder-transparent`}
                type="email"
                name="email"
                value={logInForm.email}
                onChange={handleChange}
                required
            /> */}
        </div>
    );
};

export default InputBox;
