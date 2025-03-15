from fastapi import FastAPI, Query
from pydantic import BaseModel
from apify_client import ApifyClient
from textblob import TextBlob
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from googletrans import Translator
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import emoji
import os

# Load environment variables
load_dotenv()

# Initialize API client and tools
API_TOKEN = os.getenv("API_TOKEN")
client = ApifyClient(API_TOKEN)
analyzer = SentimentIntensityAnalyzer()
translator = Translator()

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change "*" to ["http://localhost:5173"] for better security
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

class SentimentResponse(BaseModel):
    post_caption: str
    comments: list

def extract_emojis(text):
    """Extracts emojis from the text."""
    return [char for char in text if char in emoji.EMOJI_DATA]

def analyze_emojis(text):
    """Analyzes emoji sentiment."""
    emojis = extract_emojis(text)
    if not emojis:
        return 0
    sentiment_scores = [analyzer.polarity_scores(e)['compound'] for e in emojis]
    return sum(sentiment_scores) / len(sentiment_scores)

def analyze_sentiment(text):
    """Performs sentiment analysis on Hinglish text with emojis."""
    try:
        translated = translator.translate(text, src='auto', dest='en')
        translated_text = translated.text if translated and translated.text else text
    except Exception:
        translated_text = text  # Use original text if translation fails

    text_sentiment = TextBlob(translated_text).sentiment.polarity
    emoji_sentiment = analyze_emojis(text)

    overall_sentiment = (0.7 * text_sentiment) + (0.3 * emoji_sentiment)
    sentiment_label = "Positive" if overall_sentiment > 0 else "Negative" if overall_sentiment < 0 else "Neutral"

    return {
        "comment": text,
        "translated": translated_text,
        "sentiment": sentiment_label,
        "score": overall_sentiment
    }

@app.get("/analyze", response_model=SentimentResponse)
def analyze_instagram_post(post_url: str = Query(..., title="Instagram Post URL")):
    """Fetch and analyze comments from an Instagram post."""
    run_input = {
        "directUrls": [post_url],
        "resultsType": "posts",
        "resultsLimit": 1,
        "addParentData": False,
    }

    run = client.actor("shu8hvrXbJbY3Eb9W").call(run_input=run_input)

    # Fetch post data
    for item in client.dataset(run["defaultDatasetId"]).iterate_items():
        post_caption = item.get("caption", "No caption available")
        comments_data = item.get("latestComments", [])[:5]

        if not comments_data:
            return {"post_caption": post_caption, "comments": []}

        analyzed_comments = [analyze_sentiment(comment_obj.get("text", "")) for comment_obj in comments_data]

        return {"post_caption": post_caption, "comments": analyzed_comments}

    return {"post_caption": "No data found", "comments": []}
