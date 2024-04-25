import { Get, Param, Controller, BadRequestException } from '@nestjs/common';
import { WikipediaService } from 'src/common/providers';
import { TranslationService } from 'src/common/providers';
import { GetFeaturedContentDto } from '../dto/get-feature-content.dto';
import { TranslateArticleDto } from '../dto/translate-artice.dto';

@Controller('feed')
export class WikipediaController {
  constructor(
    private readonly wikipediaService: WikipediaService,
    private readonly translationService: TranslationService,
  ) {}

  @Get('/:language/featured/:year/:month/:day')
  async getFeaturedContent(
    @Param() { year, month, day, language }: GetFeaturedContentDto,
  ): Promise<any> {
    const date = `${year}/${month}/${day}`;
    return this.wikipediaService.getFeaturedContent(language, date);
  }

  @Get(
    '/:language/featured/:year/:month/:day/translate/:targetlanguage/:articleId',
  )
  async translateFeaturedArticleContent(
    @Param()
    {
      year,
      month,
      day,
      language,
      targetlanguage,
      articleId,
    }: TranslateArticleDto,
  ): Promise<{ title: string; extract: string }> {
    // Check if target language is supported
    const supportedLanguages =
      await this.translationService.getSupportedLanguages();
    const isSupportedLanguage = supportedLanguages.some(
      (lang) => lang.code === targetlanguage,
    );

    if (!isSupportedLanguage) {
      throw new BadRequestException('Target language is not supported');
    }

    const date = `${year}/${month}/${day}`;
    const featuredContent = await this.wikipediaService.getFeaturedContent(
      language,
      date,
    );

    // Find the selected article by articleId
    const selectedArticle = featuredContent.mostread.articles.find(
      (article) => article.tid === articleId,
    );
    if (!selectedArticle) {
      throw new BadRequestException('Article not found');
    }

    // Translate the article
    const title = await this.translationService.translate(
      selectedArticle.titles.normalized,
      targetlanguage,
      language,
    );

    const extract = await this.translationService.translate(
      selectedArticle.extract,
      targetlanguage,
      language,
    );

    return {
      title,
      extract,
    };
  }
}
