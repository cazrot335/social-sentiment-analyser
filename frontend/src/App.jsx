import React, { useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const COLORS = ["#0088FE", "#FFBB28", "#FF4444"];

export default function App() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSentimentData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/analyze?post_url=${encodeURIComponent(url)}`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching sentiment data:", error);
    }
    setLoading(false);
  };

  const sentimentCounts = data
    ? data.comments.reduce(
        (acc, comment) => {
          acc[comment.sentiment]++;
          return acc;
        },
        { Positive: 0, Neutral: 0, Negative: 0 }
      )
    : { Positive: 0, Neutral: 0, Negative: 0 };

  const pieData = Object.keys(sentimentCounts).map((key) => ({ name: key, value: sentimentCounts[key] }));

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Instagram Sentiment Analysis</h2>
      <input
        type="text"
        placeholder="Enter Instagram Post URL"
        className="w-full p-2 border rounded"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded" onClick={fetchSentimentData}>
        Analyze
      </button>

      {loading && <p className="mt-3">Analyzing...</p>}

      {data && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Post Caption:</h3>
          <p className="mb-4">{data.post_caption}</p>

          <h3 className="text-lg font-semibold">Sentiment Analysis:</h3>
          <PieChart width={300} height={250}>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
              {pieData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>

          <h3 className="text-lg font-semibold mt-6">Comment Sentiments:</h3>
          <BarChart width={400} height={250} data={data.comments}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="comment" hide />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="score" fill="#82ca9d" />
          </BarChart>
        </div>
      )}
    </div>
  );
}
