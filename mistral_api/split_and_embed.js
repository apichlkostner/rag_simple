
import { Mistral } from "@mistralai/mistralai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { promises as fs } from 'fs';
import { validateHeaderName } from "http";
import { createClient } from '@supabase/supabase-js'


async function splitDocument(filename) {
  const text = await fs.readFile(filename, 'utf8');
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 250,
    chunkOverlap: 40,
  });

  const output = await splitter.createDocuments([text]);

  return output.map(Document => Document.pageContent)
}


const mistral = new Mistral({
  apiKey: process.env["MISTRAL_API_KEY"] ?? "",
});

const chunks = await splitDocument("of_mice_and_men.txt");
const embeddings = await createEmbeddings(chunks);

const supabaseUrl = process.env["SUPABASE_URL"] ?? "";
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const result = await supabase.from('handbook_docs').insert(embeddings)

console.log("Result = " + result)
console.log("Upload complete");
