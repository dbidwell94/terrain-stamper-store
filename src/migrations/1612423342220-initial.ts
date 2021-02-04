import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1612423342220 implements MigrationInterface {
    name = 'initial1612423342220'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "package" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "UQ_b23e12326a4218d09bd72301aa1" UNIQUE ("name"), CONSTRAINT "PK_308364c66df656295bc4ec467c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stamp" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "stampType" character varying NOT NULL, "locationUrl" character varying NOT NULL, "price" numeric NOT NULL, "uploadedUserId" integer NOT NULL, "packageId" integer, CONSTRAINT "UQ_25523fadc42c2af909baa4ea5f3" UNIQUE ("locationUrl"), CONSTRAINT "PK_0b2326ba7cef056b0cb0405190f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "purchase" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "paymentId" character varying NOT NULL, "userId" integer NOT NULL, "stampId" integer NOT NULL, CONSTRAINT "PK_86cc2ebeb9e17fc9c0774b05f69" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "roleName" character varying NOT NULL, CONSTRAINT "UQ_a6142dcc61f5f3fb2d6899fa264" UNIQUE ("roleName"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "username" character varying(25) NOT NULL, "password" character varying NOT NULL, "email" character varying NOT NULL, "taxId" character varying, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_9e92f5e064fa686d21642e88ceb" UNIQUE ("taxId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "company" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "taxId" character varying NOT NULL, "phoneNumber" character varying, "address" character varying, "country" character varying, CONSTRAINT "UQ_a76c5cd486f7779bd9c319afd27" UNIQUE ("name"), CONSTRAINT "UQ_8f27097d20aeb9d019f40944e82" UNIQUE ("taxId"), CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stampCategories" ("stampId" integer NOT NULL, "categoryId" integer NOT NULL, CONSTRAINT "PK_ce08871a6295edd0ea6ae9ac8ee" PRIMARY KEY ("stampId", "categoryId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_25bef0b2e1b9547294e34c5062" ON "stampCategories" ("stampId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4c57789cc4970a41e54a48f7fb" ON "stampCategories" ("categoryId") `);
        await queryRunner.query(`CREATE TABLE "userRoles" ("userId" integer NOT NULL, "roleId" integer NOT NULL, CONSTRAINT "PK_046d21329e72c0aedd207bbcdb1" PRIMARY KEY ("userId", "roleId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fdf65c16d62910b4785a18cdfc" ON "userRoles" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5760f2a1066eb90b4c223c16a1" ON "userRoles" ("roleId") `);
        await queryRunner.query(`ALTER TABLE "stamp" ADD CONSTRAINT "FK_ded962a0328a91091cfd21e6e27" FOREIGN KEY ("uploadedUserId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "stamp" ADD CONSTRAINT "FK_b4252c7acd8ded55cc7bae8521e" FOREIGN KEY ("packageId") REFERENCES "package"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD CONSTRAINT "FK_33520b6c46e1b3971c0a649d38b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD CONSTRAINT "FK_0325218fb4c9ebea49bd2d60d6e" FOREIGN KEY ("stampId") REFERENCES "stamp"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "stampCategories" ADD CONSTRAINT "FK_25bef0b2e1b9547294e34c50623" FOREIGN KEY ("stampId") REFERENCES "stamp"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stampCategories" ADD CONSTRAINT "FK_4c57789cc4970a41e54a48f7fbc" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "userRoles" ADD CONSTRAINT "FK_fdf65c16d62910b4785a18cdfce" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "userRoles" ADD CONSTRAINT "FK_5760f2a1066eb90b4c223c16a10" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "userRoles" DROP CONSTRAINT "FK_5760f2a1066eb90b4c223c16a10"`);
        await queryRunner.query(`ALTER TABLE "userRoles" DROP CONSTRAINT "FK_fdf65c16d62910b4785a18cdfce"`);
        await queryRunner.query(`ALTER TABLE "stampCategories" DROP CONSTRAINT "FK_4c57789cc4970a41e54a48f7fbc"`);
        await queryRunner.query(`ALTER TABLE "stampCategories" DROP CONSTRAINT "FK_25bef0b2e1b9547294e34c50623"`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "FK_0325218fb4c9ebea49bd2d60d6e"`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP CONSTRAINT "FK_33520b6c46e1b3971c0a649d38b"`);
        await queryRunner.query(`ALTER TABLE "stamp" DROP CONSTRAINT "FK_b4252c7acd8ded55cc7bae8521e"`);
        await queryRunner.query(`ALTER TABLE "stamp" DROP CONSTRAINT "FK_ded962a0328a91091cfd21e6e27"`);
        await queryRunner.query(`DROP INDEX "IDX_5760f2a1066eb90b4c223c16a1"`);
        await queryRunner.query(`DROP INDEX "IDX_fdf65c16d62910b4785a18cdfc"`);
        await queryRunner.query(`DROP TABLE "userRoles"`);
        await queryRunner.query(`DROP INDEX "IDX_4c57789cc4970a41e54a48f7fb"`);
        await queryRunner.query(`DROP INDEX "IDX_25bef0b2e1b9547294e34c5062"`);
        await queryRunner.query(`DROP TABLE "stampCategories"`);
        await queryRunner.query(`DROP TABLE "company"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "purchase"`);
        await queryRunner.query(`DROP TABLE "stamp"`);
        await queryRunner.query(`DROP TABLE "package"`);
        await queryRunner.query(`DROP TABLE "category"`);
    }

}
