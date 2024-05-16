# About
Create an AI assistant with Groq AI without database.

Blog post (Step-by-step tutorial): [Create a super fast AI assistant with Groq (Without a database)](https://serpapi.com/blog/create-super-fast-ai-assistant-with-groq)

## Run
`nodemon index.js` or `node index.js`

## Chat sample:
```
{
  "message": "Hi, my name is Hilman, I live in Makassar, Indonesia",
  "latestReply": "", //start adding on N+1 conversation
  "messageSummary": ""
}
```

Flow:
- always take the `summary response` and put it as `messageHistory`
- pass `reply` to `latestReply`