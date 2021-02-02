import User, { IUserMinimum, IUserRegister } from "../models/user";
import userRepository from "../repositories/userRepository";
import statusCode, { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";

export class UserServiceError extends Error {
  status: number;
  constructor(message: string, status?: StatusCodes) {
    super(message);
    this.status = status || statusCode.INTERNAL_SERVER_ERROR;
  }
}

export default class UserServices {
  async getUserById(
    id: number,
    shouldFail = true
  ): Promise<IUserMinimum | null> {
    const user = await userRepository.findOne(id);
    if (!user) {
      if (shouldFail) {
        throw new UserServiceError(
          `User with id ${id} not found`,
          StatusCodes.NOT_FOUND
        );
      }
      return null;
    }

    const { password, ...userMin } = user;
    return userMin;
  }

  async getAllUsers(
    limit?: number,
    shouldFail = true
  ): Promise<IUserMinimum[]> {
    const users: User[] = await userRepository
      .createQueryBuilder()
      .select()
      .limit(limit || 50)
      .getMany();

    if (!users || users.length === 0) {
      if (shouldFail) {
        throw new UserServiceError("No users available", StatusCodes.NOT_FOUND);
      }
      return [];
    }
    const userMin: IUserMinimum[] = users.map((user) => {
      const { password, ...min } = user;
      return min;
    });
    return userMin;
  }

  async getUserByUsername(
    name: string,
    shouldFail = true
  ): Promise<IUserMinimum | null> {
    const user = await userRepository
      .createQueryBuilder()
      .select()
      .where({ username: name })
      .getOne();

    if (!user) {
      if (shouldFail) {
        throw new UserServiceError(
          `User with name ${name} not found`,
          StatusCodes.NOT_FOUND
        );
      }
      return null;
    }
    const { password, ...userMin } = user;
    return userMin;
  }

  async createUser(user: IUserRegister): Promise<IUserMinimum> {
    if (this.getUserByUsername(user.username, false)) {
      throw new UserServiceError(
        `Username ${user.username} already exists`,
        StatusCodes.BAD_REQUEST
      );
    }
    const pass = await bcrypt.hash(user.password, 10);
    user.password = pass;
    const result = await userRepository.save(user);
    const { password, ...userMin } = result;
    return userMin;
  }

  async verifyPasswordAndReturnUser(
    userId: number,
    password: string
  ): Promise<IUserMinimum> {
    const user = await userRepository.findOne(userId);
    if (!user) {
      throw new UserServiceError(
        `User with id ${userId} not found`,
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
