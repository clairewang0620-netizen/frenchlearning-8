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
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px", fontFamily: "Arial, sans-serif", color: "#333" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>French Learning App</h1>

      {/* 单词列表 */}
      <section>
        <h2>Word List</h2>
        <ul style={{ display: "flex", flexWrap: "wrap", gap: "10px", padding: 0, listStyle: "none" }}>
          {words.map((w) => (
            <li
              key={w.id}
              style={{
                cursor: "pointer",
                padding: "10px 15px",
                border: selectedWord.id === w.id ? "2px solid #007BFF" : "1px solid #ccc",
                borderRadius: "8px",
                transition: "0.2s",
                backgroundColor: "#fff",
              }}
              onClick={() => setSelectedWord(w)}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
            >
              {w.word}
            </li>
          ))}
        </ul>

        <div
          style={{
            marginTop: "15px",
            padding: "15px",
            border: "1px solid #aaa",
            borderRadius: "8px",
            backgroundColor: "#fafafa",
          }}
        >
          <strong>Selected Word:</strong> {selectedWord.word} <br />
          <strong>Meaning:</strong> {selectedWord.meaning} <br />
          <strong>Pronunciation:</strong> {selectedWord.pronunciation} <br />
          <audio controls style={{ width: "100%", marginTop: "10px" }}>
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
        <ul style={{ listStyle: "none", padding: 0 }}>
          {sentences.map((s) => (
            <li
              key={s.id}
              style={{
                marginBottom: "10px",
                padding: "10px",
                borderRadius: "6px",
                backgroundColor: "#fefefe",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <strong>{s.text}</strong> <br />
              <em>{s.translation}</em>
            </li>
          ))}
        </ul>
      </section>

      {/* Quiz 占位 */}
      <section
        style={{
          marginTop: "30px",
          padding: "15px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h2>Quiz Section</h2>
        <Quiz />
      </section>
    </div>
  );
};

export default App;
