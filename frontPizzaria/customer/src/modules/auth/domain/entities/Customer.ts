// Customer - Auth Domain Entity
export interface ICustomer {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Customer implements ICustomer {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(data: Omit<ICustomer, 'createdAt' | 'updatedAt'>): Customer {
    return new Customer(
      data.id,
      data.name,
      data.email,
      new Date(),
      new Date()
    );
  }
}

export interface IAuthToken {
  token: string;
  customer: ICustomer;
  expiresIn: number;
}
