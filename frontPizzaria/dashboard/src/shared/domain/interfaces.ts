// Dashboard - Shared Domain
export interface IEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRepository<T> {
  save(entity: T): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  delete(id: string): Promise<void>;
}

export interface IUseCase<Input, Output> {
  execute(input: Input): Promise<Output>;
}
