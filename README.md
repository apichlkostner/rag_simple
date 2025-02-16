# RAG

## Simple RAG using local models

This RAG creates a vector database from Goethes Faust (english) and asks the question "What is the poodles real core?".

Needs a folder docs with Goethes Faust as goethe_faust_en.txt (e.g. https://www.gutenberg.org/ebooks/14591.txt.utf-8)

CUDA should be available on the machine.

To create the database again, just delete the data folder.

## Simple RAG using Mistral API

This RAG creates a vector database with english texts and saves it in an online database. The embeddings and generations are done using the Mistral API.
Based on the course "Intro to Mistral AI" from scrimba.com, but using the current API from Mistral.

### RAS literature

split_and_embed.js Splits the document, creates embeddings using the Mistral API and stores them in a Supabase database.
ras_query.js Searches in the vector database for the query matching documents and sends the query witht the documents to the Mistral chat

agent.js Create some simple tools that can be called by the Mistral chat to answer questions. Use them with the Mistral API to answer a sample question.
toosl.js The simple tools

The sleep parts are here to use the free Mistral API which don't allows too many repeated calls.
