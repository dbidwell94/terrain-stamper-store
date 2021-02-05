import {MigrationInterface, QueryRunner} from "typeorm";

export class stampFile1612478324084 implements MigrationInterface {
    name = 'stampFile1612478324084'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stamp_file" DROP CONSTRAINT "FK_5180a04f6671acb46316c1b4a55"`);
        await queryRunner.query(`ALTER TABLE "stamp_file" ADD CONSTRAINT "FK_5180a04f6671acb46316c1b4a55" FOREIGN KEY ("stampId") REFERENCES "stamp"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stamp_file" DROP CONSTRAINT "FK_5180a04f6671acb46316c1b4a55"`);
        await queryRunner.query(`ALTER TABLE "stamp_file" ADD CONSTRAINT "FK_5180a04f6671acb46316c1b4a55" FOREIGN KEY ("stampId") REFERENCES "stamp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
