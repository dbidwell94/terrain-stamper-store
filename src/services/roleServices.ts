import { StatusCodes } from "http-status-codes";
import Role, { IRoleMin } from "models/role";
import { AbstractService, AbstractServiceError } from "services/index";
import { Repository } from "typeorm";

class RoleServicesError extends AbstractServiceError {}

export default class RoleServices extends AbstractService<Role> {
  constructor(repository: Repository<Role>) {
    super(repository, Role);
  }

  async getAllNames(): Promise<IRoleMin[]> {
    const roles = await this.repository.createQueryBuilder().select().getMany();
    const names: IRoleMin[] = roles.map((role) => {
      const { createdAt, updatedAt, users, ...roleMin } = role;
      return roleMin;
    });
    if (!names || names.length === 0) {
      throw new RoleServicesError("No roles available", StatusCodes.NOT_FOUND);
    }
    return names;
  }

  async getByName(name: string): Promise<Role> {
    const role = await this.repository.createQueryBuilder().select().where({ roleName: name }).getOne();

    if (!role) {
      throw new RoleServicesError(`Role with name ${name} not found`, StatusCodes.NOT_FOUND);
    }
    return role;
  }
}
