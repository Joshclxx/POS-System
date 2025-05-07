/*
  Warnings:

  - You are about to drop the `shift` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `OrderItem` DROP FOREIGN KEY `OrderItem_productVariantId_fkey`;

-- DropForeignKey
ALTER TABLE `shift` DROP FOREIGN KEY `Shift_userId_fkey`;

-- DropIndex
DROP INDEX `OrderItem_productVariantId_fkey` ON `OrderItem`;

-- DropTable
DROP TABLE `shift`;

-- CreateTable
CREATE TABLE `Shift` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shiftType` ENUM('OPENING', 'CLOSING') NOT NULL DEFAULT 'OPENING',
    `shiftIn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `shiftOut` DATETIME(3) NULL,
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Shift` ADD CONSTRAINT `Shift_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_productVariantId_fkey` FOREIGN KEY (`productVariantId`) REFERENCES `ProductVariant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
