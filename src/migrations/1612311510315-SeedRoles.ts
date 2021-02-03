import { MigrationInterface, QueryRunner, getConnection } from "typeorm";
import Role from "models/role";

const roleNames = ["ADMIN", "USER", "COMPANY_OWNER", "COMPANY_ADMIN"];

export class SeedRoles1612311510315 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await getConnection()
      .createQueryBuilder(queryRunner)
      .insert()
      .into(Role)
      .values(
        roleNames.map((name) => {
          return { roleName: name };
        })
      )
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await getConnection()
      .createQueryBuilder(queryRunner)
      .delete()
      .from(Role)
      .where(
        roleNames.map((name) => {
          return { roleName: name };
        })
      )
      .execute();
  }
}
