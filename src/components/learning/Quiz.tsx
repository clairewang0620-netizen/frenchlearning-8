import React, { useState } from "react";
import quizData from "../../data/quizA1.json";

const Quiz: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const currentQuiz = quizData[currentIndex];

  const handleNext = () => {
    setSelectedOption(null);
    if (currentIndex < quizData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("测试完成！");
    }
  };

  const playAudio = (url: string) => {
    const audio = new Audio(url);
    audio.play();
  };

  return (
    <div>
      <h3>{currentQuiz.question}</h3>
      <button onClick={() => playAudio(currentQuiz.question_audio)}>播放问题音</button>
      <ul>
        {currentQuiz.options.map((opt) => (
          <li key={opt.id}>
            <label>
              <input
                type="radio"
                name="quiz"
                value={opt.id}
                checked={selectedOption === opt.id}
                onChange={() => setSelectedOption(opt.id)}
              />
              {opt.text}{" "}
              <button onClick={() => playAudio(opt.audio)}>发音</button>
            </label>
          </li>
        ))}
      </ul>
      <button onClick={handleNext}>下一题</button>
    </div>
  );
};

export default Quiz;
