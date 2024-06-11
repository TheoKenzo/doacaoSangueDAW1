/*
  Warnings:

  - Made the column `hora` on table `Doacao` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Doacao" ALTER COLUMN "data" SET DATA TYPE TEXT,
ALTER COLUMN "hora" SET NOT NULL,
ALTER COLUMN "hora" DROP DEFAULT,
ALTER COLUMN "hora" SET DATA TYPE TEXT;
