import { ApiProperty } from '@nestjs/swagger';
import { ProductDto } from './product.dto.js';

export class PaginationMetaDto {
  @ApiProperty({ example: 1, description: 'Current page number (1-indexed)' })
  page!: number;

  @ApiProperty({ example: 12, description: 'Items requested per page' })
  limit!: number;

  @ApiProperty({ example: 60, description: 'Total number of items matching filter criteria' })
  total!: number;

  @ApiProperty({ example: 5, description: 'Total number of pages available' })
  totalPages!: number;

  @ApiProperty({ example: true, description: 'Whether a subsequent page exists' })
  hasNextPage!: boolean;

  @ApiProperty({ example: false, description: 'Whether a preceding page exists' })
  hasPreviousPage!: boolean;
}

export class PaginatedProductsDto {
  @ApiProperty({ type: () => [ProductDto], description: 'List of matching products' })
  data!: ProductDto[];

  @ApiProperty({ type: () => PaginationMetaDto, description: 'Pagination metadata' })
  meta!: PaginationMetaDto;
}
