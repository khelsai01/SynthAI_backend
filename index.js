const express = require("express");
const cors = require("cors")
const {connection} = require("./db")
const openAi = require("openai");
const { interviewRouter } = require("./routes/interviewRouter");
const { historyRouter } = require("./routes/historyRouter");
require('dotenv').config();

const app = express();


app.use(cors())
app.use(express.json());

app.use("/interview", interviewRouter);
app.use("/history", historyRouter);

const openai = new openAi({
    apiKey: process.env.OPEN_AI_KEY
});

app.post("/openai", async (req, res) => {

    try {
      const prompt = req.body.content;

        let response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: req.body,
            max_tokens: 1000
        });
      response= await response.json()

        res.status(200).send({role:"assistant",content:response.choices[0].message.content});
    } catch (error) {
        res.status(400).send({"error from catch":error});
    }
});
app.listen(8080, async () => {
    try {
        await connection;
        console.log("Server Is Running At PORT 8000")
    } catch (error) {
        console.log(error);
    }
});
