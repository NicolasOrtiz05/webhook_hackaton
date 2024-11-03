require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const twilio = require('twilio');

const app = express();
const port = 3000;

const apiKey = process.env.AZURE_OPENAI_API_KEY;
const endpoint = 'https://nicol-m316xs8v-australiaeast.openai.azure.com/openai/deployments/gpt-4-32k/chat/completions?api-version=2024-08-01-preview';

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(twilioAccountSid, twilioAuthToken);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const chatHistory = {};

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function getOpenAIResponse(phoneNumber, prompt) {
	const messages = chatHistory[phoneNumber] || [];

	messages.push({ role: 'user', content: prompt });

	let response;
	let retryCount = 0;
	const maxRetries = 5;

	while (retryCount < maxRetries) {
		try {
			response = await axios.post(
				endpoint,
				{
					messages: messages,
					max_tokens: 200,
				},
				{
					headers: {
						'Content-Type': 'application/json',
						'api-key': apiKey,
					},
				}
			);

			const reply = response.data.choices[0].message.content.trim();

			messages.push({ role: 'assistant', content: reply });

			chatHistory[phoneNumber] = messages;

			return reply;
		} catch (error) {
			if (error.response && error.response.status === 429) {
				const retryAfter = parseInt(error.response.headers['retry-after'], 10) * 1000 || 2000;
				console.warn(`Rate limit exceeded. Retrying after ${retryAfter} ms...`);
				await sleep(retryAfter);
				retryCount++;
			} else {
				console.error('Error al obtener la respuesta de OpenAI:', error);
				throw new Error('Error al obtener la respuesta de OpenAI');
			}
		}
	}

	throw new Error('Max retries exceeded');
}

app.post('/webhook', async (req, res) => {
	const message = req.body.Body;
	const from = req.body.From;

	try {
		const reply = await getOpenAIResponse(from, message);

		await client.messages.create({
			body: reply,
			from: 'whatsapp:+14155238886',
			to: from,
		});

		res.send('<Response></Response>');
	} catch (error) {
		console.error('Error al procesar el mensaje de Twilio:', error);
		res.status(500).send('Error en el procesamiento');
	}
});

app.post('/process-message', async (req, res) => {
	const { message, phoneNumber } = req.body;

	try {
		const reply = await getOpenAIResponse(phoneNumber, message);

		await client.messages.create({
			body: reply,
			from: 'whatsapp:+14155238886',
			to: phoneNumber,
		});

		res.status(200).send({ status: 'Message sent successfully', reply });
	} catch (error) {
		console.error('Error al procesar el mensaje externo:', error);
		res.status(500).send('Error en el procesamiento');
	}
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});