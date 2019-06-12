import { getEnv } from "./env-api";

interface GiphyImageResponse {
  data: GiphyData[];
}

interface GiphyData {
  type: "gif";
  id: string;
  images: {
    fixed_height: GiphyImage;
  };
}

export interface GiphyImage {
  url: string;
  width: string;
  height: string;
}

export async function getImages(
  search: string,
  limit: number
): Promise<GiphyImageResponse> {
  const env = await getEnv();
  if (!env.giphy_api_key) {
    throw new Error("No Giphy api key found.");
  }

  const url = buildGiphyUrl(search, limit, env.giphy_api_key);

  const fetchResponse = await fetch(url);
  if (!fetchResponse.ok) {
    console.error("Error fetching images", fetchResponse);
    throw new Error("Could not fetch images from Giphy");
  }

  return await fetchResponse.json();
}

function buildGiphyUrl(search: string, limit: number, apiKey: string): string {
  const encodedSearch = encodeURIComponent(search);
  return `https://api.giphy.com/v1/gifs/search?q=${encodedSearch}&limit=${limit}&api_key=${apiKey}`;
}
