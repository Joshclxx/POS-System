/*
  Warnings:

  - You are about to drop the column `date` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `productName` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `productPrice` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `shift` table. All the data in the column will be lost.
  - You are about to drop the column `passwod` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productId,size]` on the table `ProductVariant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderDate` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` DROP COLUMN `date`,
    DROP COLUMN `productId`,
    DROP COLUMN `productName`,
    DROP COLUMN `productPrice`,
    ADD COLUMN `orderDate` DATETIME(3) NOT NULL,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `productvariant` ADD COLUMN `size` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `shift` DROP COLUMN `name`,
    ADD COLUMN `shiftType` ENUM('OPENING', 'CLOSING') NOT NULL DEFAULT 'OPENING';

-- AlterTable
ALTER TABLE `user` DROP COLUMN `passwod`,
    ADD COLUMN `password` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `OrderItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `productVariantId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `subtotal` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `ProductVariant_productId_size_key` ON `ProductVariant`(`productId`, `size`);

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_productVariantId_fkey` FOREIGN KEY (`productVariantId`) REFERENCES `ProductVariant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
