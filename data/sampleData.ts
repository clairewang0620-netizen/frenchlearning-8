import { Word, Sentence, Quiz } from '../types';

export const WORDS: Word[] = [
  // A1
  {
    id: "A1_001",
    french: "bonjour",
    ipa: "/bɔ̃.ʒuʁ/",
    chinese: "你好",
    part_of_speech: "感叹词",
    example: "Bonjour, comment allez-vous ?",
    example_chinese: "您好，您最近好吗？",
    level: "A1",
    category: "问候",
    tags: ["基础", "日常"]
  },
  {
    id: "A1_002",
    french: "chat",
    ipa: "/ʃa/",
    chinese: "猫",
    part_of_speech: "名词",
    example: "Le chat dort sur le canapé.",
    example_chinese: "猫在沙发上睡觉。",
    level: "A1",
    category: "动物",
    tags: ["宠物"]
  },
  {
    id: "A1_003",
    french: "rouge",
    ipa: "/ʁuʒ/",
    chinese: "红色",
    part_of_speech: "形容词",
    example: "J'aime les pommes rouges.",
    example_chinese: "我喜欢红苹果。",
    level: "A1",
    category: "颜色",
    tags: ["形容词"]
  },
  // A2
  {
    id: "A2_001",
    french: "voyager",
    ipa: "/vwa.ja.ʒe/",
    chinese: "旅行",
    part_of_speech: "动词",
    example: "Nous allons voyager en France cet été.",
    example_chinese: "今年夏天我们要去法国旅行。",
    level: "A2",
    category: "旅游",
    tags: ["动词", "活动"]
  },
  // B1
  {
    id: "B1_001",
    french: "environnement",
    ipa: "/ɑ̃.vi.ʁɔn.mɑ̃/",
    chinese: "环境",
    part_of_speech: "名词",
    example: "Il faut protéger l'environnement.",
    example_chinese: "我们必须保护环境。",
    level: "B1",
    category: "社会",
    tags: ["生态"]
  },
  // C1
  {
    id: "C1_001",
    french: "époustouflant",
    ipa: "/e.pus.tu.flɑ̃/",
    chinese: "令人惊叹的",
    part_of_speech: "形容词",
    example: "Ce paysage est tout simplement époustouflant.",
    example_chinese: "这景色简直令人惊叹。",
    level: "C1",
    category: "描述",
    tags: ["高级形容词"]
  }
];

export const SENTENCES: Sentence[] = [
  {
    id: "SENT_001",
    category: "问候",
    subcategory: "基本问候",
    french: "Bonjour, comment allez-vous ?",
    ipa: "/bɔ̃.ʒuʁ, kɔ.mɑ̃ a.le vu/",
    chinese: "您好，您最近好吗？",
    level: "A1",
    situation: "正式场合问候",
    notes: "用于长辈或上级"
  },
  {
    id: "SENT_002",
    category: "餐厅",
    subcategory: "点餐",
    french: "Je voudrais le menu, s'il vous plaît.",
    ipa: "/ʒə vu.dʁɛ lə mə.ny, sil vu plɛ/",
    chinese: "请给我菜单。",
    level: "A1",
    situation: "餐厅点餐",
    notes: "常用礼貌用语"
  },
  {
    id: "SENT_003",
    category: "紧急",
    subcategory: "求助",
    french: "Pouvez-vous m'aider ?",
    ipa: "/pu.ve vu mɛ.de/",
    chinese: "您能帮我吗？",
    level: "A2",
    situation: "寻求帮助"
  }
];

export const QUIZZES: Quiz[] = [
  {
    id: "QUIZ_A1_001",
    type: "vocabulary_multiple_choice",
    category: "基础词汇",
    level: "A1",
    question: "Bonjour是什么意思？",
    options: [
      { id: "A", text: "再见" },
      { id: "B", text: "你好" },
      { id: "C", text: "谢谢" },
      { id: "D", text: "对不起" }
    ],
    correct_answer: "B",
    explanation: "Bonjour是法语问候语，意为'你好' (日安)。",
    related_words: ["salut", "bonsoir"]
  },
  {
    id: "QUIZ_A1_002",
    type: "vocabulary_multiple_choice",
    category: "动物",
    level: "A1",
    question: "哪个单词是'猫'的意思？",
    options: [
      { id: "A", text: "Chien" },
      { id: "B", text: "Oiseau" },
      { id: "C", text: "Chat" },
      { id: "D", text: "Poisson" }
    ],
    correct_answer: "C",
    explanation: "Chat 意思是猫。Chien是狗，Oiseau是鸟，Poisson是鱼。",
    related_words: ["chaton"]
  },
  {
    id: "QUIZ_A2_001",
    type: "sentence_completion",
    category: "语法",
    level: "A2",
    question: "Je ___ allé au cinéma hier.",
    options: [
      { id: "A", text: "suis" },
      { id: "B", text: "ai" },
      { id: "C", text: "vais" },
      { id: "D", text: "es" }
    ],
    correct_answer: "A",
    explanation: "Passé composé: aller 是以 être 作助动词的动词之一。",
    related_words: ["aller", "venir"]
  }
];