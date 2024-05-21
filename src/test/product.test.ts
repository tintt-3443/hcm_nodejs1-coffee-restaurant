import { ProductsService } from '../service/product.service';
import { AppDataSource } from '../config/ormconfig';
import { DataSource } from 'typeorm';
let productsService: ProductsService;
let connection: DataSource;
beforeAll(async () => {
  connection = await AppDataSource.initialize();
  productsService = new ProductsService();
});

afterAll(async () => {
  await connection.destroy();
});

describe('getAllProducts', () => {
  it('should return all products', async () => {
    const params = {
      page: 1,
      limit: 10,
      minRange: 15000,
      maxRange: 50000,
      keyword: 'Trà sữa',
      typeId: 1,
    };

    const products = await productsService.getAllProducts(params);
    const words = params.keyword.toLocaleLowerCase().split(' ');
    expect(products?.length).toBeLessThanOrEqual(params.limit);
    products?.forEach((product) => {
      expect(product.price).toBeGreaterThanOrEqual(params.minRange);
      expect(product.price).toBeLessThanOrEqual(params.maxRange);
      expect(product.type.id).toBe(params.typeId);
      expect(product.isActive).toBeTruthy();
      const isMatchName = words.some((word) =>
        product.name.toLocaleLowerCase().includes(word),
      );
      const isMatchDescription = words.some((word) =>
        product.description.toLocaleLowerCase().includes(word),
      );
      expect(isMatchName || isMatchDescription).toBeTruthy();
    });
  });
  it('should return null if not found', async () => {
    const params = {
      page: -10,
      limit: -10,
      minRange: 15000,
      maxRange: 50000,
      keyword: 'Trà sữa',
      typeId: -11,
    };
    const products = await productsService.getAllProducts(params);
    expect(products).toBeNull();
  });
});

describe('getProductDetail', () => {
  it('should return product detail', async () => {
    const id = 1;
    const product = await productsService.getProductDetail(id);
    expect(product).not.toBeNull();
    expect(product?.id).toBe(id);
    expect(product?.isActive).toBeTruthy();
  });

  it('should return null if product is not active', async () => {
    const id = -1;
    const product = await productsService.getProductDetail(id);
    expect(product).toBeNull();
  });
});

describe('getToppings', () => {
  it('should return product detail', async () => {
    const toppings = await productsService.getToppings();
    expect(toppings).not.toBeNull();
  });
});

describe('getToppingByProduct', () => {
  it('should return topping', async () => {
    const productId = 2;
    const toppings = await productsService.getToppingByProduct(productId);
    expect(toppings).not.toBeNull();
    Array.isArray(toppings) &&
      toppings?.forEach((topping) => {
        expect(topping.products).not.toBeNull();
        topping.products?.forEach((product) => {
          expect(product.id).toBe(productId);
        });
      });
  });

  it('should return null if not found  ', async () => {
    const productId = -1;
    const toppings = await productsService.getToppingByProduct(productId);
    expect(toppings).toBeNull();
  });
});

describe('checkProductExist', () => {
  it('should return product detail if product is existing', async () => {
    const productId = 1;
    const product = await productsService.checkProductExist(productId);
    expect(product).not.toBeNull();
    expect(product?.id).toBe(productId);
  });

  it('should return null if not found  ', async () => {
    const product = await productsService.checkProductExist(-1);
    expect(product).toBeNull();
  });
});

describe('saveProduct', () => {
  it('should return new product if product is not existing before', async () => {
    const params = {
      name: 'Trà sữa trân châu',
      description: 'Trà sữa trân châu ngon nhất',
      price: 20000,
      type: 1,
      isActive: true,
    };
    const product = await productsService.saveProduct(params);
    expect(product).not.toBeNull();
    expect(product?.name).toEqual(params.name);
    expect(product?.description).toEqual(params.description);
    expect(product?.price).toEqual(params.price);
    expect(product?.isActive).toEqual(params.isActive);
  });

  it('should return updated product if product is existing before', async () => {
    const params = {
      productId: 1,
      name: 'Trà sữa trân châu',
      description: 'Trà sữa trân châu ngon nhất',
      price: 20000,
      type: 1,
      isActive: true,
    };
    const product = await productsService.saveProduct(params);
    expect(product).not.toBeNull();
    expect(product?.id).toEqual(params.productId);
    expect(product?.name).toEqual(params.name);
    expect(product?.description).toEqual(params.description);
    expect(product?.price).toEqual(params.price);
    expect(product?.isActive).toEqual(params.isActive);
  });

  it('should return null if product not found', async () => {
    const params = {
      productId: -1,
      name: 'Trà sữa trân châu',
      description: 'Trà sữa trân châu ngon nhất',
      price: 20000,
      type: 1,
      isActive: true,
    };
    const product = await productsService.saveProduct(params);
    expect(product).toBeNull();
  });
});

describe('deleteProduct', () => {
  it('should delete product', async () => {
    const id = 1;
    const product = await productsService.deleteProduct(id);
    expect(product).not.toBeNull();
    expect(product?.id).toEqual(id);
  });

  it('should return null if not found  ', async () => {
    const id = -1;
    const product = await productsService.deleteProduct(id);
    expect(product).toBeNull();
  });
});

describe('getProductDefaultPage', () => {
  it('should return product detail', async () => {
    const products = await productsService.getProductDefaultPage();
    expect(products).not.toBeNull();
    products?.forEach((product) => {
      expect(product.isActive).toBeTruthy();
    });
  });
});
