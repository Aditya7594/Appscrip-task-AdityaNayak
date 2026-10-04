import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ProductSortOrder } from '../products.sort.js';
import { ListProductsQueryDto } from './list-products-query.dto.js';

describe('ListProductsQueryDto', () => {
  it('should initialize with correct default values', () => {
    const dto = plainToInstance(ListProductsQueryDto, {});
    expect(dto.page).toBe(1);
    expect(dto.limit).toBe(18);
    expect(dto.sort).toBe(ProductSortOrder.RECOMMENDED);
  });

  it('should transform comma-separated string of categories into string array', async () => {
    const dto = plainToInstance(ListProductsQueryDto, {
      category: 'mens-clothing,jewelery',
    });
    expect(dto.category).toEqual(['mens-clothing', 'jewelery']);

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should pass validation with valid filter parameters', async () => {
    const dto = plainToInstance(ListProductsQueryDto, {
      page: '2',
      limit: '24',
      category: 'electronics',
      minPrice: '10.50',
      maxPrice: '99.99',
      minRating: '4.2',
      sort: 'price_asc',
      q: '  jacket  ',
    });

    expect(dto.page).toBe(2);
    expect(dto.limit).toBe(24);
    expect(dto.minPrice).toBe(10.5);
    expect(dto.maxPrice).toBe(99.99);
    expect(dto.minRating).toBe(4.2);
    expect(dto.sort).toBe(ProductSortOrder.PRICE_ASC);
    expect(dto.q).toBe('jacket');

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation when page < 1', async () => {
    const dto = plainToInstance(ListProductsQueryDto, { page: 0 });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'page')).toBe(true);
  });

  it('should fail validation when limit > 48', async () => {
    const dto = plainToInstance(ListProductsQueryDto, { limit: 100 });
    const errors = await validate(dto);
    const limitError = errors.find((e) => e.property === 'limit');
    expect(limitError).toBeDefined();
    expect(limitError?.constraints?.max).toContain('limit must not be greater than 48');
  });

  it('should fail validation when minPrice > maxPrice with custom message', async () => {
    const dto = plainToInstance(ListProductsQueryDto, {
      minPrice: 50,
      maxPrice: 10,
    });
    const errors = await validate(dto);
    const minPriceError = errors.find((e) => e.property === 'minPrice');
    expect(minPriceError).toBeDefined();
    expect(minPriceError?.constraints?.isLessThanOrEqual).toBe(
      'minPrice must be less than or equal to maxPrice',
    );
  });

  it('should fail validation when category slug contains invalid characters', async () => {
    const dto = plainToInstance(ListProductsQueryDto, {
      category: 'mens_clothing!,invalid slug',
    });
    const errors = await validate(dto);
    const categoryError = errors.find((e) => e.property === 'category');
    expect(categoryError).toBeDefined();
    expect(categoryError?.constraints?.matches).toContain(
      'Each category slug must match /^[a-z0-9-]+$/',
    );
  });

  it('should fail validation when category contains more than 10 slugs', async () => {
    const slugs = Array.from({ length: 11 }, (_, i) => `cat-${i}`).join(',');
    const dto = plainToInstance(ListProductsQueryDto, { category: slugs });
    const errors = await validate(dto);
    const categoryError = errors.find((e) => e.property === 'category');
    expect(categoryError).toBeDefined();
    expect(categoryError?.constraints?.arrayMaxSize).toContain(
      'category cannot have more than 10 slugs',
    );
  });

  it('should fail validation when sort has an unrecognized value', async () => {
    const dto = plainToInstance(ListProductsQueryDto, { sort: 'bogus' });
    const errors = await validate(dto);
    const sortError = errors.find((e) => e.property === 'sort');
    expect(sortError).toBeDefined();
  });

  it('should fail validation when minRating is outside 0..5 range', async () => {
    const dtoOver = plainToInstance(ListProductsQueryDto, { minRating: 5.5 });
    const errorsOver = await validate(dtoOver);
    expect(errorsOver.some((e) => e.property === 'minRating')).toBe(true);

    const dtoUnder = plainToInstance(ListProductsQueryDto, { minRating: -1 });
    const errorsUnder = await validate(dtoUnder);
    expect(errorsUnder.some((e) => e.property === 'minRating')).toBe(true);
  });

  it('should fail validation when q exceeds 80 characters', async () => {
    const dto = plainToInstance(ListProductsQueryDto, { q: 'a'.repeat(81) });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'q')).toBe(true);
  });
});
