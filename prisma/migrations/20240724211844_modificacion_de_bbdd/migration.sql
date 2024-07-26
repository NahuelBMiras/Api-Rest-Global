-- CreateTable
CREATE TABLE "role" (
    "user_role_id" SERIAL NOT NULL,
    "role" VARCHAR(10) NOT NULL DEFAULT 'user',

    CONSTRAINT "role_pkey" PRIMARY KEY ("user_role_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "name" VARCHAR(40) NOT NULL,
    "lastname" VARCHAR(40) NOT NULL,
    "email" VARCHAR(80) NOT NULL,
    "username" VARCHAR(80) NOT NULL,
    "password" VARCHAR(72) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "role_id" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "code" (
    "code_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "explanation" VARCHAR(300) NOT NULL,

    CONSTRAINT "code_pkey" PRIMARY KEY ("code_id")
);

-- CreateTable
CREATE TABLE "tag" (
    "tag_id" SERIAL NOT NULL,
    "tag" VARCHAR(30) NOT NULL,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("tag_id")
);

-- CreateTable
CREATE TABLE "code_tag" (
    "code_tag_id" SERIAL NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "code_id" INTEGER NOT NULL,

    CONSTRAINT "code_tag_pkey" PRIMARY KEY ("code_tag_id")
);

-- CreateTable
CREATE TABLE "favorites_or_saved" (
    "saved_code_id" SERIAL NOT NULL,
    "FavoritesOrSaved" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_or_saved_pkey" PRIMARY KEY ("saved_code_id")
);

-- CreateTable
CREATE TABLE "favorites_and_saved_code" (
    "favorites_and_saved_code_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "code_id" INTEGER NOT NULL,
    "favorites_or_saved_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_and_saved_code_pkey" PRIMARY KEY ("favorites_and_saved_code_id")
);

-- CreateTable
CREATE TABLE "language" (
    "language_id" SERIAL NOT NULL,
    "language" VARCHAR(30) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "language_pkey" PRIMARY KEY ("language_id")
);

-- CreateTable
CREATE TABLE "code_language" (
    "code_language_id" SERIAL NOT NULL,
    "language_id" INTEGER NOT NULL,
    "code_id" INTEGER NOT NULL,
    "explanation" VARCHAR(8000) NOT NULL,
    "url_aws" VARCHAR(150) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "code_language_pkey" PRIMARY KEY ("code_language_id")
);

-- CreateTable
CREATE TABLE "tag_by_language" (
    "tag_by_language_id" SERIAL NOT NULL,
    "tag_by_language" VARCHAR(20) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "language_id" INTEGER NOT NULL,

    CONSTRAINT "tag_by_language_pkey" PRIMARY KEY ("tag_by_language_id")
);

-- CreateTable
CREATE TABLE "code_language_tag" (
    "code_language_tag_id" SERIAL NOT NULL,
    "tag_by_language_id" INTEGER NOT NULL,
    "code_language_id" INTEGER NOT NULL,

    CONSTRAINT "code_language_tag_pkey" PRIMARY KEY ("code_language_tag_id")
);

-- CreateTable
CREATE TABLE "comments_code_languaje" (
    "comments_code_languaje_id" SERIAL NOT NULL,
    "code_language_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "comments" VARCHAR(700) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_code_languaje_pkey" PRIMARY KEY ("comments_code_languaje_id")
);

-- CreateTable
CREATE TABLE "comments_code" (
    "comments_code_id" SERIAL NOT NULL,
    "code_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "comments" VARCHAR(700) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_code_pkey" PRIMARY KEY ("comments_code_id")
);

-- CreateTable
CREATE TABLE "line_explanation" (
    "line_explanation_id" SERIAL NOT NULL,
    "line_explanation" VARCHAR(8000) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "line_explanation_pkey" PRIMARY KEY ("line_explanation_id")
);

-- CreateTable
CREATE TABLE "code_language_line_explanation" (
    "code_language_line_explanation_id" SERIAL NOT NULL,
    "code_language_line_number_id" INTEGER NOT NULL,
    "line_explanation" INTEGER NOT NULL,
    "line_start" INTEGER NOT NULL,
    "line_end" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "code_language_line_explanation_pkey" PRIMARY KEY ("code_language_line_explanation_id")
);

-- CreateTable
CREATE TABLE "line_explanation_history" (
    "line_explanation_history_id" SERIAL NOT NULL,
    "line_explanation_history" VARCHAR(8000) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "line_explanation_history_pkey" PRIMARY KEY ("line_explanation_history_id")
);

-- CreateTable
CREATE TABLE "code_history_line_explanation" (
    "code_history_line_explanation_id" SERIAL NOT NULL,
    "code_language_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "code_history_line_explanation_pkey" PRIMARY KEY ("code_history_line_explanation_id")
);

-- CreateTable
CREATE TABLE "code_history" (
    "code_history_id" SERIAL NOT NULL,
    "code_language_id" INTEGER NOT NULL,
    "code_history_line_explanation_id" INTEGER NOT NULL,
    "explanation_history" VARCHAR(8000) NOT NULL,
    "url_aws" VARCHAR(150) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "code_history_pkey" PRIMARY KEY ("code_history_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_name_idx" ON "users"("name");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "code_explanation_key" ON "code"("explanation");

-- CreateIndex
CREATE UNIQUE INDEX "tag_tag_key" ON "tag"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_or_saved_FavoritesOrSaved_key" ON "favorites_or_saved"("FavoritesOrSaved");

-- CreateIndex
CREATE UNIQUE INDEX "language_language_key" ON "language"("language");

-- CreateIndex
CREATE UNIQUE INDEX "code_language_explanation_key" ON "code_language"("explanation");

-- CreateIndex
CREATE UNIQUE INDEX "code_language_url_aws_key" ON "code_language"("url_aws");

-- CreateIndex
CREATE UNIQUE INDEX "code_language_code_id_language_id_key" ON "code_language"("code_id", "language_id");

-- CreateIndex
CREATE UNIQUE INDEX "tag_by_language_tag_by_language_key" ON "tag_by_language"("tag_by_language");

-- CreateIndex
CREATE UNIQUE INDEX "line_explanation_line_explanation_key" ON "line_explanation"("line_explanation");

-- CreateIndex
CREATE UNIQUE INDEX "line_explanation_history_line_explanation_history_key" ON "line_explanation_history"("line_explanation_history");

-- CreateIndex
CREATE UNIQUE INDEX "code_history_explanation_history_key" ON "code_history"("explanation_history");

-- CreateIndex
CREATE UNIQUE INDEX "code_history_url_aws_key" ON "code_history"("url_aws");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("user_role_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "code" ADD CONSTRAINT "code_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "code_tag" ADD CONSTRAINT "code_tag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tag"("tag_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "code_tag" ADD CONSTRAINT "code_tag_code_id_fkey" FOREIGN KEY ("code_id") REFERENCES "code"("code_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites_and_saved_code" ADD CONSTRAINT "favorites_and_saved_code_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites_and_saved_code" ADD CONSTRAINT "favorites_and_saved_code_code_id_fkey" FOREIGN KEY ("code_id") REFERENCES "code"("code_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites_and_saved_code" ADD CONSTRAINT "favorites_and_saved_code_favorites_or_saved_id_fkey" FOREIGN KEY ("favorites_or_saved_id") REFERENCES "favorites_or_saved"("saved_code_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "code_language" ADD CONSTRAINT "code_language_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "language"("language_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "code_language" ADD CONSTRAINT "code_language_code_id_fkey" FOREIGN KEY ("code_id") REFERENCES "code"("code_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag_by_language" ADD CONSTRAINT "tag_by_language_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "language"("language_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "code_language_tag" ADD CONSTRAINT "code_language_tag_tag_by_language_id_fkey" FOREIGN KEY ("tag_by_language_id") REFERENCES "tag_by_language"("tag_by_language_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "code_language_tag" ADD CONSTRAINT "code_language_tag_code_language_id_fkey" FOREIGN KEY ("code_language_id") REFERENCES "code_language"("code_language_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments_code_languaje" ADD CONSTRAINT "comments_code_languaje_code_language_id_fkey" FOREIGN KEY ("code_language_id") REFERENCES "code_language"("code_language_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments_code_languaje" ADD CONSTRAINT "comments_code_languaje_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments_code" ADD CONSTRAINT "comments_code_code_id_fkey" FOREIGN KEY ("code_id") REFERENCES "code"("code_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments_code" ADD CONSTRAINT "comments_code_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "code_language_line_explanation" ADD CONSTRAINT "code_language_line_explanation_code_language_line_number_i_fkey" FOREIGN KEY ("code_language_line_number_id") REFERENCES "code_language"("code_language_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "code_language_line_explanation" ADD CONSTRAINT "code_language_line_explanation_line_explanation_fkey" FOREIGN KEY ("line_explanation") REFERENCES "line_explanation"("line_explanation_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "code_history_line_explanation" ADD CONSTRAINT "code_history_line_explanation_code_language_id_fkey" FOREIGN KEY ("code_language_id") REFERENCES "line_explanation_history"("line_explanation_history_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "code_history" ADD CONSTRAINT "code_history_code_language_id_fkey" FOREIGN KEY ("code_language_id") REFERENCES "code_language"("code_language_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "code_history" ADD CONSTRAINT "code_history_code_history_line_explanation_id_fkey" FOREIGN KEY ("code_history_line_explanation_id") REFERENCES "code_history_line_explanation"("code_history_line_explanation_id") ON DELETE CASCADE ON UPDATE CASCADE;
