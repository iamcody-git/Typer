export const generateRandomWords = (wordArray, count = 100) => {
    return Array.from(
      { length: count },
      () => wordArray[Math.floor(Math.random() * wordArray.length)]
    );
  };
  
  export const resetGameState = (setters, time) => {
    const {
      setGameOver,
      setTimer,
      setInput,
      setCurrentWordIndex,
      setCorrectCount,
      setErrorCount,
      setWordStatuses,
      timerRef,
    } = setters;
  
    setGameOver(false);
    setTimer(time);
    setInput("");
    setCurrentWordIndex(0);
    setCorrectCount(0);
    setErrorCount(0);
    setWordStatuses([]);
    if (timerRef.current) clearInterval(timerRef.current);
  };
  