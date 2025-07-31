import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../helper/supabaseClient";
import Popup_message from "../components/popup_message";
import Header_info from "../components/header_info";
import "../styles/real_app.css";

function Real_app() {
  const navigate = useNavigate();

  const [clicks, setClicks] = useState(null);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(true);
  const [messageId, setMessageId] = useState(0);
  const [roulette, setRoulette] = useState("OFF");
    const clickSound = new Audio("/clickgame/sharp-pop-328170.mp3");

  const clicksRef = useRef(clicks);
  useEffect(() => {
    clicksRef.current = clicks;
  }, [clicks]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      document.documentElement.classList.add("light-theme");
    }
  }, []);

  useEffect(() => {
    const fetchUserAndScore = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.log("User-Daten konnten nicht geladen werden");
        return;
      }

      localStorage.setItem("username", user.user_metadata?.username || "Unbekannt");
      setMessage(`Hallo ${user.user_metadata?.username}!`);

      const { data: scoreData, error: scoreError } = await supabase
        .from("Scores")
        .select("score")
        .eq("user_id", user.id)
        .single();

      if (scoreError) {
        console.log("Fehler beim Laden des Scores:", scoreError);
        return;
      }

      if (scoreData && scoreData.score !== null) {
        setClicks(scoreData.score);
      } else {
        setClicks(0);
      }
    };

    fetchUserAndScore();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.log("User-Daten konnten nicht geladen werden");
        return;
      }

      const currentClicks = clicksRef.current ?? 0;

      const { error: scoreError } = await supabase.from("Scores").upsert({
        user_id: user.id,
        username: user.user_metadata.username,
        score: currentClicks,
      });

      if (scoreError) {
        console.log("Auto-Save Fehler:", scoreError);
      } else {
        console.log("Auto-Save erfolgreich:", currentClicks);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handle_click = () => {
    if (clicks === null) return;

    if (roulette === "OFF") {
      setClicks((prev) => prev + 1);
      clickSound.play();
    } else if (roulette === "ON") {
      if (Math.floor(Math.random() * 100) < 5) { // 5% Chance Reset auf 0
        setClicks(0);
      } else {
        setClicks((prev) => prev + 5);
        clickSound.play();
      }
    } else if (roulette === "GIGA") {
      const rand = Math.random() * 100;

      if (rand < 20) {
        // 20% Chance: -500 bis -1000 Klicks oder 0 falls nicht genug Klicks
        const loss = 500 + Math.floor(Math.random() * 501); // 500-1000
        setClicks((prev) => (prev >= loss ? prev - loss : 0));
        clickSound.play();
      } else if (rand < 35) {
        // 15% Chance: +500 bis +1000 Klicks, evtl. verdoppelt
        let gain = 500 + Math.floor(Math.random() * 501);
        if (Math.random() < 0.3) gain *= 2;  // 30% Chance auf Verdopplung
        setClicks((prev) => prev + gain);
        clickSound.play();
      } else if (rand < 37) {
        // 2% Chance: großer Bonus +2000 bis +4000 Klicks
        let bigGain = 2000 + Math.floor(Math.random() * 2001);
        setClicks((prev) => prev + bigGain);
        clickSound.play();
      } else if (rand < 42) {
        // 5% Chance Reset auf 0 Klicks
        setClicks(0);
      } else {
        // 58% Chance: kleine Gewinne +50 bis +100 Klicks
        let smallGain = 50 + Math.floor(Math.random() * 51);
        setClicks((prev) => prev + smallGain);
        clickSound.play();
      }
    }
  };

  const setNewMessage = (msg, succ) => {
    setMessage(msg);
    setSuccess(succ);
    setMessageId((prev) => prev + 1);
  };

  const clearMessage = () => setMessage("");

  const handle_savegame = async () => {
    clickSound.play();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.log("User-Daten konnten nicht geladen werden");
      return;
    }

    const { error: scoreError } = await supabase.from("Scores").upsert({
      user_id: user.id,
      username: user.user_metadata.username,
      score: clicks,
    });

    if (scoreError) {
      setNewMessage(scoreError.message, false);
    } else {
      setNewMessage("Erfolgreich spiel gespeichert!", true);
    }
  };

  const toggleRoulette = () => {
    clickSound.play();

    setRoulette((prev) => {
      if (prev === "OFF") return "ON";
      if (prev === "ON") return "GIGA";
      return "OFF";
    });
  };

  const signOut = async () => {
    const clickSound = new Audio("/sharp-pop-328170.mp3");
    clickSound.play();

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    navigate("/login");
  };

  return (
    <div className="real_app">
      <Popup_message key={messageId} message={message} success={success} onClose={clearMessage} />
      <Header_info />

      <button className="clickbutton" onClick={handle_click}>
        {clicks === null ? "Lädt..." : clicks}
      </button>

      <button onClick={handle_savegame} className="save-btn">
        Save Game
      </button>

      <button className="save-btn" onClick={() => navigate("/Leaderboard")}>
        Leaderboards
      </button>

      <button
        className="signout-btn"
        onClick={toggleRoulette}
        title={
          roulette === "OFF"
            ? "Roulette ist aus"
            : roulette === "ON"
            ? "99% chance +10 clicks, 1% chance reset auf 0"
            : "GIGA Mode: 40% -1000 (oder 0), 9% +1000, 1% +10000, 10% 0, sonst +100"
        }
      >
        {`Roulette mode: ${roulette}`}
      </button>

      <button onClick={signOut} className="signout-btn">
        Sign out
      </button>
    </div>
  );
}

export default Real_app;
