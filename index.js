const express = require('express');
const cors = require('cors')

// Express Setup
const app = express();
app.use(express.json());
app.use(cors()) // allow CORS for all origins
const port = 3000

require("dotenv").config();
const { GROQ_API_KEY } = process.env;

// GROQ Setup
const Groq = require("groq-sdk");
const groq = new Groq({
    apiKey: GROQ_API_KEY
});


async function chatWithGroq(userMessage, latestReply, messageHistory) {
    let messages = [{
        role: "user",
        content: userMessage
    }]

    if(messageHistory != '') {
        messages.unshift({
            role: "system",
            content: `Our conversation's summary so far: """${messageHistory}""". 
                     And this is the latest reply from you """${latestReply}"""`
        })
    }

    console.log('original message', messages)

    const chatCompletion = await groq.chat.completions.create({
        messages,
        model: "llama3-8b-8192"
    });

    const respond = chatCompletion.choices[0]?.message?.content || ""
    return respond
}

async function summarizeConversation(message, reply, messageSummary) {
    let content = `Summarize this conversation 
                    user: """${message}""",
                    you(AI): """${reply}"""
                  `

    // For N+1 message
    if(messageSummary != '') {
        content = `Summarize this conversation: """${messageSummary}"""
                    and last conversation: 
                    user: """${message}""",
                    you(AI): """${reply}"""
                `
    }

    const chatCompletion = await groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: content
            }
        ],
        model: "llama3-8b-8192"
    });

    const summary = chatCompletion.choices[0]?.message?.content || ""
    console.log('summary: ', summary)
    return summary
}

// app.get('/', async(req, res) => {
//   await chatWithGroq()
//   res.send('Hello World!')
// })

app.post('/chat', async (req, res) => {
    const { message, latestReply, messageSummary } = req.body;

    console.log('message from client: ', message)

    // request chat completion
    const reply = await chatWithGroq(message, latestReply, messageSummary)
    
    // request chat summary
    const summary = await summarizeConversation(message, reply, messageSummary)
    
    // Always return chat history/summary
    res.send({
        reply,
        summary
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})