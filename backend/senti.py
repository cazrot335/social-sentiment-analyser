from textblob import TextBlob
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from googletrans import Translator
import emoji

# Initialize sentiment analyzer and translator
analyzer = SentimentIntensityAnalyzer()
translator = Translator()

def extract_emojis(text):
    """Extracts emojis from the text."""
    return [char for char in text if char in emoji.EMOJI_DATA]

def analyze_emojis(text):
    """Analyzes emoji sentiment."""
    emojis = extract_emojis(text)
    sentiment_scores = [analyzer.polarity_scores(e)['compound'] for e in emojis]
    return sum(sentiment_scores) / len(sentiment_scores) if sentiment_scores else 0

def analyze_sentiment(text):
    """Performs Hinglish + Emoji sentiment analysis."""
    try:
        translated = translator.translate(text, src='auto', dest='en')
        translated_text = translated.text if translated and translated.text else text  # Fallback to original text
    except Exception as e:
        print(f"⚠️ Translation Error: {e}")
        translated_text = text  # Use original text if translation fails

    text_sentiment = TextBlob(translated_text).sentiment.polarity
    emoji_sentiment = analyze_emojis(text)
    
    overall_sentiment = text_sentiment + emoji_sentiment
    sentiment_label = "Positive" if overall_sentiment > 0 else "Negative" if overall_sentiment < 0 else "Neutral"

    return {
        "original_text": text,
        "translated_text": translated_text,
        "sentiment": sentiment_label,
        "score": overall_sentiment
    }

# Test Cases
test_comments = [
    "Bhai mast laga movie 🤩🔥",
    "Ye kya bakwaas tha 😡",
    "Mood kharab ho gaya 😞",
    "Superb bro, kya bat hai! 👏",
    "Acha nahi laga mujhe 😐",
]

# Run the analysis
for comment in test_comments:
    result = analyze_sentiment(comment)
    print(f"\n💬 Original: {result['original_text']}")
    print(f"   🔄 Translated: {result['translated_text']}")
    print(f"   📊 Sentiment: {result['sentiment']} (Score: {result['score']:.2f})")
