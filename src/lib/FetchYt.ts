/* eslint-disable @typescript-eslint/no-explicit-any */
const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

export async function fetchYoutubeVideos(query: string, maxResults = 2) {
  const endpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=${maxResults}&q=${encodeURIComponent(
    query
  )}&key=${YOUTUBE_API_KEY}`;

  const res = await fetch(endpoint);
  const data = await res.json();

  return data.items.map((item: any) => ({
    title: item.snippet.title,
    url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    thumbnail: item.snippet.thumbnails.medium.url,
    channel: item.snippet.channelTitle,
  }));
}
