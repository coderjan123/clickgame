import React, { useState, useEffect } from "react";
import "../components/leaderboard_info.css"
const Leaderboard_info = ({username, score ,rank}) => {
  // {}

  return (
    <div className="main_lead">
      <h2>{rank}</h2>
      <h2>{username}</h2>
      <h2>{score}</h2>

    </div>
  );
};

export default Leaderboard_info;
