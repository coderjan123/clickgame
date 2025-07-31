import Leaderboard_info from "../components/leaderboard_info";
import Header_info from "../components/header_info";
import { useEffect, useState } from "react";
import supabase from "../helper/supabaseClient";
import "../styles/leaderboard.css"
function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);

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

      localStorage.setItem(
        "username",
        user.user_metadata?.username || "Unbekannt"
      );

      const { data: scoreData, error: scoreError } = await supabase
        .from("Scores")
        .select("username, score")
        .order("score", { ascending: false });

      if (scoreError) {
        console.log("Fehler beim Laden des Scores:", scoreError);
        return;
      }

      setLeaderboardData(scoreData || []);
      console.log(scoreData); // enthält alle { username, score }-Objekte
    };

    fetchUserAndScore();
  }, []);

  return (
    <>
      <Header_info />
      {leaderboardData.map((entry, index) => (
        <Leaderboard_info key={index} username={entry.username} score={entry.score} rank={index + 1}   />
      ))}
    </>
  );
}

export default Leaderboard;
