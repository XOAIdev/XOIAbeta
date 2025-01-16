const checkSupply = require('./features/checkSupply')
const checkWalletDistribution = require('./features/checkWalletDistribution')
const checkWebsite = require('./features/checkWebsite')
const checkReverseImage = require('./features/checkReverseImage')
const checkFreshWallets = require('./features/checkFreshWallets')
const checkTwitter = require('./features/checkTwitter')

async function runAnalysis() {
    const supplyResult = await checkSupply({ supply: 10000 })
    const walletDistributionResult = await checkWalletDistribution({ holders: ['0x123', '0x456'] })
    const websiteResult = await checkWebsite({ url: 'https://v0.dev' })
    const reverseImageResult = await checkReverseImage({ images: ['ipfs://image1'] })
    const freshWalletsResult = await checkFreshWallets({ addresses: ['0x789'] })
    const twitterResult = await checkTwitter({ handle: 'someProject' })
    console.log('Supply Analysis:', supplyResult)
    console.log('Wallet Distribution Analysis:', walletDistributionResult)
    console.log('Website Analysis:', websiteResult)
    console.log('Reverse Image Analysis:', reverseImageResult)
    console.log('Fresh Wallets Analysis:', freshWalletsResult)
    console.log('Twitter Analysis:', twitterResult)
}

runAnalysis()
