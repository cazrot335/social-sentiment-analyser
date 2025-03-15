from apify_client import ApifyClient
from textblob import TextBlob
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from googletrans import Translator
from dotenv import load_dotenv
import emoji
import os

# Load environment variables from .env file
load_dotenv()

# Initialize the ApifyClient with API token
API_TOKEN = os.getenv("API_TOKEN")
client = ApifyClient(API_TOKEN)

# Prepare the Actor input
POST_URL = "https://www.instagram.com/p/DG8UtFVTxON/"  # Replace with actual post URL
run_input = {
    "directUrls": [POST_URL],
    "resultsType": "posts",
    "resultsLimit": 1,
    "addParentData": False,
}

# Run the Apify Actor
run = client.actor("shu8hvrXbJbY3Eb9W").call(run_input=run_input)

# Initialize Sentiment Analyzer and Translator
analyzer = SentimentIntensityAnalyzer()
translator = Translator()

def extract_emojis(text):
    """Extracts emojis from the text."""
    return [char for char in text if char in emoji.EMOJI_DATA]

def analyze_emojis(text):
    """Analyzes emoji sentiment."""
    emojis = extract_emojis(text)
    if not emojis:
        return 0  # No emojis, return neutral sentiment
    sentiment_scores = [analyzer.polarity_scores(e)['compound'] for e in emojis]
    return sum(sentiment_scores) / len(sentiment_scores)

def analyze_sentiment(text):
    """Performs sentiment analysis on Hinglish text with emojis."""
    try:
        translated = translator.translate(text, src='auto', dest='en')
        translated_text = translated.text if translated and translated.text else text
    except Exception as e:
        print(f"⚠️ Translation Error: {e}")
        translated_text = text  # Use original text if translation fails

    text_sentiment = TextBlob(translated_text).sentiment.polarity
    emoji_sentiment = analyze_emojis(text)

    # Weighted combination (text more important than emojis)
    overall_sentiment = (0.7 * text_sentiment) + (0.3 * emoji_sentiment)
    sentiment_label = "Positive" if overall_sentiment > 0 else "Negative" if overall_sentiment < 0 else "Neutral"

    return {
        "comment": text,
        "translated": translated_text,
        "sentiment": sentiment_label,
        "score": overall_sentiment
    }

# Fetch post data
for item in client.dataset(run["defaultDatasetId"]).iterate_items():
    post_caption = item.get("caption", "No caption available")  # Extract post caption
    comments_data = item.get("latestComments", [])[:5]  # Get top 5 comments

    if not comments_data:
        print("\n❌ No comments found on this post.")
        continue

    # Perform sentiment analysis on comments
    analyzed_comments = [analyze_sentiment(comment_obj.get("text", "")) for comment_obj in comments_data]

    # Print the results
    print("\n📌 Post Caption:\n", post_caption)
    print("\n💬 Top 5 Comments with Sentiment Analysis:")
    for i, comment_data in enumerate(analyzed_comments, 1):
        print(f"{i}. {comment_data['comment']} (Translated: {comment_data['translated']})")
        print(f"   ➝ Sentiment: {comment_data['sentiment']} (Score: {comment_data['score']:.2f})\n")
