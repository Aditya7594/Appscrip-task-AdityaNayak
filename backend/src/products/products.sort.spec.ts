import { getProductOrderBy, ProductSortOrder } from './products.sort.js';

describe('products.sort', () => {
  it('should return rating desc, ratingCount desc, id asc for RECOMMENDED sort', () => {
    const order = getProductOrderBy(ProductSortOrder.RECOMMENDED);
    expect(order).toEqual([{ rating: 'desc' }, { ratingCount: 'desc' }, { id: 'asc' }]);
  });

  it('should return createdAt desc, id desc for NEWEST sort', () => {
    const order = getProductOrderBy(ProductSortOrder.NEWEST);
    expect(order).toEqual([{ createdAt: 'desc' }, { id: 'desc' }]);
  });

  it('should return ratingCount desc, id asc for POPULAR sort', () => {
    const order = getProductOrderBy(ProductSortOrder.POPULAR);
    expect(order).toEqual([{ ratingCount: 'desc' }, { id: 'asc' }]);
  });

  it('should return price asc, id asc for PRICE_ASC sort', () => {
    const order = getProductOrderBy(ProductSortOrder.PRICE_ASC);
    expect(order).toEqual([{ price: 'asc' }, { id: 'asc' }]);
  });

  it('should return price desc, id desc for PRICE_DESC sort', () => {
    const order = getProductOrderBy(ProductSortOrder.PRICE_DESC);
    expect(order).toEqual([{ price: 'desc' }, { id: 'desc' }]);
  });

  it('should fallback to RECOMMENDED sort when no parameter is provided', () => {
    const order = getProductOrderBy();
    expect(order).toEqual([{ rating: 'desc' }, { ratingCount: 'desc' }, { id: 'asc' }]);
  });

  it('should ensure every sort option includes an id tie-breaker for stable pagination', () => {
    const allSortOrders = Object.values(ProductSortOrder);

    for (const sort of allSortOrders) {
      const order = getProductOrderBy(sort);
      const hasIdTieBreaker = order.some((rule) => 'id' in rule);
      expect(hasIdTieBreaker).toBe(true);
      const lastRule = order[order.length - 1];
      expect(lastRule).toHaveProperty('id');
    }
  });
});
