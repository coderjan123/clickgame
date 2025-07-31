import React, { useEffect, useState } from "react";
import ToggleSwitch from "./toggleswitch";
import "../components/header_info.css";
import Dropdown from "./dropdown";

const Header_info = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) {
      console.log("Benutzername gefunden:", storedName);
      setUsername(storedName);
    } else {
      console.log("Name konnte nicht gefunden werden!");
    }
  }, []);

  return (
    <header className="topbar">
      <Dropdown />

    {/*  <div className="topbar_username">
                {username ? `Hallo, ${username}!` : "Hallo, Gast!"}

      </div>*/}

      <ToggleSwitch />
    </header>
  );
};

export default Header_info;
