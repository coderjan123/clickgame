import React, { useState } from "react";
import supabase from "../helper/supabaseClient";
import { Link } from "react-router-dom";
import '../styles/auth.css'
import { useEffect } from "react";
function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState(""); // "error" oder "success"
  useEffect(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.documentElement.classList.add("light-theme");
  } else {
    document.documentElement.classList.remove("light-theme");
  }
}, []);


  const handleSubmit = async (event) => {
    event.preventDefault();
const { data, error } = await supabase.auth.signUp({
  email: username + "@fakeemail.com",
  password: password,
  options: {
    data: {
      username: username
    }
  }
});

    if (error) {
      setMessage(error.message);     
      setMessageType("error");

    }
    else if (data){
     setMessageType("success");
     setMessage(
  <>
    Success! Now go to <Link to="/login">Login</Link>.
  </>
);
    }
  }

  return (
    <div className="auth">
    <div className="page">
      <div className="form-wrapper">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            required
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
          <button type="submit">Create Account</button>
        </form>
        <h3>
          Already have an account? <Link to="/login">Login</Link>
        </h3>
        <span className={messageType}>{message}</span>

      </div>
    </div>
    </div>
  )
}


export default Register;
