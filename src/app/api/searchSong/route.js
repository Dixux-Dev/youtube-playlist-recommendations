import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  try {
    const youtube = google.youtube({
      version: "v3",
      auth: process.env.YOUTUBE_API_KEY,
    });

    const response = await youtube.search.list({
      part: "snippet",
      q: query,
      type: "video",
      order: "relevance",
      maxResults: 5,
      videoCategoryId: 10,
    });

    const results = response.data.items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.default.url,
      channelTitle: item.snippet.channelTitle,
    }));

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error al buscar en YouTube:", error.message);
    return NextResponse.json(
      { error: "Ocurrió un error al realizar la búsqueda." },
      { status: 500 }
    );
  }
}
