const { openai } = require('../utils/openaiClient');
const axios = require('axios');

async function analyzeSupplyData(supplyData) {
    const walletAnalysis = [];

    for (const wallet of supplyData.wallets) {
        try {
            const walletResponse = await axios.get(`https://api.solscan.io/account?address=${wallet}`);
            const walletData = walletResponse.data.data;

            if (walletData) {
                walletAnalysis.push({
                    wallet,
                    balance: walletData.lamports || 0,
                    tokenHoldings: walletData.tokenInfo || [],
                    transactionCount: walletData.transactionCount || 0,
                    createdAt: walletData.createdTime || 'Unknown',
                });
            } else {
                walletAnalysis.push({
                    wallet,
                    error: 'No data available from Solscan',
                });
            }
        } catch (error) {
            console.error(`Error fetching wallet data for ${wallet}:`, error.message);
            walletAnalysis.push({
                wallet,
                error: 'Error fetching data',
            });
        }
    }

    const prompt = `You are a blockchain expert. Based on the following supply data and wallet analysis, determine if there are any suspicious patterns such as high concentration in specific wallets, recent wallet creation, or low transaction activity. Use the detailed wallet data below to provide a reasoned assessment:

Supply Data:
${JSON.stringify(supplyData, null, 2)}

Wallet Analysis:
${JSON.stringify(walletAnalysis, null, 2)}

Provide a detailed conclusion and highlight any potential risks.`;

    try {
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt,
            max_tokens: 300,
            temperature: 0.7,
        });

        const analysis = response.data.choices[0].text.trim();
        return { supplyData, walletAnalysis, analysis };
    } catch (error) {
        console.error('Error generating analysis with OpenAI:', error.message);
        return { supplyData, walletAnalysis, analysis: 'Error generating analysis' };
    }
}

module.exports = analyzeSupplyData;
