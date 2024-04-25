import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WikipediaService {
  async getFeaturedContent(language: string, date: string): Promise<any> {
    try {
      const url = `https://api.wikimedia.org/feed/v1/wikipedia/${language}/featured/${date}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to fetch featured content from Wikipedia API: ${error.message}`,
      );
    }
  }
}
