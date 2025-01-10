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

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Typing = () => {
  // Separate word arrays for English and Nepali
  const englishWordsArray = `
  in of that good real not school set world take infinity aurora mystic digital pathshala intern 
  `.trim().split(" ");
  const nepaliWordsArray = `
  नमस्ते संसार खुशी बिहान रात राम्रो धन्यवाद ठूलो घर
  `.trim().split(" ");

  const [gameWords, setGameWords] = useState([]);
  const [language, setLanguage] = useState("english"); // Current language: 'english' or 'nepali'
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(30);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [input, setInput] = useState("");
  const [totalWordsTyped, setTotalWordsTyped] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedTime, setSelectedTime] = useState(30);
  const [wordStatuses, setWordStatuses] = useState([]);
  const timerRef = useRef();

  useEffect(() => {
    startNewGame();
  }, [language]); // Restart game when language changes

  useEffect(() => {
    if (timer <= 0) {
      endGame();
    }
  }, [timer]);

  const startNewGame = () => {
    const wordsArray = language === "english" ? englishWordsArray : nepaliWordsArray;
    const randomWords = Array.from(
      { length: 100 },
      () => wordsArray[Math.floor(Math.random() * wordsArray.length)]
    );
    setGameWords(randomWords);
    setWordStatuses(new Array(randomWords.length).fill(null));
    initializeGameState();
  };
  

  const initializeGameState = () => {
    setGameOver(false);
    setTimer(selectedTime);
    setInput("");
    setTotalWordsTyped(0);
    setErrorCount(0);
    setCorrectCount(0);
    setCurrentWordIndex(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
  };

  const endGame = () => {
    setGameOver(true);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (value.endsWith(" ")) {
      const currentWord = gameWords[currentWordIndex];
      const isCorrect = value.trim() === currentWord;

      setWordStatuses((prev) =>
        prev.map((status, idx) =>
          idx === currentWordIndex ? (isCorrect ? "correct" : "incorrect") : status
        )
      );

      setCurrentWordIndex((prev) => prev + 1);
      setInput("");
      if (isCorrect) {
        setTotalWordsTyped((prev) => prev + currentWord.length);
        setCorrectCount((prev) => prev + 1);
      } else {
        setErrorCount((prev) => prev + 1);
      }
    }
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
    setTimer(time);
  };

  const switchLanguage = () => {
    setLanguage((prev) => (prev === "english" ? "nepali" : "english"));
  };

  const highlightWord = (word, index) => {
    const status = wordStatuses[index];
    return (
      <span
        key={index}
        className={`word ${status === "correct" ? "correct" : status === "incorrect" ? "incorrect" : ""}`}
      >
        {word}{" "}
      </span>
    );
  };

  // Data for the chart
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
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: `Typing Results (${language.toUpperCase()})`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Word Count",
        },
      },
    },
  };

  return (
    <div id="typing-game">
      <div id="info">
        <p className="text-center">Time left: {timer}s</p>
        <div className="flex justify-center space-x-4">
          <button onClick={startNewGame} className="align-middle">Next</button>
         
          <button onClick={switchLanguage} className="align-middle">
            Switch to {language === "english" ? "Nepali" : "English"}
          </button>
        </div>
        <div className="time-selection">
          <label htmlFor="time-select" className="text-center block">Choose Time</label>
          <div className="time-select">
            <button onClick={() => handleTimeChange(15)} className="time-option">15s</button>
            <button onClick={() => handleTimeChange(30)} className="time-option">30s</button>
            <button onClick={() => handleTimeChange(60)} className="time-option">60s</button>
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
        </div>
      )}

      {!gameOver && (
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          autoFocus
          className="typing-input"
        />
      )}
    </div>
  );
};

export default Typing;
