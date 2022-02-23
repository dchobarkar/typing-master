import React from "react";

import "./Words.css";

function Words(props) {
  return (
    <div className="words-container" ref={props.wordsRef}>
      {props.wordsList.map((word) => (
        <span className="word-ele" key={word}>
          {word}
        </span>
      ))}
    </div>
  );
}

export default Words;
