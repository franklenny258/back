import { Injectable } from '@nestjs/common';
import axios from 'axios';

interface TranslationResponse {
  translatedText: string;
}

interface Language {
  code: string;
  name: string;
}

@Injectable()
export class TranslationService {
  private readonly apiUrl: string = 'https://libretranslate.com';

  async translate(
    text: string,
    targetLanguage: string,
    sourceLanguage: string = 'auto',
  ): Promise<string> {
    try {
      const response = await axios.post<TranslationResponse>(
        `${this.apiUrl}/translate`,
        {
          q: text,
          source: sourceLanguage,
          target: targetLanguage,
          format: 'text',
          api_key: '', // We need API key for translation to work and it needs to be payed
        },
      );

      console.log(response);
      return;
    } catch (error) {
      console.log(error);
      throw new Error('Failed to fetch translation');
    }
  }

  async getSupportedLanguages(): Promise<Language[]> {
    try {
      const response = await axios.get<Language[]>(`${this.apiUrl}/languages`);

      const languages: Language[] = response.data.map(({ code, name }) => ({
        code,
        name,
      }));

      return languages;
    } catch (error) {
      throw new Error('Failed to fetch supported languages');
    }
  }
}
