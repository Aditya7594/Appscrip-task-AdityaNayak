import { Controller, Get, Inject, Param, ParseIntPipe, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../common/dto/error-response.dto.js';
import { ListProductsQueryDto } from './dto/list-products-query.dto.js';
import { PaginatedProductsDto } from './dto/paginated-products.dto.js';
import { ProductDto } from './dto/product.dto.js';
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
    type: ErrorResponseDto,
    description: 'Invalid query parameters or failed constraints',
  })
  async findAll(@Query() query: ListProductsQueryDto): Promise<PaginatedProductsDto> {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by its unique integer identifier' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Unique product integer identifier',
  })
  @ApiOkResponse({
    type: ProductDto,
    description: 'Product details with associated category and sorted images',
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Validation failed (numeric string is expected for id)',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Product with the specified ID was not found',
  })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<ProductDto> {
    return this.productsService.findById(id);
  }
}
