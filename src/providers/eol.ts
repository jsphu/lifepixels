import axios from 'axios';
import sharp from 'sharp';
import { OrganismImage } from '../types';

export class EOLProvider {
  private readonly baseUrl = 'https://eol.org/api';

  /**
   * Searches EOL for an organism and returns the first high-quality image found.
   */
  async fetchOrganismImage(query: string): Promise<OrganismImage | null> {
    try {
      // Search for the taxon ID
      const searchRes = await axios.get(`${this.baseUrl}/search/1.0.json`, {
        params: { q: query, page: 1 }
      });

      const firstResult = searchRes.data.results?.[0];
      if (!firstResult) return null;

      // Extract ID from link (e.g., "https://eol.org/pages/328574" -> "328574")
      const eolId = firstResult.link.split('/').pop();

      // Fetch page details for media
      const pageRes = await axios.get(`${this.baseUrl}/pages/1.0/${eolId}.json`, {
        params: {
          images_per_page: 1,
          details: true
        }
      });

      const mediaUrl = pageRes.data.taxonConcept?.dataObjects?.[0]?.eolMediaURL;
      const scientificName = pageRes.data.taxonConcept?.scientificName || query;

      if (!mediaUrl) return null;

      // Download the image and convert to a Buffer
      const imageRes = await axios.get(mediaUrl, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(imageRes.data);

      // We use sharp here just to ensure the buffer is a valid image
      // before passing it to the engine.
      const metadata = await sharp(buffer).metadata();
      if (!metadata) throw new Error("Invalid image data");

      return {
        buffer,
        scientificName,
        sourceUrl: mediaUrl
      };

    } catch (error) {
      console.error(`EOL Provider Error: ${error instanceof Error ? error.message : error}`);
      return null;
    }
  }
}
