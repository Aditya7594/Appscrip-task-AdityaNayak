import { ApiProperty } from '@nestjs/swagger';

export class ProductCategoryDto {
  @ApiProperty({ example: 1, description: 'Category unique identifier' })
  id!: number;

  @ApiProperty({ example: 'mens-clothing', description: 'Category slug' })
  slug!: string;

  @ApiProperty({ example: "Men's Clothing", description: 'Category display name' })
  name!: string;
}

export class ProductImageDto {
  @ApiProperty({
    example: '/products/mens-cotton-jacket.jpg',
    description: 'Relative path to product image asset',
  })
  url!: string;

  @ApiProperty({
    example: "Men's Cotton Jacket - Men's Clothing product photo",
    description: 'Accessible alt text under 125 characters',
  })
  alt!: string;

  @ApiProperty({ example: 0, description: 'Image display sequence order' })
  position!: number;
}

export class ProductDto {
  @ApiProperty({ example: 1, description: 'Product unique identifier' })
  id!: number;

  @ApiProperty({ example: 'mens-cotton-jacket', description: 'Product slug' })
  slug!: string;

  @ApiProperty({ example: "Mens Cotton Jacket", description: 'Product title' })
  title!: string;

  @ApiProperty({
    example: 'Great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions.',
    description: 'Detailed product description',
  })
  description!: string;

  @ApiProperty({ example: 55.99, description: 'Product price in USD' })
  price!: number;

  @ApiProperty({ example: 'USD', description: 'Currency code' })
  currency!: 'USD';

  @ApiProperty({ example: 4.7, description: 'Average customer rating (0 to 5)' })
  rating!: number;

  @ApiProperty({ example: 500, description: 'Total count of customer ratings' })
  ratingCount!: number;

  @ApiProperty({ type: () => ProductCategoryDto, description: 'Associated category' })
  category!: ProductCategoryDto;

  @ApiProperty({ type: () => [ProductImageDto], description: 'Product gallery images' })
  images!: ProductImageDto[];

  @ApiProperty({ example: '2026-10-01T00:00:00.000Z', description: 'Creation date in ISO format' })
  createdAt!: string;
}
