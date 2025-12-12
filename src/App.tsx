import React, { useState } from "react";
import Quiz from "./components/Quiz";

// 示例单词数据
const words = [
  { id: 1, word: "bonjour", meaning: "你好", pronunciation: "/bɔ̃.ʒuʁ/" },
  { id: 2, word: "merci", meaning: "谢谢", pronunciation: "/mɛʁ.si/" },
  { id: 3, word: "chat", meaning: "猫", pronunciation: "/ʃa/" },
  { id: 4, word: "chien", meaning: "狗", pronunciation: "/ʃjɛ̃/" },
  { id: 5, word: "maison", meaning: "房子", pronunciation: "/mɛ.zɔ̃/" },
];

// 示例句子数据
const sentences = [
  { id: 1, text: "Bonjour, comment ça va ?", translation: "你好，你怎么样？" },
  { id: 2, text: "Merci beaucoup.", translation: "非常感谢。" },
  { id: 3, text: "J'ai un chat et un chien.", translation: "我有一只猫和一只狗。" },
];

const App: React.FC = () => {
  const [selectedWord, setSelectedWord] = useState(words[0]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>French Learning App</h1>

      {/* 单词列表 */}
      <section>
        <h2>Word List</h2>
        <ul>
          {words.map((w) => (
            <li key={w.id} style={{ cursor: "pointer" }} onClick={() => setSelectedWord(w)}>
              {w.word}
            </li>
          ))}
        </ul>
        <div style={{ marginTop: "10px" }}>
          <strong>Selected Word:</strong> {selectedWord.word} <br />
          <strong>Meaning:</strong> {selectedWord.meaning} <br />
          <strong>Pronunciation:</strong> {selectedWord.pronunciation} <br />
          <audio controls>
            <source
              src={`https://ssl.gstatic.com/dictionary/static/sounds/oxford/${selectedWord.word}--_gb_1.mp3`}
              type="audio/mpeg"
            />
            Your browser does not support the audio element.
          </audio>
        </div>
      </section>

      {/* 句子列表 */}
      <section style={{ marginTop: "30px" }}>
        <h2>Example Sentences</h2>
        <ul>
          {sentences.map((s) => (
            <li key={s.id}>
              {s.text} - {s.translation}
            </li>
          ))}
        </ul>
      </section>

      {/* Quiz 占位 */}
      <section style={{ marginTop: "30px" }}>
        <h2>Quiz Section</h2>
        <Quiz />
      </section>
    </div>
  );
};

export default App;
