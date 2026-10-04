import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { ProductSortOrder } from '../products.sort.js';

export function IsLessThanOrEqual(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isLessThanOrEqual',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints as [string];
          const relatedValue = (args.object as Record<string, unknown>)[relatedPropertyName];
          if (
            value === undefined ||
            value === null ||
            relatedValue === undefined ||
            relatedValue === null
          ) {
            return true;
          }
          return Number(value) <= Number(relatedValue);
        },
        defaultMessage() {
          return 'minPrice must be less than or equal to maxPrice';
        },
      },
    });
  };
}

export class ListProductsQueryDto {
  @ApiPropertyOptional({
    example: 1,
    default: 1,
    description: 'Page number (>= 1)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page must be an integer' })
  @Min(1, { message: 'page must not be less than 1' })
  page: number = 1;

  @ApiPropertyOptional({
    example: 18,
    default: 18,
    description: 'Items per page (1 to 48)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit must be an integer' })
  @Min(1, { message: 'limit must not be less than 1' })
  @Max(48, { message: 'limit must not be greater than 48' })
  limit: number = 18;

  @ApiPropertyOptional({
    example: 'mens-clothing,jewelery',
    description: 'Comma-separated category slugs (max 10 items)',
    type: String,
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }): string[] | undefined => {
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }
    if (Array.isArray(value)) {
      return value.flatMap((item: unknown) =>
        typeof item === 'string'
          ? item
              .split(',')
              .map((s) => s.trim())
              .filter((s) => s.length > 0)
          : [],
      );
    }
    return undefined;
  })
  @IsArray({ message: 'category must be an array of slugs' })
  @ArrayMaxSize(10, { message: 'category cannot have more than 10 slugs' })
  @Matches(/^[a-z0-9-]+$/, {
    each: true,
    message: 'Each category slug must match /^[a-z0-9-]+$/',
  })
  category?: string[];

  @ApiPropertyOptional({
    example: 20,
    description: 'Minimum price filter (>= 0)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'minPrice must be a number' })
  @Min(0, { message: 'minPrice must not be less than 0' })
  @Max(1000000, { message: 'minPrice must not be greater than 1000000' })
  @IsLessThanOrEqual('maxPrice', { message: 'minPrice must be less than or equal to maxPrice' })
  minPrice?: number;

  @ApiPropertyOptional({
    example: 150,
    description: 'Maximum price filter (>= 0)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'maxPrice must be a number' })
  @Min(0, { message: 'maxPrice must not be less than 0' })
  @Max(1000000, { message: 'maxPrice must not be greater than 1000000' })
  maxPrice?: number;

  @ApiPropertyOptional({
    example: 4.0,
    description: 'Minimum average rating filter (0 to 5)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'minRating must be a number' })
  @Min(0, { message: 'minRating must not be less than 0' })
  @Max(5, { message: 'minRating must not be greater than 5' })
  minRating?: number;

  @ApiPropertyOptional({
    enum: ProductSortOrder,
    default: ProductSortOrder.RECOMMENDED,
    description: 'Product sort order',
  })
  @IsOptional()
  @IsEnum(ProductSortOrder, {
    message: 'sort must be one of: recommended, newest, popular, price_asc, price_desc',
  })
  sort: ProductSortOrder = ProductSortOrder.RECOMMENDED;

  @ApiPropertyOptional({
    example: 'jacket',
    description: 'Case-insensitive search query in title and description (1 to 80 chars)',
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'q must be a string' })
  @Length(1, 80, { message: 'q must be between 1 and 80 characters' })
  q?: string;
}
