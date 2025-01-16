const { Configuration, OpenAIApi } = require('openai');
const axios = require('axios');
const { openaiApiKey } = require('../config');

if (!openaiApiKey) {
    throw new Error('OpenAI API key is missing. Please ensure it is set in the configuration.');
}

const configuration = new Configuration({
    apiKey: openaiApiKey,
});

const openai = new OpenAIApi(configuration);

async function generateOpenAICompletion(prompt, options = {}) {
    const defaultOptions = {
        model: 'text-davinci-003',
        max_tokens: 300,
        temperature: 0.7,
        ...options,
    };

    try {
        const response = await openai.createCompletion({
            prompt,
            ...defaultOptions,
        });

        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('Error with OpenAI API request:', error.message);
        throw new Error('Failed to generate completion from OpenAI API.');
    }
}

module.exports = { openai, generateOpenAICompletion };
