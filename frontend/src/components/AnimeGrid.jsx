import React, { useEffect, useState } from 'react';
import { Play, Star, Calendar } from 'lucide-react';

// GraphQL query to fetch trending/popular anime
const ANILIST_QUERY = `
  query ($page: Int, $perPage: Int, $sort: [MediaSort]) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        currentPage
        hasNextPage
      }
      media(type: ANIME, sort: $sort, status_not_in: [NOT_YET_RELEASED, CANCELLED]) {
        id
        title { english romaji native }
        coverImage { extraLarge large medium color }
        bannerImage
        averageScore
        startDate { year }
        description(asHtml: true)
      }
    }
  }
`;

const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
};

const AnimeGrid = ({ title = 'Anime', showTitle = true, sort = ['TRENDING_DESC'] }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPage = async (pageNum = 1, append = false) => {
    try {
      setLoading(true);

      const res = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: ANILIST_QUERY,
          variables: { page: pageNum, perPage: 20, sort },
        }),
      });

      if (!res.ok) {
        console.error('AniList API error:', await res.text());
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();
      const media = json?.data?.Page?.media || [];

      const mapped = media.map((m) => ({
        id: m.id,
        title: m.title?.english || m.title?.romaji || m.title?.native || 'Untitled',
        imageUrl:
          m.coverImage?.extraLarge ||
          m.coverImage?.large ||
          m.coverImage?.medium ||
          m.bannerImage ||
          null,
        score: typeof m.averageScore === 'number' ? (m.averageScore / 10).toFixed(1) : 'N/A',
        year: m.startDate?.year || 'N/A',
        overview: stripHtml(m.description || '').slice(0, 160),
        anilistUrl: `https://anilist.co/anime/${m.id}`,
      }));

      setItems((prev) => (append ? [...prev, ...mapped] : mapped));
      setHasMore(Boolean(json?.data?.Page?.pageInfo?.hasNextPage));
    } catch (err) {
      console.error('Error fetching AniList data:', err);
      if (!append) setItems([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchPage(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(sort)]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPage(nextPage, true);
  };

  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl text-gray-400 mb-4">No anime found</h3>
        <p className="text-gray-500">Try refreshing the page or check back later.</p>
      </div>
    );
  }

  return (
    <div className="text-white">
      {showTitle && <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden hover:scale-105 hover:bg-white/10 transition-all duration-300 group border border-white/5 hover:border-white/10 shadow-lg hover:shadow-xl"
          >
            <a href={item.anilistUrl} target="_blank" rel="noopener noreferrer">
              <div className="relative group">
                <img
                  src={item.imageUrl || 'https://via.placeholder.com/300x450/333333/ffffff?text=No+Image'}
                  alt={item.title}
                  className="w-full h-64 md:h-80 object-cover transition duration-300 group-hover:brightness-50"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://via.placeholder.com/300x450/333333/ffffff?text=No+Image';
                  }}
                />

                <div className="absolute inset-0 bg-transparent transition-all duration-300 flex items-center justify-center">
                  <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-sm md:text-base mb-2 line-clamp-2">
                  {item.title}
                </h3>

                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span>{item.score}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{item.year}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-300 line-clamp-2">
                  {item.overview || 'No description available.'}
                </p>
              </div>
            </a>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3.5 rounded-2xl font-medium shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AnimeGrid;
