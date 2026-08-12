import { input } from "@inquirer/prompts";
import OpenAI from "openai";
import { OPENAI_API_KEY } from "./config.js";
import { calculateTool, calculate } from "./tools/calculator.js";

const client = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const messages = [
  {
    role: "developer",
    content:
      "你是一位會使用計算機工具的 AI 助理。當使用者提出數學計算問題時，請呼叫 calculate 工具進行計算，再用繁體中文回答。",
  },
];

while (true) {
  const userQuestion = await input({
    message: "請輸入你的問題（輸入 exit 結束）：",
  });

  if (userQuestion.toLowerCase() === "exit") {
    console.log("結束作業2：Calculator Function Calling");
    break;
  }

  messages.push({
    role: "user",
    content: userQuestion,
  });

  const response = await client.chat.completions.create({
    model: "gpt-5-mini",
    messages,
    tools: [calculateTool],
    tool_choice: "auto",
  });

  const message = response.choices[0].message;

  if (message.tool_calls && message.tool_calls.length > 0) {
    const toolCall = message.tool_calls[0];

    const args = JSON.parse(toolCall.function.arguments);

    console.log("\nAI 呼叫工具：");
    console.log(toolCall.function.name);

    console.log("工具參數：");
    console.log(args);

    const toolResult = calculate(args);

    console.log("工具回傳結果：");
    console.log(toolResult);

    messages.push(message);

    messages.push({
      role: "tool",
      tool_call_id: toolCall.id,
      content: JSON.stringify(toolResult),
    });

    const finalResponse = await client.chat.completions.create({
      model: "gpt-5-mini",
      messages,
    });

    const finalAnswer =
      finalResponse.choices[0].message.content;

    console.log("\nAI 回答：");
    console.log(finalAnswer);
    console.log("");

    messages.push({
      role: "assistant",
      content: finalAnswer,
    });
  } else {
    console.log("\nAI 回答：");
    console.log(message.content);
    console.log("");

    messages.push({
      role: "assistant",
      content: message.content,
    });
  }
}