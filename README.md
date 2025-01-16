# XOai Rug Detector

XOai is an AI-powered application designed to evaluate various on-chain and off-chain indicators for identifying potential rugs. This project integrates intelligent agents, allowing users to inspect token supply, wallet distribution, website data, reverse image content, fresh wallet activity, and Twitter insights.

https://xoai-1.gitbook.io/xoai

## Overview

- **Supply Scrutiny:** Investigates token supply data to detect bundling or mint anomalies.
- **Wallet Distribution:** Examines holder addresses to identify suspicious concentration or transfers.
- **Website Analysis:** Fetches and inspects site content for red flags and risky elements.
- **Reverse Image Checks:** Uses AI to investigate whether images are reused or suspiciously sourced.
- **Fresh Wallet Detection:** Flags newly created wallets that interact with the project.
- **Twitter Insights:** Provides a foundation for social media analysis, highlighting potential warning signs.

## AI Agent Tutorial

### Prerequisites

1. **Node.js** (v16 or later)  
2. **npm**  
3. **OpenAI API Key**  
4. **Internet Connection** (the application fetches data from external APIs)

### Installation

1. **Clone the Repository**  
``` 
bash
git clone https://github.com/your-username/xoai-rug-detector.git
cd xoai-rug-detector 
```

2. **Install Dependencies **
``` 
npm install
``` 

3. **Set Environment Variables**

Create a .env file in the project root and include:
```
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
```

4. **Run the Application**
```
npm start
```
