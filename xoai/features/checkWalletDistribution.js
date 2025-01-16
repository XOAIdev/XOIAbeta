const { openai } = require('../utils/openaiClient');
const axios = require('axios');

async function analyzeWalletDistribution(data) {
    const walletAnalysis = [];

    for (const wallet of data.wallets) {
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

    const prompt = `You are a blockchain expert. Based on the following wallet distribution data, determine if there are any suspicious patterns such as high concentration of tokens in specific wallets, recent wallet creation, or abnormal transaction activity. Provide a detailed analysis of risks and potential red flags:

Wallet Distribution Data:
${JSON.stringify(walletAnalysis, null, 2)}

Provide your conclusion below.`;

    try {
        const aiResponse = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt,
            max_tokens: 300,
            temperature: 0.7,
        });

        const analysis = aiResponse.data.choices[0].text.trim();
        return { walletAnalysis, analysis };
    } catch (error) {
        console.error('Error generating analysis with OpenAI:', error.message);
        return { walletAnalysis, analysis: 'Error generating analysis' };
    }
}

module.exports = analyzeWalletDistribution;
