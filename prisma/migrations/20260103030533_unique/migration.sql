/*
  Warnings:

  - A unique constraint covering the columns `[type,subtype]` on the table `FormData` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "FormData" ALTER COLUMN "type" DROP DEFAULT,
ALTER COLUMN "subtype" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "FormData_type_subtype_key" ON "FormData"("type", "subtype");
