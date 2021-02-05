import {MigrationInterface, QueryRunner} from "typeorm";

export class fileType1612482628365 implements MigrationInterface {
    name = 'fileType1612482628365'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stamp_file" ADD "fileType" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stamp_file" DROP COLUMN "fileType"`);
    }

}
