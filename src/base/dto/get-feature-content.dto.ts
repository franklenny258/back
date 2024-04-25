import { IsInt, IsIn, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class GetFeaturedContentDto {
  @IsNotEmpty()
  language: string;

  @IsInt()
  @Type(() => Number)
  year: number;

  @IsInt()
  @IsIn([...Array(31).keys()].map((x) => x + 1), {
    message: 'Day must be between 1 and 31',
  })
  @Type(() => Number)
  day: number;

  @IsInt()
  @IsIn([...Array(12).keys()].map((x) => x + 1), {
    message: 'Month must be between 1 and 12',
  })
  @Type(() => Number)
  month: number;
}
