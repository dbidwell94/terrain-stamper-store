import {MigrationInterface, QueryRunner} from "typeorm";

export class stampModificatinos1612479972370 implements MigrationInterface {
    name = 'stampModificatinos1612479972370'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stamp" ADD "isReleased" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "stamp" ADD "releaseDate" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stamp" DROP COLUMN "releaseDate"`);
        await queryRunner.query(`ALTER TABLE "stamp" DROP COLUMN "isReleased"`);
    }

}
