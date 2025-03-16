# Instagram Sentiment Analysis

A web application for analyzing the sentiment of comments on Instagram posts. The system uses machine learning and natural language processing to determine if comments are positive, neutral, or negative.
<img width="791" align='left' alt="image" src="https://github.com/user-attachments/assets/d1cb3f86-eff4-4be3-883a-267deadf876c" />



## Project Overview

This project consists of two main components:

1. **Backend API**: A FastAPI service that scrapes Instagram posts, analyzes comment sentiment, and returns structured data.
2. **Frontend UI**: A React application that provides an intuitive interface for analyzing Instagram posts and visualizing the sentiment data.

The application supports:
- Analysis of comments in multiple languages (auto-translation)
- Emoji sentiment analysis
- Visualization of sentiment distribution
- Detailed view of individual comments and their sentiment scores

## Tech Stack

### Backend
- FastAPI - Fast, modern Python web framework
- Apify - For Instagram data scraping
- TextBlob - For text sentiment analysis
- VADER - For additional sentiment analysis capabilities
- Google Translate - For translating non-English comments
- emoji - For emoji extraction and analysis

### Frontend
- React - UI library
- Recharts - For data visualization
- Axios - For API requests
- Tailwind CSS - For styling

## Setup Instructions

### Prerequisites
- Python 3.8+ 
- Node.js 16+
- npm or yarn
- Apify API token

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/instagram-sentiment-analysis.git
cd instagram-sentiment-analysis
```

2. Set up a Python virtual environment:
```bash
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

3. Install backend dependencies:
```bash
pip install fastapi uvicorn apify-client textblob vaderSentiment googletrans==4.0.0-rc1 python-dotenv emoji
```

4. Create a `.env` file in the project root:
```
API_TOKEN=your_apify_api_token_here
```
You can get an Apify API token by signing up at [Apify](https://apify.com/).

5. Install NLTK data for TextBlob:
```bash
python -c "import nltk; nltk.download('punkt'); nltk.download('averaged_perceptron_tagger')"
```

6. Start the backend server:
```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://127.0.0.1:8000`.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install frontend dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The frontend will be available at `http://localhost:5173`.

## API Endpoints

### GET `/analyze`

Analyzes an Instagram post's comments for sentiment.

**Parameters:**
- `post_url` (string, required): URL of the Instagram post to analyze

**Response:**
```json
{
  "post_caption": "This is the Instagram post caption",
  "comments": [
    {
      "comment": "Original comment text",
      "translated": "Translated comment (if applicable)",
      "sentiment": "Positive | Neutral | Negative",
      "score": 0.75
    }
  ]
}
```

## Usage

1. Open the application in your browser
2. Enter an Instagram post URL in the input field
3. Click "Analyze Sentiment"
4. View the sentiment analysis results in the dashboard

## Known Limitations

- The free tier of Apify allows a limited number of requests per month
- Instagram may rate-limit requests if too many are made in a short period
- Translation services may have limitations for certain languages
- The sentiment analysis is based on machine learning models and may not always accurately capture context, sarcasm, or cultural nuances

## Troubleshooting

**Backend not starting:**
- Ensure all required dependencies are installed
- Check that your Apify API token is valid and properly set in the .env file
- Make sure no other application is using port 8000

**Frontend not connecting to backend:**
- Verify the backend is running
- Check that CORS is properly configured
- Ensure the API URL in the frontend code matches your backend URL

**No data returned:**
- Ensure the Instagram post URL is valid and publicly accessible
- Check that the post has comments
- Verify your Apify quota hasn't been exceeded

## License

[MIT License](LICENSE)
