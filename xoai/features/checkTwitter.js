const { openai } = require('../utils/openaiClient');
const axios = require('axios');

async function analyzeTwitterData(data) {
    try {
        const url = `https://api.twitter.com/2/users/by/username/${data.handle}`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
            }
        });

        const twitterData = response.data;
        if (!twitterData || !twitterData.data) {
            return 'No data available for the provided Twitter handle.';
        }

        const user = twitterData.data;
        const prompt = `You are a social media analysis expert. Based on the following Twitter account data, determine if the account shows signs of being involved in suspicious or fraudulent activities. Consider metrics such as followers, creation date, and activity patterns:

Twitter Data:
${JSON.stringify(user, null, 2)}

Provide a detailed conclusion and highlight any potential risks.`;

        const aiResponse = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt,
            max_tokens: 300,
            temperature: 0.7,
        });

        const analysis = aiResponse.data.choices[0].text.trim();
        return { user, analysis };
    } catch (error) {
        console.error('Error fetching or analyzing Twitter data:', error.message);
        return { error: 'Error fetching or analyzing Twitter data.' };
    }
}

module.exports = analyzeTwitterData;