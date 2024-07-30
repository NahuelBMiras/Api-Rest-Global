/*
  Warnings:

  - A unique constraint covering the columns `[tag_by_language_id,code_language_id]` on the table `code_language_tag` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tag_id,code_id]` on the table `code_tag` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "code_language_tag_tag_by_language_id_code_language_id_key" ON "code_language_tag"("tag_by_language_id", "code_language_id");

-- CreateIndex
CREATE UNIQUE INDEX "code_tag_tag_id_code_id_key" ON "code_tag"("tag_id", "code_id");
