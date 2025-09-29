

import { useEffect, useState } from "react";

const RSSFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      "https://api.rss2json.com/v1/api.json?rss_url=https://www.reddit.com/r/ClashOfClans.rss"
    )
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.items);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <p className="text-xl animate-pulse">⚔️ Loading Clash of Clans News...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-x-hidden">
      <div className="relative z-10 p-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            ⚔️ Clash of Clans News
          </h1>
          <p className="text-gray-400 text-lg">Discover the latest updates and strategies</p>
        </div>

        <div className="max-w-7xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center text-white">
              <div className="text-6xl mb-4">🏰</div>
              <h3 className="text-2xl mb-2">No posts available</h3>
              <p className="text-gray-400">Check your connection or try again later</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {posts.map((post, index) => {
                const hasImage = Boolean(post.enclosure?.thumbnail);
                return (
                  <div
                    key={post.guid}
                    className="group relative transform transition-all duration-700 hover:scale-105"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    <div className="relative bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-900/95 backdrop-blur-xl rounded-3xl overflow-hidden border border-gray-700/50 hover:border-purple-500/50 shadow-2xl">
                      {/* Image Section */}
                      {hasImage && (
                        <div className="relative overflow-hidden">
                          <img
                            src={post.enclosure.thumbnail}
                            alt={post.title}
                            onError={(e) => (e.currentTarget.style.display = "none")}
                            className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-1000"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        </div>
                      )}

                      <div className="p-6 space-y-4">
                        {/* Title */}
                        <h3>
                          <a
                            href={post.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-xl font-bold text-white hover:text-transparent hover:bg-gradient-to-r hover:from-cyan-400 hover:to-purple-400 hover:bg-clip-text transition-all duration-500 line-clamp-2 leading-tight"
                          >
                            {post.title}
                          </a>
                        </h3>

                        {/* Date & Time */}
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center bg-gradient-to-r from-purple-600/30 to-cyan-600/30 rounded-full px-4 py-2 border border-purple-500/30 hover:border-cyan-500/50 transition-colors duration-500">
                            <span className="text-purple-300 mr-2">⏰</span>
                            <span className="text-gray-300 text-sm font-medium">
                              {new Date(post.pubDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <div
                          className="text-gray-300 text-sm leading-relaxed line-clamp-3 post-content hover:text-gray-200 transition-colors duration-500"
                          dangerouslySetInnerHTML={{ __html: post.description }}
                        ></div>

                        {/* Action Button */}
                        <div className="pt-2">
                          <a
                            href={post.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
                          >
                            <span className="mr-2">🚀</span>
                            Read more →
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .post-content a {
          color: #a78bfa;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .post-content a:hover {
          color: #c4b5fd;
          text-decoration: underline;
        }
        .post-content p {
          margin: 0;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};

export default RSSFeed;
