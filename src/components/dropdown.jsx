import React from "react";
import ToggleSwitch from "./toggleswitch";
import "../components/dropdown.css"
import { Link, useNavigate } from "react-router-dom";
import supabase from "../helper/supabaseClient";

const Header_info = () => {
  const navigate = useNavigate();
    const username = localStorage.getItem("username");
        const clickSound = new Audio("/clickgame/sharp-pop-328170.mp3");


    if (username !== null) {
    console.log("Benutzername gefunden:", username);
    } else {
        console.log("name konnte nicht gefunden werden!")
        
    }

      const signOut = async () => {
    clickSound.play();

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    navigate("/login");
  };
     const playSound = () => {
    clickSound.play();

  };
   
  return (
    <>
    <div className="container">
      <div className="option"><Link to={"/"}  onClick={playSound} className="option-link"> Home</Link></div>
      <div className="option"  ><Link to={"/leaderboard"} onClick={playSound} className="option-link"> Leaderboard</Link></div>
      <div className="option extradiv" ><p onClick={() => {playSound();}}className="extrawurst">Log out</p></div>
      </div>
    </>

  );
};

export default Header_info; 