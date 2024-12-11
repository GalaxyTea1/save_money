-- Tạo extension uuid-ossp
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tạo bảng user
CREATE TABLE "user" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "email" character varying NOT NULL,
    "password" character varying NOT NULL,
    "full_name" character varying NOT NULL,
    CONSTRAINT "UQ_user_email" UNIQUE ("email"),
    CONSTRAINT "PK_user" PRIMARY KEY ("id")
);

-- Tạo bảng category
CREATE TABLE "category" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "name" character varying NOT NULL,
    "icon" character varying,
    "color" character varying,
    "user_id" uuid NOT NULL,
    CONSTRAINT "PK_category" PRIMARY KEY ("id"),
    CONSTRAINT "FK_category_user" FOREIGN KEY ("user_id") 
        REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Tạo bảng expense
CREATE TABLE "expense" (
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
);