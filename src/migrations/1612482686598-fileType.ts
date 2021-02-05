import {MigrationInterface, QueryRunner} from "typeorm";

export class fileType1612482686598 implements MigrationInterface {
    name = 'fileType1612482686598'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stamp_file" DROP COLUMN "fileType"`);
        await queryRunner.query(`ALTER TABLE "stamp_file" ADD "fileType" character varying(20) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stamp_file" DROP COLUMN "fileType"`);
        await queryRunner.query(`ALTER TABLE "stamp_file" ADD "fileType" character varying NOT NULL`);
    }

}
