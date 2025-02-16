import { Mistral } from "@mistralai/mistralai";
import { tools, getPaymentStatus, getPaymentDate } from "./tools.js";
import { setMaxIdleHTTPParsers } from "http";
const mistral = new Mistral(process.env.MISTRAL_API_KEY);

const availableFunctions = { getPaymentStatus, getPaymentDate };

async function agent(query) {
  const messages = [
    { role: "user", content: query }
  ];

  for (let cnt = 0; cnt < 5; cnt++) {
    const response = await mistral.chat.complete({
      model: 'mistral-large-latest',
      messages: messages,
      tools: tools
    });

    messages.push(response.choices[0].message);

    if (response.choices[0].finishReason === "tool_calls") {
      const function_obj = response.choices[0].message.toolCalls[0].function;
      const functionName = function_obj.name;
      const functionArgs = JSON.parse(function_obj.arguments);
      const functionResponse = availableFunctions[functionName](functionArgs);
      const tool_call_id = response.choices[0].message.toolCalls[0].id;
      const message = { role: 'tool', name: functionName, content: functionResponse, toolCallId: tool_call_id};
      messages.push(message)
      //console.log(value);
    } else if (response.choices[0].finishReason === "stop") {
      break;
    }
    await sleep(2000);
  }

  return messages.at(-1);
}

const response = await agent("When was the transaction T1001 paid?");

console.log(response);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
