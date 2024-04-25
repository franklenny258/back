import { Test, TestingModule } from '@nestjs/testing';
import { WikipediaController } from './wikipedia.controller';
import { WikipediaService } from 'src/common/providers';
import { TranslationService } from 'src/common/providers';
import { BadRequestException } from '@nestjs/common';

describe('WikipediaController', () => {
  let controller: WikipediaController;
  let wikipediaService: WikipediaService;
  let translationService: TranslationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WikipediaController],
      providers: [WikipediaService, TranslationService],
    }).compile();

    controller = module.get<WikipediaController>(WikipediaController);
    wikipediaService = module.get<WikipediaService>(WikipediaService);
    translationService = module.get<TranslationService>(TranslationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getFeaturedContent', () => {
    it('should return featured content', async () => {
      const result = { title: 'Title', extract: 'Extract' };
      const dto = { year: 2024, month: 4, day: 25, language: 'en' };
      const getFeaturedContentSpy = jest
        .spyOn(wikipediaService, 'getFeaturedContent')
        .mockResolvedValue(result);

      expect(await controller.getFeaturedContent(dto)).toBe(result);
      expect(getFeaturedContentSpy).toHaveBeenCalledWith('en', '2024/4/25');
    });
  });

  describe('translateFeaturedArticleContent', () => {
    it('should translate the article content', async () => {
      const result = {
        title: 'Translated Title',
        extract: 'Translated Extract',
      };
      const dto = {
        year: 2024,
        month: 4,
        day: 25,
        language: 'en',
        targetlanguage: 'fr',
        articleId: '123',
      };
      const getFeaturedContentSpy = jest
        .spyOn(wikipediaService, 'getFeaturedContent')
        .mockResolvedValue({
          mostread: {
            articles: [
              {
                tid: '123',
                titles: { normalized: 'Title' },
                extract: 'Extract',
              },
            ],
          },
        });
      const getSupportedLanguagesSpy = jest
        .spyOn(translationService, 'getSupportedLanguages')
        .mockResolvedValue([{ code: 'fr', name: 'French' }]);
      const translateSpy = jest
        .spyOn(translationService, 'translate')
        .mockResolvedValueOnce('Translated Title')
        .mockResolvedValueOnce('Translated Extract');

      expect(await controller.translateFeaturedArticleContent(dto)).toEqual(
        result,
      );
      expect(getFeaturedContentSpy).toHaveBeenCalledWith('en', '2024/4/25');
      expect(getSupportedLanguagesSpy).toHaveBeenCalled();
      expect(translateSpy).toHaveBeenCalledWith('Title', 'fr', 'en');
      expect(translateSpy).toHaveBeenCalledWith('Extract', 'fr', 'en');
    });

    it('should throw BadRequestException if target language is not supported', async () => {
      const dto = {
        year: 2024,
        month: 4,
        day: 25,
        language: 'en',
        targetlanguage: 'de',
        articleId: '123',
      };
      const getSupportedLanguagesSpy = jest
        .spyOn(translationService, 'getSupportedLanguages')
        .mockResolvedValue([{ code: 'fr', name: 'French' }]);

      await expect(
        controller.translateFeaturedArticleContent(dto),
      ).rejects.toThrow(BadRequestException);
      expect(getSupportedLanguagesSpy).toHaveBeenCalled();
    });

    it('should throw BadRequestException if article not found', async () => {
      const dto = {
        year: 2024,
        month: 4,
        day: 25,
        language: 'en',
        targetlanguage: 'fr',
        articleId: '123',
      };
      const getFeaturedContentSpy = jest
        .spyOn(wikipediaService, 'getFeaturedContent')
        .mockResolvedValue({
          mostread: { articles: [] },
        });

      await expect(
        controller.translateFeaturedArticleContent(dto),
      ).rejects.toThrow(BadRequestException);
      expect(getFeaturedContentSpy).toHaveBeenCalledWith('en', '2024/4/25');
    });
  });
});
