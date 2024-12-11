import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1733794876626 implements MigrationInterface {
    name = 'InitialSchema1733794876626'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        await queryRunner.query(`CREATE TABLE "user" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "email" character varying NOT NULL,
            "password" character varying NOT NULL,
            "full_name" character varying NOT NULL,
            CONSTRAINT "UQ_user_email" UNIQUE ("email"),
            CONSTRAINT "PK_user" PRIMARY KEY ("id")
        )`);

        await queryRunner.query(`CREATE TABLE "category" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "name" character varying NOT NULL,
            "icon" character varying,
            "color" character varying,
            "user_id" uuid NOT NULL,
            CONSTRAINT "PK_category" PRIMARY KEY ("id"),
            CONSTRAINT "FK_category_user" FOREIGN KEY ("user_id") 
                REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        )`);

        await queryRunner.query(`CREATE TABLE "expense" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "amount" numeric(10,2) NOT NULL,
            "description" character varying,
            "date" TIMESTAMP NOT NULL,
            "category_id" uuid NOT NULL,
            "user_id" uuid NOT NULL,
            CONSTRAINT "PK_expense" PRIMARY KEY ("id"),
            CONSTRAINT "FK_expense_category" FOREIGN KEY ("category_id") 
                REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
            CONSTRAINT "FK_expense_user" FOREIGN KEY ("user_id") 
                REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "expense"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp"`);
    }
} 