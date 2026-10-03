import { Controller, Get, Header } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service.js';
import { CategoryDto } from './dto/category.dto.js';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @Header('Cache-Control', 'public, max-age=60')
  @ApiOperation({ summary: 'List all categories ordered by name' })
  @ApiOkResponse({
    type: [CategoryDto],
    description: 'Array of categories ordered by name ascending with product count',
  })
  async findAll(): Promise<CategoryDto[]> {
    return this.categoriesService.findAll();
  }
}
