const { openai } = require('../utils/openaiClient');
const axios = require('axios');

async function fetchWalletData(walletAddress) {
    try {
        const response = await axios.get(`https://api.solscan.io/account?address=${walletAddress}`);
        if (response.data && response.data.data) {
            return response.data.data;
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Error fetching data for wallet ${walletAddress}:`, error.message);
        return null;
    }
}

async function analyzeWallets(walletAddresses) {
    const walletDetails = [];

    for (const wallet of walletAddresses) {
        const walletData = await fetchWalletData(wallet);
        if (walletData) {
            walletDetails.push({
                wallet,
                transactions: walletData.transactionCount || 0,
                tokens: walletData.tokenInfo || [],
                createdAt: walletData.createdTime || 'Unknown',
            });
        } else {
            walletDetails.push({
                wallet,
                error: 'Unable to fetch data',
            });
        }
    }

    const prompt = `You are an expert blockchain analyst. Based on the following wallet data, determine if these wallets are likely associated with rug pull activities. Use details such as transaction patterns, token holdings, and creation times to make your assessment:

${JSON.stringify(walletDetails, null, 2)}

Provide your response with reasoning.`;

    try {
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt,
            max_tokens: 300,
            temperature: 0.7,
        });

        const analysis = response.data.choices[0].text.trim();
        return { walletDetails, analysis };
    } catch (error) {
        console.error('Error analyzing wallet data with OpenAI:', error.message);
        return { walletDetails, analysis: 'Error generating analysis' };
    }
}

module.exports = analyzeWallets;
