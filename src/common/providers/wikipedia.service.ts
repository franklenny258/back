import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WikipediaService {
  private readonly apiUrl: string =
    'https://api.wikimedia.org/feed/v1/wikipedia';

  async getFeaturedContent(language: string, date: string): Promise<any> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/${language}/featured/${date}`,
      );
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to fetch featured content from Wikipedia API: ${error.message}`,
      );
    }
  }
}
