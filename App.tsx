import React, { useState } from "react";
import Quiz from "./components/Quiz";

const words = [
  { id: 1, word: "bonjour", meaning: "你好", pronunciation: "/bɔ̃.ʒuʁ/" },
  { id: 2, word: "merci", meaning: "谢谢", pronunciation: "/mɛʁ.si/" },
  { id: 3, word: "chat", meaning: "猫", pronunciation: "/ʃa/" },
  { id: 4, word: "chien", meaning: "狗", pronunciation: "/ʃjɛ̃/" },
  { id: 5, word: "maison", meaning: "房子", pronunciation: "/mɛ.zɔ̃/" },
];

const sentences = [
  { id: 1, text: "Bonjour, comment ça va ?", translation: "你好，你怎么样？" },
  { id: 2, text: "Merci beaucoup.", translation: "非常感谢。" },
  { id: 3, text: "J'ai un chat et un chien.", translation: "我有一只猫和一只狗。" },
];

const App: React.FC = () => {
  const [selectedWord, setSelectedWord] = useState(words[0]);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "40px" }}>French Learning App</h1>

      {/* 单词列表 */}
      <section style={{ marginBottom: "40px", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
        <h2>Word List</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {words.map((w) => (
            <div
              key={w.id}
              style={{
                padding: "10px 15px",
                border: selectedWord.id === w.id ? "2px solid #007bff" : "1px solid #ccc",
                borderRadius: "6px",
                cursor: "pointer",
                background: selectedWord.id === w.id ? "#e7f1ff" : "#fff",
              }}
              onClick={() => setSelectedWord(w)}
            >
              {w.word}
            </div>
          ))}
        </div>

        <div style={{ marginTop: "20px", padding: "10px", background: "#f9f9f9", borderRadius: "6px" }}>
          <strong>Selected Word:</strong> {selectedWord.word} <br />
          <strong>Meaning:</strong> {selectedWord.meaning} <br />
          <strong>Pronunciation:</strong> {selectedWord.pronunciation} <br />
          <audio controls style={{ marginTop: "10px" }}>
            <source
              src={`https://translate.google.com/translate_tts?ie=UTF-8&q=${selectedWord.word}&tl=fr&client=tw-ob`}
              type="audio/mpeg"
            />
            Your browser does not support the audio element.
          </audio>
        </div>
      </section>

      {/* 句子列表 */}
      <section style={{ marginBottom: "40px", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
        <h2>Example Sentences</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {sentences.map((s) => (
            <li
              key={s.id}
              style={{
                marginBottom: "15px",
                padding: "10px",
                background: "#f0f0f0",
                borderRadius: "6px",
              }}
            >
              <strong>{s.text}</strong>
              <div style={{ color: "#555" }}>{s.translation}</div>
            </li>
          ))}
        </ul>
      </section>

      {/* Quiz */}
      <section style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
        <h2>Quiz Section</h2>
        <Quiz />
      </section>
    </div>
  );
};

export default App;
