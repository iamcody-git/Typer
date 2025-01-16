import React, { useEffect, useRef, useState } from "react";
import "../App.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { collection, addDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../../firebaseConfig.js";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TypingGame = () => {
  const englishWordsArray = `
    in of that good real not school set world take infinity aurora mystic digital pathshala intern
  `
    .trim()
    .split(" ");
  const nepaliWordsArray = `
    नमस्ते संसार खुशी बिहान रात राम्रो धन्यवाद ठूलो घर
  `
    .trim()
    .split(" ");

  const [gameWords, setGameWords] = useState([]);
  const [language, setLanguage] = useState("english");
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(30);
  const [selectedTime, setSelectedTime] = useState(30);
  const [input, setInput] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordStatuses, setWordStatuses] = useState([]);
  const [totalWordsTyped, setTotalWordsTyped] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);
  const [user, setUser] = useState(null);

  const timerRef = useRef();
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        // Redirect to login if not authenticated
        toast.warn("Please log in to play the game!", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/login");
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const startNewGame = () => {
    const wordsArray =
      language === "english" ? englishWordsArray : nepaliWordsArray;
    const randomWords = Array.from(
      { length: 100 },
      () => wordsArray[Math.floor(Math.random() * wordsArray.length)]
    );
    setGameWords(randomWords);
    setWordStatuses(new Array(randomWords.length).fill(null));
    resetGameState(selectedTime);
  };

  const resetGameState = (time) => {
    setGameOver(false);
    setTimer(time);
    setInput("");
    setTotalWordsTyped(0);
    setCorrectCount(0);
    setErrorCount(0);
    setCurrentWordIndex(0);
    setTimerStarted(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const startTimer = () => {
    if (timerStarted) return;
    setTimerStarted(true);
    timerRef.current = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
  };

  const endGame = () => {
    setGameOver(true);
    if (timerRef.current) clearInterval(timerRef.current);

    if (user) {
      pushDataToDB();
    } else {
      toast.warn("Log in to save your results!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const pushDataToDB = async () => {
    try {
      const totalWordsAttempted = correctCount + errorCount;
      const accuracy =
        totalWordsAttempted > 0
          ? parseFloat(((correctCount / totalWordsAttempted) * 100).toFixed(2))
          : 0;
  
      const resultsRef = collection(db, "Results");
      const docRef = await addDoc(resultsRef, {
        uid: user.uid,
        language,
        correctWords: correctCount,
        incorrectWords: errorCount,
        totalWords: totalWordsTyped,
        accuracy,
        time: selectedTime,
        date: new Date(),
      });
      console.log("Result saved with ID:", docRef.id); // Log document ID
      toast.success("Results saved successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error("Failed to save results. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Error saving results:", err);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (!timerStarted) {
      startTimer();
    }

    if (value.endsWith(" ")) {
      const currentWord = gameWords[currentWordIndex];
      const isCorrect = value.trim() === currentWord;

      setWordStatuses((prev) =>
        prev.map((status, idx) =>
          idx === currentWordIndex
            ? isCorrect
              ? "correct"
              : "incorrect"
            : status
        )
      );
      setCurrentWordIndex((prev) => prev + 1);
      setInput("");
      if (isCorrect) {
        setCorrectCount((prev) => prev + 1);
        setTotalWordsTyped((prev) => prev + currentWord.length);
      } else {
        setErrorCount((prev) => prev + 1);
      }
    }
  };

  const switchLanguage = () => {
    setLanguage((prev) => (prev === "english" ? "nepali" : "english"));
  };

  const highlightWord = (word, index) => {
    const status = wordStatuses[index];
    return (
      <span
        key={index}
        className={`word ${
          status === "correct"
            ? "correct"
            : status === "incorrect"
            ? "incorrect"
            : ""
        }`}
      >
        {word}{" "}
      </span>
    );
  };

  const chartData = {
    labels: ["Correct Words", "Incorrect Words"],
    datasets: [
      {
        label: "Typing Test Results",
        data: [correctCount, errorCount],
        backgroundColor: ["#4caf50", "#f44336"],
        borderColor: ["#388e3c", "#d32f2f"],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
      title: {
        display: true,
        text: `Typing Results (${language.toUpperCase()})`,
      },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Word Count" } },
    },
  };

  useEffect(() => {
    startNewGame();
  }, [language]);

  useEffect(() => {
    if (timer <= 0) endGame();
  }, [timer]);

  return (
    <div id="typing-game">
      <div id="info">
        <p className="text-center">Time left: {timer}s</p>
        <div className="flex justify-center space-x-4">
          <button onClick={startNewGame} className="btn">
            New Game
          </button>
          <button onClick={switchLanguage} className="btn">
            Switch to {language === "english" ? "Nepali" : "English"}
          </button>
        </div>
        <div className="time-selection">
          <label htmlFor="time-select" className="block">
            Choose Time
          </label>
          <div className="flex space-x-2 justify-center text-center">
            {[15, 30, 60].map((time) => (
              <button
                key={time}
                onClick={() => {
                  setSelectedTime(time);
                  resetGameState(time);
                }}
                className="btn"
              >
                {time}s
              </button>
            ))}
          </div>
        </div>
      </div>

      {!gameOver ? (
        <div id="words">
          {gameWords.map((word, index) => highlightWord(word, index))}
        </div>
      ) : (
        <div className="chart-container">
          <Line data={chartData} options={chartOptions} />
          <p className="text-center">Correct Words: {correctCount}</p>
          <p className="text-center">Incorrect Words: {errorCount}</p>
          <p className="text-center">
            Accuracy:{" "}
            {correctCount + errorCount > 0
              ? ((correctCount / (correctCount + errorCount)) * 100).toFixed(2)
              : 0}
            %
          </p>
        </div>
      )}

      {!gameOver && (
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          autoFocus
          className="typing-input"
          placeholder="Start typing here..."
        />
      )}
    </div>
  );
};

export default TypingGame;
