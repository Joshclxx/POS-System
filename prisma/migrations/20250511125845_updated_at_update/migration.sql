/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `updatedAt`;

-- AlterTable
ALTER TABLE `product` MODIFY `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `productvariant` MODIFY `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `updatedAt` DATETIME(3) NULL;
