import React, { useState, useEffect } from "react";
import "./ToggleSwitch.css";

const ToggleSwitch = () => {
  const [isOn, setIsOn] = useState(false);

  // Beim ersten Laden das gespeicherte Theme setzen
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isLight = savedTheme === "light";

    setIsOn(isLight);
    if (isLight) {
      document.documentElement.classList.add("light-theme");
    } else {
      document.documentElement.classList.remove("light-theme");
    }
  }, []);

  const toggleTheme = () => {
    const newIsOn = !isOn;
    setIsOn(newIsOn);
    document.documentElement.classList.toggle("light-theme");
    localStorage.setItem("theme", newIsOn ? "light" : "dark");
  };

  return (
    <div className="toggle-wrapper">
      <label className="toggle-switch">
        <input type="checkbox" checked={isOn} onChange={toggleTheme} />
        <span className="slider" />
      </label>
      <span className="toggle-label">{isOn ? "Light" : "Dark"}</span>
    </div>
  );
};

export default ToggleSwitch;
