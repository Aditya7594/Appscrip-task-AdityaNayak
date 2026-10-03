import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
  @ApiProperty({
    example: 1,
    description: 'Unique category identifier',
  })
  id!: number;

  @ApiProperty({
    example: 'mens-clothing',
    description: 'URL-friendly category slug',
  })
  slug!: string;

  @ApiProperty({
    example: "Men's Clothing",
    description: 'Category display name',
  })
  name!: string;

  @ApiProperty({
    example: 12,
    description: 'Total number of products in this category',
  })
  productCount!: number;
}
