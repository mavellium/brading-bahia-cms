/*
  Warnings:

  - A unique constraint covering the columns `[subtype]` on the table `FormData` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "FormData" ADD COLUMN     "subtype" TEXT NOT NULL DEFAULT 'default',
ALTER COLUMN "type" SET DEFAULT 'default';

-- CreateIndex
CREATE UNIQUE INDEX "FormData_subtype_key" ON "FormData"("subtype");
