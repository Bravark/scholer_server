import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});


const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Server is online and ready to rumble zach',

  }) 
});

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      //prompt:`${prompt}`
      prompt: `Generate 10 different multiple choice questions with options a to d  mark out the answer from the text + ${prompt} put questions and answers in this format "question 1: "What is the capital of America?",answers: [{ id: 0 | text: "New York City" | isCorrect: false },{ id: 1 | text: "Boston" | isCorrect: false },{ id: 2 | text: "Santa Fe" | isCorrect: false },{ id: 3 | text: "Washington DC" | isCorrect: true },] question 2: "What year was the Constitution of America written?",options: [{ id: 0 | text: "1787" | isCorrect: true },{ id: 1 | text: | "1776" | isCorrect: false },{ id: 2 | text: "1774" | isCorrect: | false },{ id: 3 | text: "1826" | isCorrect: false },]"`
      ,
      temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 3500, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });

    res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))