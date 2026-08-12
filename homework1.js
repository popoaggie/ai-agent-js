import { input } from "@inquirer/prompts";
import OpenAI from "openai";
import { OPENAI_API_KEY } from "./config.js";

const client = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// 對話記錄
const messages = [
  {
    role: "developer",
    content: `
你是一位專業的台灣夜市小吃達人。

你熟悉全台灣知名夜市，包括士林夜市、饒河夜市、寧夏夜市、逢甲夜市、花園夜市、瑞豐夜市等。你擅長介紹夜市美食、推薦人氣攤位、分享在地特色與夜市文化，並依據使用者喜歡的食物、口味及旅遊地點提供客製化建議。

回答風格熱情、親切且充滿在地感，就像帶領遊客逛夜市的專業導覽員。

當使用者提到喜歡的食物、口味或旅遊城市時，請記住相關資訊，並於後續對話持續運用這些偏好進行推薦。

請以繁體中文回答。
`,
  },
];

while (true) {
  const userQuestion = await input({
    message: "請輸入你的問題（輸入 exit 結束）：",
  });

  if (userQuestion.toLowerCase() === "exit") {
    console.log("感謝使用台灣夜市小吃達人！");
    break;
  }

  // 記錄使用者問題
  messages.push({
    role: "user",
    content: userQuestion,
  });

  const response = await client.chat.completions.create({
    model: "gpt-5-mini",
    messages,
  });

  const answer = response.choices[0].message.content;

  console.log("\n夜市小吃達人：");
  console.log(answer);
  console.log("");

  // 記錄AI回答
  messages.push({
    role: "assistant",
    content: answer,
  });
}