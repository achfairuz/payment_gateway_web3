/*
  Warnings:

  - You are about to drop the column `apiKeys` on the `Merchant` table. All the data in the column will be lost.
  - You are about to drop the column `secretKeys` on the `Merchant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[apiKey]` on the table `Merchant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `apiKey` to the `Merchant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secretKey` to the `Merchant` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Merchant_apiKeys_key";

-- AlterTable
ALTER TABLE "Merchant" DROP COLUMN "apiKeys",
DROP COLUMN "secretKeys",
ADD COLUMN     "apiKey" TEXT NOT NULL,
ADD COLUMN     "secretKey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Merchant_apiKey_key" ON "Merchant"("apiKey");
