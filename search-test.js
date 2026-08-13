import { searchPythonBook } from "./lib/qdrant.js";

const queries = [
  "哪個城市適合看港灣景色？",
  "我想安排古蹟旅行",
  "花蓮不開車可以怎麼玩？"
];

for (const query of queries) {
  console.log("\n==================");
  console.log(`問題：${query}`);

  const results = await searchPythonBook(query, 3);

  console.log(JSON.stringify(results, null, 2));
}