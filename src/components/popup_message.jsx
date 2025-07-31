import React, { useState, useEffect } from "react";

const Popup_message = ({ message, success, onClose }) => {
  const [filled, setFilled] = useState(0);

  useEffect(() => {
    if (message) {
      setFilled(0);
    }
  }, [message]);

  useEffect(() => {
    if (filled < 100 && message) {
      const timer = setTimeout(() => setFilled(prev => prev + 1), 50);
      return () => clearTimeout(timer);
    } else if (filled >= 100 && onClose) {
      onClose();
    }
  }, [filled, message, onClose]);

  if (!message) return null;

  return (
    <div className="popup_div">
      <p className={`save_message ${success ? "success" : "error"}`}>{message}</p>
      <div className="progressbar visible">
        <div
          style={{
            height: "2vh",
            width: `${filled}%`,
            backgroundColor: "var(--accent)",
            transition: "width 0.05s linear",
          }}
        />
      </div>
    </div>
  );
};

export default Popup_message;
