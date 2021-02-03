import { getConnection, MigrationInterface, QueryRunner } from "typeorm";
import Role, { validRoles } from "../models/role";

const roles = Object.keys(validRoles).map((role) => {
  return { roleName: role };
});

export class seedData1612329448677 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await getConnection().getRepository(Role).insert(roles);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await getConnection().getRepository(Role).createQueryBuilder().delete().where(roles).execute();
  }
}
