import React, { useState, useEffect } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";

// Updated color scheme for dark theme
const COLORS = ["#10B981", "#6B7280", "#EF4444"];
const HOVER_COLORS = ["#059669", "#4B5563", "#DC2626"];
const BACKGROUND_COLORS = ["rgba(16, 185, 129, 0.2)", "rgba(107, 114, 128, 0.2)", "rgba(239, 68, 68, 0.2)"];

export default function App() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  const fetchSentimentData = async () => {
    if (!url.trim()) {
      setError("Please enter an Instagram post URL");
      return;
    }

    setLoading(true);
    setAnalyzing(true);
    setError(null);
    
    try {
      const response = await axios.get(`http://127.0.0.1:8000/analyze?post_url=${encodeURIComponent(url)}`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching sentiment data:", error);
      setError("Failed to analyze the post. Please check the URL and try again.");
    }
    
    setLoading(false);
    
    // Keep analyzing state for a bit longer to show loading animation
    setTimeout(() => {
      setAnalyzing(false);
    }, 800);
  };

  const handleMouseEnter = (_, index) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
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

  const sentimentEmoji = {
    Positive: "😊",
    Neutral: "😐",
    Negative: "😔"
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-5">
        {/* Sidebar */}
        <div className="lg:col-span-1 bg-gray-800 p-6 min-h-screen">
          <div className="sticky top-6">
            <h1 className="text-2xl font-bold text-white mb-8">Insta<span className="text-purple-400">Mood</span></h1>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="url-input" className="block text-sm font-medium text-gray-300 mb-2">
                  Instagram Post URL
                </label>
                <input
                  id="url-input"
                  type="text"
                  placeholder="https://www.instagram.com/p/..."
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-white placeholder-gray-400"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              
              <button
                className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                onClick={fetchSentimentData}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="animate-spin inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <span>Analyze Sentiment</span>
                )}
              </button>
              
              {error && (
                <div className="p-3 bg-red-900/50 border-l-4 border-red-500 text-red-200 rounded">
                  {error}
                </div>
              )}
              
              {data && (
                <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-300 mb-2">Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Comments:</span>
                      <span className="font-medium">{data.comments.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Positive:</span>
                      <span className="font-medium text-green-400">{sentimentCounts.Positive}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Neutral:</span>
                      <span className="font-medium text-gray-400">{sentimentCounts.Neutral}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Negative:</span>
                      <span className="font-medium text-red-400">{sentimentCounts.Negative}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-4 p-6">
          <h2 className="text-xl font-bold mb-6 text-purple-300">Instagram Sentiment Analysis</h2>
          
          {analyzing && !data && (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-200 border-opacity-20 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-t-purple-500 border-b-transparent border-l-transparent border-r-transparent animate-spin rounded-full absolute top-0 left-0"></div>
              </div>
              <p className="mt-4 text-purple-300 text-lg">Analyzing Instagram comments...</p>
              <p className="text-gray-400 text-sm mt-2">This may take a moment</p>
            </div>
          )}

          {data && (
            <div className="space-y-8 relative">
              {analyzing && (
                <div className="absolute inset-0 bg-gray-900/70 flex items-center justify-center z-10 rounded-lg">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-purple-200 border-opacity-20 rounded-full"></div>
                      <div className="w-16 h-16 border-4 border-t-purple-500 border-b-transparent border-l-transparent border-r-transparent animate-spin rounded-full absolute top-0 left-0"></div>
                    </div>
                    <p className="mt-4 text-purple-300 text-lg">Processing results...</p>
                  </div>
                </div>
              )}
            
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold text-purple-300">Post Caption</h3>
                <p className="mt-2 text-gray-300">{data.post_caption || "No caption available"}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-lg">
                  <h3 className="text-lg font-semibold text-purple-300 mb-4">Sentiment Overview</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          strokeWidth={2}
                          stroke="#1F2937"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                        >
                          {pieData.map((entry, index) => (
                            <Cell 
                              key={entry.name} 
                              fill={activeIndex === index ? HOVER_COLORS[index] : COLORS[index]} 
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, name) => [`${value} comments`, name]} 
                          contentStyle={{ backgroundColor: '#374151', borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', color: '#F3F4F6' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-lg">
                  <h3 className="text-lg font-semibold text-purple-300 mb-4">Comment Sentiment Scores</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.comments.slice(0, 10)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis 
                          dataKey="comment" 
                          hide 
                        />
                        <YAxis 
                          domain={[-1, 1]} 
                          ticks={[-1, -0.5, 0, 0.5, 1]}
                          tickFormatter={(value) => value.toFixed(1)}
                          stroke="#9CA3AF"
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const comment = payload[0].payload;
                              return (
                                <div className="bg-gray-800 p-3 rounded shadow-lg border border-gray-700 max-w-xs">
                                  <p className="text-sm font-semibold mb-1 text-white">
                                    {sentimentEmoji[comment.sentiment]} {comment.sentiment}
                                  </p>
                                  <p className="text-xs text-gray-300 mb-1">Score: {comment.score.toFixed(2)}</p>
                                  <p className="text-xs mt-2 border-t border-gray-700 pt-1 text-gray-400">"{comment.comment}"</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar 
                          dataKey="score" 
                          name="Sentiment Score"
                          fill={(entry) => {
                            if (entry.score > 0.2) return COLORS[0];
                            if (entry.score < -0.2) return COLORS[2];
                            return COLORS[1];
                          }}
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-lg">
                <h3 className="text-lg font-semibold text-purple-300 mb-4">Recent Comments</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {data.comments.slice(0, 10).map((comment, index) => (
                    <div 
                      key={index} 
                      className="p-4 rounded-lg"
                      style={{ 
                        backgroundColor: BACKGROUND_COLORS[
                          comment.sentiment === "Positive" ? 0 : 
                          comment.sentiment === "Negative" ? 2 : 1
                        ],
                        borderLeft: `4px solid ${COLORS[
                          comment.sentiment === "Positive" ? 0 : 
                          comment.sentiment === "Negative" ? 2 : 1
                        ]}`
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="text-2xl mr-2" role="img" aria-label={comment.sentiment}>
                            {sentimentEmoji[comment.sentiment]}
                          </span>
                          <span className="text-sm font-medium px-2 py-1 rounded" style={{ 
                            backgroundColor: COLORS[
                              comment.sentiment === "Positive" ? 0 : 
                              comment.sentiment === "Negative" ? 2 : 1
                            ],
                            color: "white"
                          }}>
                            {comment.sentiment}
                          </span>
                        </div>
                        <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
                          Score: {comment.score.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-gray-300">{comment.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}