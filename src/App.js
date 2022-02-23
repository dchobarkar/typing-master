import React, { useEffect, useState, useRef } from "react";

import { calPercent, shuffledWords, timerString } from "./utils/utils";
import Words from "./components/Words/Words";
import "./App.css";

const wordsList = shuffledWords();

function App() {
  const wordsRef = useRef(null);
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const isStartedRef = useRef(true);
  const indexRef = useRef(0);
  const score = useRef(0);
  const wordsCount = useRef(0);

  const [input, setInput] = useState("");
  const [seconds, setSeconds] = useState(60);
  const [highScore, setHighScore] = useState(localStorage.getItem("highScore"));

  // Function to handle inputs
  const inputHandler = (e) => {
    setInput(e.target.value);

    if (isStartedRef.current) {
      timerRef.current = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);

      isStartedRef.current = false;
    }
  };

  // Function to perform after completion tasks
  const handleStop = () => {
    clearInterval(timerRef.current);
    setInput("");
    inputRef.current.blur();

    if (score.current > localStorage.getItem("highScore")) {
      localStorage.setItem("highScore", score.current);
      setHighScore(score.current);
    }
  };

  // Function to reset everything
  const handleReset = () => {
    clearInterval(timerRef.current);
    isStartedRef.current = true;
    indexRef.current = 0;
    score.current = 0;
    wordsCount.current = 0;
    setInput("");
    setSeconds(60);

    Array.from(wordsRef.current.children).forEach((child) => {
      child.style.color = "";
      child.style.backgroundColor = "";
    });
  };

  // Function to handler space input
  const handleKeyPress = (e) => {
    if (e.code === "Space") {
      wordsRef.current.children[indexRef.current].style.backgroundColor = "";

      if (input === wordsList[indexRef.current]) {
        wordsRef.current.children[indexRef.current].style.color = "#06FF00";
        score.current++;
      } else {
        wordsRef.current.children[indexRef.current].style.color = "#F90716";
      }

      indexRef.current++;
      wordsCount.current++;
      setInput("");

      if (indexRef.current % 11 === 0) {
        wordsList.splice(0, 11);
        indexRef.current = 0;
      }
    }
  };

  useEffect(() => {
    inputRef.current.focus();
    wordsRef.current.children[indexRef.current].style.backgroundColor =
      "#D67D3E";
    wordsRef.current.children[indexRef.current].style.borderRadius = "5px";

    if (seconds === 0) {
      handleStop();
    }
  }, [seconds, input, highScore]);

  return (
    <div className="container">
      <p className="text">High Score : {highScore} WPM</p>

      <Words wordsRef={wordsRef} wordsList={wordsList} />

      <h2 className="current-speed">
        {seconds === 0 && score.current + " WPM"}
      </h2>

      <p>
        {seconds === 0 &&
          "Accuracy : " + calPercent(score.current, wordsCount.current) + " % "}
      </p>

      <input
        className="input"
        ref={inputRef}
        type="text"
        value={input.trim()}
        onChange={inputHandler}
        onKeyDown={handleKeyPress}
        tabIndex="0"
      />

      <h1>{timerString(seconds)}</h1>

      <button className="button" type="button" onClick={handleReset}>
        Reset
      </button>
    </div>
  );
}

export default App;
