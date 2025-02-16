
import { Mistral } from "@mistralai/mistralai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { promises as fs } from 'fs';
import { validateHeaderName } from "http";
import { createClient } from '@supabase/supabase-js'
import { isContext } from "vm";
import { waitForDebugger } from "inspector";


const mistral = new Mistral({
  apiKey: process.env["MISTRAL_API_KEY"] ?? "",
});

const supabaseUrl = process.env["SUPABASE_URL"] ?? "";
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const input = "Who is George?"
const embedding = await createEmbedding(input);
const context = await retrieveMatches(embedding);
await sleep(2000);
const response = await generateChatResponse(context, input);
console.log(response);
console.log("Response: " + response.choices[0].message.content)

async function createEmbedding(content) {
  const result = await mistral.embeddings.create({
    inputs: [content],
    model: "mistral-embed",
  });

  return result.data[0].embedding;
}

async function retrieveMatches(embedding) {
  const { data } = await supabase.rpc('match_handbook_docs', {
      query_embedding: embedding,
      match_threshold: 0.78,
      match_count: 5
  });
  return data
}

async function generateChatResponse(context, query) {
  const data = context.map(data => data.content).join("\n")
  const prompt = "Context:\n" + data + "\nQuestion: " + query;
  const result = await mistral.chat.complete({
    model: "mistral-small-latest",
    stream: false,
    temperature: 0.7,
    messages: [
      {
        role: "system", content: "You are an expert for english literature. You will answer the question of the user with only the information that you get in the context. If you can't answer the question with the information of the context, answer that you don't know"
      },
      {
        content: prompt,
        role: "user"
      }
    ]});
  return result;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
