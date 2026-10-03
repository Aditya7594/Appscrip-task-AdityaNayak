import { Controller, Get, Inject, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ListProductsQueryDto } from './dto/list-products-query.dto.js';
import { PaginatedProductsDto } from './dto/paginated-products.dto.js';
import { ProductsService } from './products.service.js';
import { ProductSortOrder } from './products.sort.js';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(@Inject(ProductsService) private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({
    summary: 'List products with pagination, category filter, price range, rating, sorting, and search',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Page number (>= 1, default 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 12,
    description: 'Items per page (1..48, default 12)',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    example: 'mens-clothing,jewelery',
    description: 'Comma-separated category slugs (max 10 items, matching /^[a-z0-9-]+$/)',
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    type: Number,
    example: 20,
    description: 'Minimum price filter (>= 0, <= 1000000, <= maxPrice)',
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    type: Number,
    example: 60,
    description: 'Maximum price filter (>= 0, <= 1000000, >= minPrice)',
  })
  @ApiQuery({
    name: 'minRating',
    required: false,
    type: Number,
    example: 4.0,
    description: 'Minimum rating filter (0..5)',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    enum: ProductSortOrder,
    example: ProductSortOrder.RECOMMENDED,
    description:
      'Product sorting strategy with stable id tie-breaker: recommended | newest | popular | price_asc | price_desc',
  })
  @ApiQuery({
    name: 'q',
    required: false,
    type: String,
    example: 'jacket',
    description: 'Case-insensitive search query in title and description (1..80 characters)',
  })
  @ApiOkResponse({
    type: PaginatedProductsDto,
    description:
      'Paginated product list. If page > totalPages, returns 200 with an empty data array and valid pagination metadata.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid query parameters or failed constraints',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        error: { type: 'string', example: 'Bad Request' },
        message: {
          oneOf: [
            { type: 'string', example: 'minPrice must be less than or equal to maxPrice' },
            {
              type: 'array',
              items: { type: 'string' },
              example: [
                'minPrice must be less than or equal to maxPrice',
                'limit must not be greater than 48',
              ],
            },
          ],
        },
        path: { type: 'string', example: '/products?minPrice=50&maxPrice=10' },
        timestamp: { type: 'string', example: '2026-10-03T16:00:00.000Z' },
      },
      required: ['statusCode', 'error', 'message', 'path', 'timestamp'],
    },
  })
  async findAll(@Query() query: ListProductsQueryDto): Promise<PaginatedProductsDto> {
    return this.productsService.findAll(query);
  }
}
