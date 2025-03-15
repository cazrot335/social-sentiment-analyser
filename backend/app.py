# filepath: c:\Users\91876\Desktop\social-sentiment-analyser\backend\app.py
from apify_client import ApifyClient
from textblob import TextBlob
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Initialize the ApifyClient with your API token
API_TOKEN = os.getenv("API_TOKEN")
client = ApifyClient(API_TOKEN)

# Prepare the Actor input
run_input = {
    "directUrls": ["https://www.instagram.com/p/DHMCzsWTo_m/"],  # Replace with your post URL
    "resultsType": "posts",
    "resultsLimit": 1,
    "addParentData": False,
}

# Run the Apify Actor
run = client.actor("shu8hvrXbJbY3Eb9W").call(run_input=run_input)

# Fetch post data
for item in client.dataset(run["defaultDatasetId"]).iterate_items():
    post_caption = item.get("caption", "No caption available")  # Extract post caption
    comments = item.get("comments", [])[:5]  # Get top 5 comments

    # Ensure comments are present
    if not comments:
        print("\n❌ No comments found on this post.")
        continue

    # Perform sentiment analysis on comments
    analyzed_comments = []
    for comment in comments:
        sentiment_score = TextBlob(comment).sentiment.polarity
        sentiment_label = "Positive" if sentiment_score > 0 else "Negative" if sentiment_score < 0 else "Neutral"
        analyzed_comments.append({"comment": comment, "sentiment": sentiment_label, "score": sentiment_score})

    # Print the results
    print("\n📌 Post Caption:\n", post_caption)
    print("\n💬 Top 5 Comments with Sentiment Analysis:")
    for i, comment_data in enumerate(analyzed_comments, 1):
        print(f"{i}. {comment_data['comment']} - Sentiment: {comment_data['sentiment']} (Score: {comment_data['score']:.2f})")