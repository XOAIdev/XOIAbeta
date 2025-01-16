const { openai } = require('../utils/openaiClient');
const axios = require('axios');

async function analyzeWebsite(data) {
    try {
        const response = await axios.get(data.url);
        const siteContent = response.data.slice(0, 5000);

        const prompt = `You are a cybersecurity expert. Analyze the following website content to determine if it is suspicious. Look for signs such as template-based designs (e.g., v0.dev), reused content, or indicators of phishing attempts. Provide a reasoned assessment based on the content:

Website Content:
${siteContent}

Provide your detailed analysis below.`;

        const aiResponse = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt,
            max_tokens: 300,
            temperature: 0.7,
        });

        const analysis = aiResponse.data.choices[0].text.trim();
        return { siteContent, analysis };
    } catch (error) {
        console.error('Error fetching website content:', error.message);
        return { error: 'Error fetching website content' };
    }
}

async function reverseSearchImages(imageUrls) {
    const results = [];

    for (const imageUrl of imageUrls) {
        try {
            const searchResponse = await axios.get(`https://images.google.com/searchbyimage?image_url=${encodeURIComponent(imageUrl)}`);
            results.push({
                imageUrl,
                searchResult: searchResponse.data || 'No relevant data found',
            });
        } catch (error) {
            console.error(`Error performing reverse image search for ${imageUrl}:`, error.message);
            results.push({
                imageUrl,
                error: 'Error during reverse search',
            });
        }
    }

    return results;
}

async function analyzeWebsiteWithImages(data) {
    const { url, images } = data;
    const websiteAnalysis = await analyzeWebsite({ url });
    const imageAnalysis = await reverseSearchImages(images);

    return {
        websiteAnalysis,
        imageAnalysis,
    };
}

module.exports = analyzeWebsiteWithImages;
