import { Repository } from "typeorm";
import { StatusCodes } from "http-status-codes";
import { IModel } from "../models/index";

export interface IService<T> {
  getById(id: number): Promise<T>;
  getAll(limit?: number): Promise<T[]>;
  create(toAdd: T): Promise<T>;
}

export abstract class AbstractServiceError extends Error {
  private readonly status: StatusCodes;
  constructor(message: string, status?: StatusCodes) {
    super(message);
    this.status = status || StatusCodes.INTERNAL_SERVER_ERROR;
  }
}

class ServiceError extends AbstractServiceError {}

export abstract class AbstractService<T extends IModel> implements IService<T> {
  protected readonly repository: Repository<T>;
  private readonly entityClass: new () => T;
  constructor(repository: Repository<T>, entityClass: new () => T) {
    this.repository = repository;
    this.entityClass = entityClass;
  }

  async getById(id: number): Promise<T> {
    const toReturn = await this.repository.findOne(id);
    if (!toReturn) {
      throw new ServiceError(`${this.entityClass.name} with id ${id} not found`, StatusCodes.NOT_FOUND);
    }
    return toReturn;
  }

  async getAll(limit?: number): Promise<T[]> {
    const toReturn = await this.repository
      .createQueryBuilder()
      .select()
      .limit(limit || 50)
      .getMany();
    if (!toReturn || toReturn.length === 0) {
      throw new ServiceError(`No ${this.entityClass.name}s available`, StatusCodes.NOT_FOUND);
    }
    return toReturn;
  }

  async create(toAdd: T): Promise<T> {
    const toReturn = await this.repository.save(toAdd);

    return toAdd;
  }
}
