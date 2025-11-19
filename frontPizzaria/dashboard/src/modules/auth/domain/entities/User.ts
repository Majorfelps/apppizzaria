// Dashboard - Auth Domain Entity
export interface IUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'attendant' | 'kitchen';
  createdAt: Date;
  updatedAt: Date;
}

export class User implements IUser {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public role: 'admin' | 'attendant' | 'kitchen',
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(data: Omit<IUser, 'createdAt' | 'updatedAt'>): User {
    return new User(
      data.id,
      data.name,
      data.email,
      data.role,
      new Date(),
      new Date()
    );
  }
}

export interface IAuthToken {
  token: string;
  user: IUser;
  expiresIn: number;
}
