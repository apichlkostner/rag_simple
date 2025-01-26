from langchain_community.document_loaders import TextLoader
from langchain_community.embeddings import HuggingFaceBgeEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_text_splitters import CharacterTextSplitter
from ollama import generate
import chromadb
import numpy as np
import os

# Embeddings
model_name = "intfloat/e5-base-v2"
#model_name = "nomic-ai/nomic-embed-text-v1.5"
#model_name = "BAAI/bge-large-en-v1.5"

model_kwargs = {'device': 'cuda'}
encode_kwargs = {'normalize_embeddings': True}

model = HuggingFaceBgeEmbeddings(
    model_name=model_name,
    model_kwargs=model_kwargs,
    encode_kwargs=encode_kwargs
)

# Create or load Chroma DB
create_new_db = not os.path.exists("data")
if create_new_db:
    print("Init loader")
    loader = TextLoader("docs/goethe_faust_en.txt")
    print("load and split document")
    text_splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=250)
    docs = loader.load_and_split(text_splitter)


    chroma_db = Chroma.from_documents(
        documents=docs,
        embedding=model,
        persist_directory="data",
        collection_name="goethe"
    )
else:
    chroma_db = Chroma(
    persist_directory="data",
    embedding_function=model,
    collection_name="goethe"
    )


print("-------------------- QUERY ------------------")
query = "What is the poodles real core?"
k = 3
results = chroma_db.similarity_search_with_relevance_scores(query, k=k)

if len(results) != k:
    print("No all results found")
    exit()

doc1 = results[0][0].page_content
doc2 = results[1][0].page_content
doc3 = results[2][0].page_content

# create prompt
prompt = "Question: " + query + "\n\n"
prompt += "Context: " + doc1 + "\n\n" + doc2 + "\n\n" + doc3 + "\n\n"
prompt += "Instructions: Please answer the question based on the provided context. If the context doesn't contain enough information to answer the question, please state that you don't have sufficient information to provide an accurate response.\n"

print("Prompt: ", prompt)

model_name = "llama3.1:8b"
#model_name = "deepseek-r1:8b"

result = generate(model=model_name, prompt=prompt)

print("Result: " + result['response'])
