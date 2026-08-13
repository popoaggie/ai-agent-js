import { input } from "@inquirer/prompts";
import OpenAI from "openai";
import { OPENAI_API_KEY } from "./config.js";
import { currentTimeTool, getCurrentTime } from "./tools/currentTime.js";
import { weatherTool, getWeather } from "./tools/weather.js";

const client = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const messages = [
  {
    role: "developer",
    content:
      "你是一位可以查詢目前時間與天氣狀況的 AI 助理。當使用者詢問現在時間時，請呼叫 get_current_time 工具。當使用者詢問天氣時，請呼叫 get_weather 工具。若使用者同時詢問時間與天氣，請同時呼叫兩個工具，並用繁體中文整合回答。",
  },
];

const availableTools = {
  get_current_time: getCurrentTime,
  get_weather: getWeather,
};

const tools = [currentTimeTool, weatherTool];

while (true) {
  const userQuestion = await input({
    message: "請輸入你的問題（輸入 exit 結束）：",
  });

  if (userQuestion.toLowerCase() === "exit") {
    console.log("結束作業4：天氣與時間工具");
    break;
  }

  messages.push({
    role: "user",
    content: userQuestion,
  });

  const firstResponse = await client.chat.completions.create({
    model: "gpt-5-mini",
    messages,
    tools,
    tool_choice: "auto",
  });

  const firstMessage = firstResponse.choices[0].message;
  messages.push(firstMessage);

  if (firstMessage.tool_calls && firstMessage.tool_calls.length > 0) {
    for (const toolCall of firstMessage.tool_calls) {
      const functionName = toolCall.function.name;
      const functionArgs = JSON.parse(toolCall.function.arguments || "{}");

      console.log("\nAI 呼叫工具：");
      console.log(functionName);

      console.log("工具參數：");
      console.log(functionArgs);

      const toolFunction = availableTools[functionName];

      if (!toolFunction) {
        console.log("找不到工具：", functionName);
        continue;
      }

     const toolResult = await toolFunction(functionArgs);

      console.log("工具回傳結果：");
      console.log(toolResult);

      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(toolResult),
      });
    }

    const finalResponse = await client.chat.completions.create({
      model: "gpt-5-mini",
      messages,
    });

    const finalAnswer = finalResponse.choices[0].message.content;

    console.log("\nAI 回答：");
    console.log(finalAnswer);
    console.log("");

    messages.push({
      role: "assistant",
      content: finalAnswer,
    });
  } else {
    console.log("\nAI 回答：");
    console.log(firstMessage.content);
    console.log("");

    messages.push({
      role: "assistant",
      content: firstMessage.content,
    });
  }
}