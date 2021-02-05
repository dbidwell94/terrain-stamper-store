import {MigrationInterface, QueryRunner} from "typeorm";

export class stampFile1612478250087 implements MigrationInterface {
    name = 'stampFile1612478250087'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stamp_file" DROP CONSTRAINT "FK_5180a04f6671acb46316c1b4a55"`);
        await queryRunner.query(`ALTER TABLE "stamp_file" ALTER COLUMN "stampId" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "stamp_file"."stampId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "stamp_file" ADD CONSTRAINT "FK_5180a04f6671acb46316c1b4a55" FOREIGN KEY ("stampId") REFERENCES "stamp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stamp_file" DROP CONSTRAINT "FK_5180a04f6671acb46316c1b4a55"`);
        await queryRunner.query(`COMMENT ON COLUMN "stamp_file"."stampId" IS NULL`);
        await queryRunner.query(`ALTER TABLE "stamp_file" ALTER COLUMN "stampId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stamp_file" ADD CONSTRAINT "FK_5180a04f6671acb46316c1b4a55" FOREIGN KEY ("stampId") REFERENCES "stamp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
