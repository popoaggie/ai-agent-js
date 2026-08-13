import OpenAI from "openai";
import { OPENAI_API_KEY } from "./config.js";

const client = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const TEST_GROUPS = [
  {
    groupName: "第1組：意思相近的句子",
    sentences: [
      "我喜歡貓",
      "貓咪很可愛",
      "我養了一隻貓",
    ],
  },
  {
    groupName: "第2組：意思不同的句子",
    sentences: [
      "今天天氣很好",
      "我要去買菜",
      "電腦壞了",
    ],
  },
  {
    groupName: "第3組：品質管理相關句子",
    sentences: [
      "面板發生亮點不良，需要進行品質分析",
      "製程異常導致顯示器出現缺陷",
      "夜市小吃很多，雞排和珍珠奶茶很受歡迎",
    ],
  },
];

function cosineSimilarity(vectorA, vectorB) {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    magnitudeA += vectorA[i] * vectorA[i];
    magnitudeB += vectorB[i] * vectorB[i];
  }

  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

async function getEmbedding(text) {
  const response = await client.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return response.data[0].embedding;
}

async function runSimilarityTest() {
  console.log("作業5：Embedding 相似度實驗");
  console.log("====================================");

  for (const group of TEST_GROUPS) {
    console.log(`\n${group.groupName}`);
    console.log("------------------------------------");

    const embeddings = [];

    for (const sentence of group.sentences) {
      const embedding = await getEmbedding(sentence);

      embeddings.push({
        sentence,
        embedding,
      });
    }

    for (let i = 0; i < embeddings.length; i++) {
      for (let j = i + 1; j < embeddings.length; j++) {
        const similarity = cosineSimilarity(
          embeddings[i].embedding,
          embeddings[j].embedding
        );

        console.log(`句子 A：${embeddings[i].sentence}`);
        console.log(`句子 B：${embeddings[j].sentence}`);
        console.log(`相似度：${similarity.toFixed(4)}`);
        console.log("");
      }
    }
  }

  console.log("實驗完成");
}

runSimilarityTest();