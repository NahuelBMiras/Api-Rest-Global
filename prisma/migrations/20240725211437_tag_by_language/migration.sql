/*
  Warnings:

  - You are about to drop the column `updated_at` on the `tag_by_language` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tag_by_language" DROP COLUMN "updated_at",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
