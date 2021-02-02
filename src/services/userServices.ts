import User, { IUserMinimum, IUserRegister } from "../models/user";
import statusCode, { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { Repository } from "typeorm";

export class UserServiceError extends Error {
  status: number;
  constructor(message: string, status?: StatusCodes) {
    super(message);
    this.status = status || statusCode.INTERNAL_SERVER_ERROR;
  }
}

export default class UserServices {
  private readonly repository: Repository<User>;

  constructor(userRepository: Repository<User>) {
    this.repository = userRepository;
  }

  async getUserById(id: number): Promise<IUserMinimum | null> {
    const user = await this.repository.findOne(id);
    if (!user) {
      throw new UserServiceError(
        `User with id ${id} not found`,
        StatusCodes.NOT_FOUND
      );
    }

    const { password, ...userMin } = user;
    return userMin;
  }

  async getAllUsers(limit?: number): Promise<IUserMinimum[]> {
    const users: User[] = await this.repository
      .createQueryBuilder()
      .select()
      .limit(limit || 50)
      .getMany();

    if (!users || users.length === 0) {
      throw new UserServiceError("No users available", StatusCodes.NOT_FOUND);
    }
    const userMin: IUserMinimum[] = users.map((user) => {
      const { password, ...min } = user;
      return min;
    });
    return userMin;
  }

  async getUserByUsername(name: string): Promise<IUserMinimum | null> {
    const user = await this.repository
      .createQueryBuilder()
      .select()
      .where({ username: name })
      .getOne();

    if (!user) {
      throw new UserServiceError(
        `User with name ${name} not found`,
        StatusCodes.NOT_FOUND
      );
    }
    const { password, ...userMin } = user;
    return userMin;
  }

  async createUser(user: IUserRegister): Promise<IUserMinimum> {
    const dbUser = await this.repository
      .createQueryBuilder()
      .select()
      .where({ username: user.username })
      .getOne();

    if (dbUser) {
      throw new UserServiceError(
        `Username ${user.username} already exists`,
        StatusCodes.BAD_REQUEST
      );
    }

    const pass = await bcrypt.hash(user.password, 10);
    user.password = pass;
    const result = await this.repository.save(user);
    const { password, ...userMin } = result;
    return userMin;
  }

  async verifyPasswordAndReturnUser(
    username: string,
    password: string
  ): Promise<IUserMinimum> {
    const user = await this.repository
      .createQueryBuilder()
      .select()
      .where({ username })
      .getOne();
    if (!user) {
      throw new UserServiceError(
        `Username ${username} does not exist`,
        StatusCodes.NOT_FOUND
      );
    }
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      throw new UserServiceError(
        "Invalid login credentials",
        StatusCodes.FORBIDDEN
      );
    }

    const { password: _, ...userMin } = user;
    return userMin;
  }
}
