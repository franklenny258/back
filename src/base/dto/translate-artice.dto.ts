import { IsNotEmpty } from 'class-validator';
import { GetFeaturedContentDto } from './get-feature-content.dto';

export class TranslateArticleDto extends GetFeaturedContentDto {
  @IsNotEmpty({ message: 'Target language is required' })
  targetlanguage: string;

  @IsNotEmpty({ message: 'Article ID is required' })
  articleId: string;
}
