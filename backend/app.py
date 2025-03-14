import instaloader
from textblob import TextBlob

USERNAME = "parth_kamat"  # Your Instagram username

def login_instagram():
    """Logs into Instagram using a saved session."""
    L = instaloader.Instaloader()
    try:
        L.load_session_from_file(USERNAME)  # Load saved session
        print("✅ Logged in using saved session.")
    except FileNotFoundError:
        print("🔴 No session found. Login manually first using:")
        print(f"    instaloader --login {USERNAME}")
        exit()
    return L

def get_instagram_comments(L, shortcode):
    """Fetches comments from an Instagram post."""
    import time

    retries = 3
    for i in range(retries):
        try:
            post = instaloader.Post.from_shortcode(L.context, shortcode)
            comments = [comment.text for comment in post.get_comments()]
            return comments
        except Exception as e:
            print(f"❌ Error: {e}")
            if i < retries - 1:
                print("🔄 Retrying...")
                time.sleep(5)  # Wait for 5 seconds before retrying
            else:
                return []

def analyze_sentiment(comments):
    """Analyzes sentiment of comments using TextBlob."""
    results = []
    for comment in comments:
        sentiment_score = TextBlob(comment).sentiment.polarity
        sentiment = "Positive" if sentiment_score > 0 else "Negative" if sentiment_score < 0 else "Neutral"
        results.append({"comment": comment, "sentiment": sentiment})

    return results

if __name__ == "__main__":
    # Instagram Reel URL
    url = "https://www.instagram.com/p/DHGnSk4S8CAcmDz3_g8w0GnDKLbJhLs6eIkQaY0/"
    shortcode = url.rstrip('/').split('/')[-1]

    print("🔑 Logging in...")
    L = login_instagram()

    print("📥 Fetching comments...")
    comments = get_instagram_comments(L, shortcode)

    if comments:
        print("\n📊 Sentiment Analysis:")
        sentiment_results = analyze_sentiment(comments[:10])  # Analyze first 10 comments
        for result in sentiment_results:
            print(f"Comment: {result['comment']} | Sentiment: {result['sentiment']}")
    else:
        print("❌ No comments found.")
