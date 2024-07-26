/*
  Warnings:

  - You are about to drop the column `updated_at` on the `language` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "language" DROP COLUMN "updated_at",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
