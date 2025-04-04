import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Register = () => {
     const [userName, setUserName] = useState('');
     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
     const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState({ username: "", email: "", password: "", confirmpassword: "" });
    const [serverError, setServerError] = useState("");
    const [registerForm, setRegisterForm] = useState({ username: "", email: "", password: "", confirmpassword: "" });
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
     event.preventDefault();
     const { username, email, password, confirmpassword } = registerForm;

     if (username.trim() === "") {
        setError({ ...error, username: "Email is required" });
        return;
    }
    setError({ ...error, username: "" });
     if (!/^[a-z]+$/.test(userName)) {
         setError({
            ...error,
            username: "Username can only contain characters (no numbers)" 
        });
        return;
     }
     if (email.trim() === "") {
            setError({ ...error, email: "Email is required" });
            return;
        }
        setError({ ...error, email: "" });
        if (password.trim() === "") {
            setError({ ...error, password: "Password is required" });
            return;
        }
        setError({ ...error, password: "" });
        if (password.length < 8) {
            setError({
                ...error,
                password: "Password must be at least 8 characters",
            });
            return;
        }
        setError({ ...error, password: "" });
        if (confirmpassword.trim() === "") {
            setError({ ...error, confirmpassword: "confirmpassword is required" });
            return;
        }
        setError({ ...error, confirmpassword: "" });
        if ( password !== confirmpassword){
          setError({
              ...error,
              confirmpassword: "password do not match",
          });
          return;
      }
        setError({
            ...error,
            password: "",
        });

        // setError({ username: "", email: "", password: "", confirmpassword: "" });
        // Simulating API Call

        console.log("Register in", registerForm);
    };

    const handleForgetUser = () => {
     navigate("/request-password-reset");
 };

 const handleChange = (e) => {
     setLogInForm({ ...registerForm, [e.target.name]: e.target.value });
 };

 return (
    <div className="registration-page">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username (only characters, no numbers):</label>
          <input
            type="text"
            value={ registerForm.userName}
            onChange= { handleChange } 
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={registerForm.email} onChange= { handleChange }/>
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={registerForm.password} onChange= {handleChange}/>
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={registerForm.confirmPassword}onChange= {handleChange}/>
        </div>
        {error.confirmpassword && (
          <p style={{ color: 'red' }}>{error.confirmpassword}</p>
        )}
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
