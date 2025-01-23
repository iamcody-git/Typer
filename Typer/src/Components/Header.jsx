import React from "react";

const Header = ({
  timer,
  selectedTime,
  onNewGame,
  onToggleLanguage,
  language,
  onTimeChange,
}) => {
  return (
    <header
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        padding: "16px",
      }}
    >
      {/* Time Remaining */}
      <p style={{ margin: 0, fontSize: "18px", fontWeight: "bold" }}>
        Time Remaining: {timer}s
      </p>

      {/* Timer Selection Section */}
      <div style={{ textAlign: "center" }}>
        <label style={{ fontSize: "14px", marginBottom: "8px", display: "block" }}>
          Set Timer:
        </label>
        <div
          style={{
            display: "flex",
            gap: "8px",
            justifyContent: "center",
          }}
        >
          {[15, 30, 60].map((time) => (
            <button
              key={time}
              onClick={() => onTimeChange(time)}
              style={{
                backgroundColor: selectedTime === time ? "#4caf50" : "#f0f0f0",
                color: selectedTime === time ? "#fff" : "#000",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "8px 16px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "bold",
                transition: "background-color 0.3s, color 0.3s",
              }}
            >
              {time}s
            </button>
          ))}
        </div>
      </div>

      {/* Other Buttons */}
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={onNewGame}
          style={{
            backgroundColor: "#2196f3",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "8px 16px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          New Game
        </button>
        <button
          onClick={onToggleLanguage}
          style={{
            backgroundColor: "#ff9800",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "8px 16px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          Switch to {language === "english" ? "Nepali" : "English"}
        </button>
      </div>
    </header>
  );
};

export default Header;