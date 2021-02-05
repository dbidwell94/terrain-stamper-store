import {MigrationInterface, QueryRunner} from "typeorm";

export class columnLength1612480797439 implements MigrationInterface {
    name = 'columnLength1612480797439'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "package" ADD "description" bit varying(150) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "package" DROP COLUMN "description"`);
    }

}
