/*
  Warnings:

  - A unique constraint covering the columns `[user_id,title]` on the table `code` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "code_user_id_title_key" ON "code"("user_id", "title");
