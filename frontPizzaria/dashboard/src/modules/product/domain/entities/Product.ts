// Dashboard - Product Domain Entity
export interface ICategory {
  id: string;
  name: string;
}

export interface IProduct {
  id: string;
  name: string;
  price: string;
  description: string;
  banner: string;
  category?: ICategory;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Product implements IProduct {
  constructor(
    public id: string,
    public name: string,
    public price: string,
    public description: string,
    public banner: string,
    public categoryId: string,
    public category?: ICategory,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  static create(data: Omit<IProduct, 'createdAt' | 'updatedAt'>): Product {
    return new Product(
      data.id,
      data.name,
      data.price,
      data.description,
      data.banner,
      data.categoryId,
      data.category
    );
  }

  getNumericPrice(): number {
    return parseFloat(this.price);
  }
}

export class Category implements ICategory {
  constructor(public id: string, public name: string) {}

  static create(data: ICategory): Category {
    return new Category(data.id, data.name);
  }
}
