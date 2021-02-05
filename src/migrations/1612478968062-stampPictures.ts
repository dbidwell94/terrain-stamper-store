import {MigrationInterface, QueryRunner} from "typeorm";

export class stampPictures1612478968062 implements MigrationInterface {
    name = 'stampPictures1612478968062'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "stamp_picture" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "fileLocation" character varying NOT NULL, "stampId" integer, CONSTRAINT "PK_e8ff9a95e51b69f0a4c8ea1563c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "stamp_picture" ADD CONSTRAINT "FK_77072303192686c7aad8bcdb2be" FOREIGN KEY ("stampId") REFERENCES "stamp"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stamp_picture" DROP CONSTRAINT "FK_77072303192686c7aad8bcdb2be"`);
        await queryRunner.query(`DROP TABLE "stamp_picture"`);
    }

}
