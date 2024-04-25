import { Get, Param, Controller } from '@nestjs/common';
import { WikipediaService } from 'src/common/providers';

@Controller('feed')
export class WikipediaController {
  constructor(private readonly wikipediaService: WikipediaService) {}

  @Get('/:language/featured/:year/:month/:day')
  async getFeaturedContent(
    @Param('language') language: string,
    @Param('year') year: string,
    @Param('month') month: string,
    @Param('day') day: string,
  ): Promise<any> {
    const date = `${year}/${month}/${day}`;
    return this.wikipediaService.getFeaturedContent(language, date);
  }
}
