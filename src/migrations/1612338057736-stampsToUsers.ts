import {MigrationInterface, QueryRunner} from "typeorm";

export class stampsToUsers1612338057736 implements MigrationInterface {
    name = 'stampsToUsers1612338057736'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stamp" ADD "uploadedUserId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stamp" ADD CONSTRAINT "FK_ded962a0328a91091cfd21e6e27" FOREIGN KEY ("uploadedUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stamp" DROP CONSTRAINT "FK_ded962a0328a91091cfd21e6e27"`);
        await queryRunner.query(`ALTER TABLE "stamp" DROP COLUMN "uploadedUserId"`);
    }

}
