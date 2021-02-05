import {MigrationInterface, QueryRunner} from "typeorm";

export class updatedNames1612478609491 implements MigrationInterface {
    name = 'updatedNames1612478609491'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stamp" RENAME COLUMN "locationUrl" TO "folderLocation"`);
        await queryRunner.query(`ALTER TABLE "stamp" RENAME CONSTRAINT "UQ_25523fadc42c2af909baa4ea5f3" TO "UQ_8a16e86f9d92b87d28c0d47b892"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stamp" RENAME CONSTRAINT "UQ_8a16e86f9d92b87d28c0d47b892" TO "UQ_25523fadc42c2af909baa4ea5f3"`);
        await queryRunner.query(`ALTER TABLE "stamp" RENAME COLUMN "folderLocation" TO "locationUrl"`);
    }

}
