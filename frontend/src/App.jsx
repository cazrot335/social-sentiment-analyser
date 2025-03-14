import { useState } from "react";
import axios from "axios";

function App() {
  const [url, setUrl] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!url) return alert("Enter an Instagram Post URL");

    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:5000/analyze", { url });
      setResults(response.data);
    } catch (error) {
      alert("Error analyzing sentiment!");
    }
    setLoading(false);
  };

  return (
    <div className="app">
      <h1>Instagram Sentiment Analyzer</h1>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter Instagram Post URL"
      />
      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      <div className="results">
        {results.map((item, index) => (
          <p key={index}>
            <strong>{item.sentiment}</strong>: {item.comment}
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;
