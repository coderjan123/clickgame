import React, { useState } from "react";
import supabase from "../helper/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import '../styles/auth.css';
import { useEffect } from "react";
import ToggleSwitch from "../components/toggleswitch";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
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

    // 1. Login mit "fakeemail"
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username + "@fakeemail.com",
      password,
    });

    if (error) {
      setMessage(error.message);
      setMessageType("error");
      return;
    }

    // 2. User-Daten abrufen
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setMessage("User-Daten konnten nicht geladen werden");
      setMessageType("error");
      return;
    }

    // 3. Score speichern (hier Beispielwert 0)
    const { error: scoreError } = await supabase
      .from("Scores")
      .upsert({
        user_id: user.id,
        username: user.user_metadata.username,
      });

    if (scoreError) {
      console.error("Score konnte nicht gespeichert werden:", scoreError);
    }

    // 4. Erfolgsmeldung & Navigation
    setMessage("Login erfolgreich!");
    setMessageType("success");
    setTimeout(() => navigate("/"), 1000);

  };

  return (
    <div className="auth">
      <div className="page">
      <ToggleSwitch></ToggleSwitch>
        <div className="form-wrapper">
          <h2>Login</h2>
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
            <button type="submit">Log in</button>
          </form>
          <h3>
            Don't have an account? <Link to="/register">Register</Link>
          </h3>
          <span className={messageType}>{message}</span>
        </div>
      </div>
    </div>
  );
}

export default Login;
