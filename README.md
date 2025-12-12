# Lumière French Learning App

一个基于 React + Vite 的完整法语学习应用，支持 PWA、Web Speech API 发音，专为 Cloudflare Pages 部署设计。

## 📁 目录结构

```
src/
  ├── components/    # UI 组件 (WordList, Flashcard, Quiz...)
  ├── data/          # 静态数据 JSON
  │   ├── words/     # A1-C1 单词数据
  │   └── sentences/ # 口语句子
  ├── utils/         # 工具类 (TTSManager)
  └── types.ts       # TypeScript 类型定义
```

## 🚀 部署指南 (Cloudflare Pages)

1. **Fork/Clone 此仓库** 到 GitHub/GitLab。
2. 登录 Cloudflare Dashboard，进入 **Workers & Pages**。
3. 点击 **Create Application** -> **Connect to Git**。
4. 选择此仓库。
5. 配置构建设置：
   - **Framework Preset**: Vite
   - **Build command**: `npm run build`
   - **Output directory**: `dist`
6. 点击 **Save and Deploy**。

## 🔊 发音功能说明 (TTS)

应用使用 `src/utils/TTSManager.ts` 管理发音：
1. **优先**：使用浏览器原生 `speechSynthesis` API (Web Speech API)，无需网络流量，支持 Safari/Chrome/Edge。
2. **Fallback**：如果 JSON 数据中提供了 `audio_mp3` URL，且浏览器不支持 TTS，将自动降级播放 MP3。

**Safari & iOS 注意事项**：
iOS Safari 限制音频自动播放。用户必须与页面交互（点击）至少一次才能播放声音。App 设计中的“点击单词发音”按钮天然满足此要求。

## 🛠 本地开发

```bash
npm install
npm run dev
```

## 📊 数据完整性

当前包含数据：
- A1 单词示例 (src/data/words/A1_words.json)
- 口语句子示例 (src/data/sentences/sentences_all.json)

*注意：完整版需根据 provided JSON schema 填充剩余 3000+ 单词。*
