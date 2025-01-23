import React, { useEffect, useRef, useState } from "react";
import "../App.css";
import Header from "../Components/Header.jsx";
import WordsDisplay from "../Components/wordDisplay.jsx";
import ChartDisplay from "../Components/chartDisplay.jsx";
import { generateRandomWords, resetGameState } from "../helpers/gameHelpers";
import { saveResultsToDB } from "../helpers/dbHelpers";
import { db } from "../../firebaseConfig.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Typing = () => {
  const ENGLISH_WORDS = ["in","of","that","good","real","digital","pathshala","laptop","programming","animals"];
  const NEPALI_WORDS = ["नमस्ते","संसार","खुशी","धन्यवाद","आमा","खाना","सूर्य"];

  const auth = getAuth();
  const navigate = useNavigate();

  const [gameWords, setGameWords] = useState([]);
  const [language, setLanguage] = useState("english");
  const [timer, setTimer] = useState(30);
  const [selectedTime, setSelectedTime] = useState(30);
  const [input, setInput] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordStatuses, setWordStatuses] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [user, setUser] = useState(null);

  const timerRef = useRef();

  const startNewGame = () => {
    const wordArray = language === "english" ? ENGLISH_WORDS : NEPALI_WORDS;
    setGameWords(generateRandomWords(wordArray));
    resetGameState(
      {
        setGameOver,
        setTimer: () => setTimer(selectedTime), 
        setInput,
        setCurrentWordIndex,
        setCorrectCount,
        setErrorCount,
        setWordStatuses,
        timerRef,
      },
      selectedTime
    );
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (timer > 0 && !timerRef.current) {
      timerRef.current = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }

    if (value.endsWith(" ")) {
      const isCorrect = value.trim() === gameWords[currentWordIndex];
      setWordStatuses((prev) =>
        prev.concat(isCorrect ? "correct" : "incorrect")
      );
      setCurrentWordIndex((prev) => prev + 1);
      setInput("");
      if (isCorrect) setCorrectCount((prev) => prev + 1);
      else setErrorCount((prev) => prev + 1);
    }
  };

  const handleTimeChange = (time) => {
    const newTime = parseInt(time, 10);
    setSelectedTime(newTime); 
    setTimer(newTime); 
    startNewGame(); 
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) setUser(currentUser);
      else {
        toast.warn("Please log in to play!");
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  useEffect(() => {
    startNewGame();
  }, [language]);

  useEffect(() => {
    if (timer <= 0) {
      setGameOver(true);
      setInput("");
      if (timerRef.current) clearInterval(timerRef.current);

      if (user) {
        saveResultsToDB(db, user, {
          language,
          correctWords: correctCount,
          incorrectWords: errorCount,
          totalWords: correctCount + errorCount,
          accuracy:
            ((correctCount / (correctCount + errorCount || 1)) * 100).toFixed(
              2
            ),
          time: selectedTime,
        });
      }
    }
  }, [timer, user, correctCount, errorCount, language, selectedTime]);

  return (
    <div id="typing-game">
      <Header
        timer={timer}
        selectedTime={selectedTime}
        onNewGame={startNewGame}
        onToggleLanguage={() =>
          setLanguage((prev) => (prev === "english" ? "nepali" : "english"))
        }
        language={language}
        onTimeChange={handleTimeChange}
      />
      {gameOver ? (
        <ChartDisplay correctCount={correctCount} errorCount={errorCount} />
      ) : (
        <>
          <WordsDisplay
            words={gameWords}
            wordStatuses={wordStatuses}
            currentWordIndex={currentWordIndex}
          />
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            autoFocus
            placeholder="Start typing..."
            style={{
              color: "black",
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "8px",
              fontSize: "16px",
            }}
          />
        </>
      )}
    </div>
  );
};

export default Typing;