import User, { IUserMinimum, IUserRegister, IUserUpdate, IUserSave, getUserMinimum } from "../models/user";
import statusCode, { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { Repository } from "typeorm";
import RoleServices from "./roleServices";
import { CONNECTION } from "..";
import Role, { validRoles } from "../models/role";
import { AbstractService, AbstractServiceError } from ".";

export class UserServiceError extends AbstractServiceError {}

export default class UserServices extends AbstractService<User> {
  async getUserMinById(id: number): Promise<IUserMinimum> {
    const user = await this.repository.findOne(id);

    if (!user) {
      throw new UserServiceError(`User with id ${id} not found`, StatusCodes.NOT_FOUND);
    }

    return getUserMinimum(user);
  }

  async getAllUserMins(limit?: number): Promise<IUserMinimum[]> {
    const users: User[] = await this.repository.find({
      order: { id: "ASC" },
      take: limit || 50,
    });

    if (!users || users.length === 0) {
      throw new UserServiceError("No users available", StatusCodes.NOT_FOUND);
    }
    const userMin = users.map((user) => getUserMinimum(user));

    return userMin;
  }

  async getUserByUsername(name: string): Promise<IUserMinimum> {
    const user = await this.repository.createQueryBuilder().select().where({ username: name }).getOne();

    if (!user) {
      throw new UserServiceError(`User with name ${name} not found`, StatusCodes.NOT_FOUND);
    }

    return getUserMinimum(user);
  }

  async createUser(user: IUserRegister): Promise<IUserMinimum> {
    const roleService = new RoleServices(CONNECTION.getRepository(Role));

    const dbUser = await this.repository.createQueryBuilder().select().where({ username: user.username }).getOne();

    if (dbUser) {
      throw new UserServiceError(`Username ${user.username} already exists`, StatusCodes.BAD_REQUEST);
    }

    if (user.roles) {
      user.roles = await Promise.all(
        user.roles.map(async (role) => {
          if (!role.roleName) {
            throw new UserServiceError("Each role must have a 'roleName' passed", StatusCodes.BAD_REQUEST);
          }
          return await roleService.getByName(role.roleName);
        })
      );
    } else {
      const userRole = await roleService.getByName(validRoles.USER);
      user.roles = [userRole];
    }

    const pass = await bcrypt.hash(user.password, 10);
    user.password = pass;

    const result = await this.repository.save(user);
    return getUserMinimum(result);
  }

  async verifyPasswordAndReturnUser(username: string, password: string): Promise<IUserMinimum> {
    const user = await this.repository.createQueryBuilder().select().where({ username }).getOne();
    if (!user) {
      throw new UserServiceError(`Username ${username} does not exist`, StatusCodes.NOT_FOUND);
    }
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      throw new UserServiceError("Invalid login credentials", StatusCodes.FORBIDDEN);
    }

    return getUserMinimum(user);
  }

  async getFullUserInfoById(id: number): Promise<User> {
    const user = await this.repository.findOne(id);
    if (!user) {
      throw new UserServiceError(`User with id ${id} not found`, statusCode.NOT_FOUND);
    }
    return user;
  }

  async updateUser(user: IUserUpdate, id: number): Promise<IUserMinimum> {
    const newUser = await this.getFullUserInfoById(id);

    if (user.email) {
      throw new UserServiceError("You cannot change your email", StatusCodes.BAD_REQUEST);
    }
    if (user.password) {
      newUser.password = await bcrypt.hash(user.password, 10);
    }
    if (user.roles && user.roles.length > 0) {
    }
    if (user.taxId) {
      newUser.taxId = user.taxId;
    }
    if (user.username) {
      throw new UserServiceError("You cannot change your username", StatusCodes.BAD_REQUEST);
    }

    const updated = await this.repository.save(newUser);
    return getUserMinimum(updated);
  }

  async seedDatabase(): Promise<void> {
    const userCount = await this.repository.createQueryBuilder().getCount();
    if (userCount === 0) {
      const adminUsername = process.env.ADMIN_USERNAME as string;
      const adminPassword = process.env.ADMIN_PASSWORD as string;
      const adminEmail = process.env.ADMIN_EMAIL as string;

      const roleServices = new RoleServices(CONNECTION.getRepository(Role));
      const adminRole = await roleServices.getByName("ADMIN");
      const userRole = await roleServices.getByName("USER");

      await this.createUser({
        email: adminEmail,
        password: adminPassword,
        username: adminUsername,
        roles: [adminRole, userRole],
      });
    }
  }
}