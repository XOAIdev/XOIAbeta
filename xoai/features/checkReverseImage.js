const { openai } = require('../utils/openaiClient');
const axios = require('axios');

async function reverseImageSearch(imageUrls) {
    const results = [];

    for (const imageUrl of imageUrls) {
        try {
            const searchResponse = await axios.get(`https://images.google.com/searchbyimage?image_url=${encodeURIComponent(imageUrl)}`);
            results.push({
                imageUrl,
                searchResult: searchResponse.data || 'No relevant data found',
            });
        } catch (error) {
            console.error(`Error fetching reverse search data for image ${imageUrl}:`, error.message);
            results.push({
                imageUrl,
                error: 'Error during reverse search',
            });
        }
    }

    const prompt = `You are a highly skilled AI trained in analyzing reverse image search data. Based on the following search results, determine if these images are suspicious or associated with fraudulent activities. Provide a reasoned assessment for each:

${JSON.stringify(results, null, 2)}

Provide your detailed analysis below.`;

    try {
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt,
            max_tokens: 300,
            temperature: 0.7,
        });

        const analysis = response.data.choices[0].text.trim();
        return { results, analysis };
    } catch (error) {
        console.error('Error generating analysis with OpenAI:', error.message);
        return { results, analysis: 'Error generating analysis' };
    }
}

module.exports = reverseImageSearch;
