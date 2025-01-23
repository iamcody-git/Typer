import React from "react";

const WordsDisplay = ({ words, wordStatuses, currentWordIndex }) => {
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

  return <div id="words">{words.map((word, index) => highlightWord(word, index))}</div>;
};

export default WordsDisplay;
