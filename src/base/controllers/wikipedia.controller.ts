import { Get, Param, Controller } from '@nestjs/common';
import { WikipediaService } from 'src/common/providers';
import { GetFeaturedContentDto } from '../dto/get-feature-content.dto';

@Controller('feed')
export class WikipediaController {
  constructor(private readonly wikipediaService: WikipediaService) {}

  @Get('/:language/featured/:year/:month/:day')
  async getFeaturedContent(
    @Param() { year, month, day, language }: GetFeaturedContentDto,
  ): Promise<any> {
    const date = `${year}/${month}/${day}`;
    return this.wikipediaService.getFeaturedContent(language, date);
  }
}
