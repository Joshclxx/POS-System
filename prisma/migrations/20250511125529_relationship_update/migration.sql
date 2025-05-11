/*
  Warnings:

  - You are about to drop the column `voidedId` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `cashpickId` on the `shift` table. All the data in the column will be lost.
  - You are about to drop the column `voidedId` on the `shift` table. All the data in the column will be lost.
  - You are about to drop the column `cashpickId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `shiftId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `spotCheckId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `shiftid` on the `voidedorder` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email,password]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderId]` on the table `VoidedOrder` will be added. If there are existing duplicate values, this will fail.
  - Made the column `shiftOut` on table `shift` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `amount` to the `VoidedOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `VoidedOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shiftId` to the `VoidedOrder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_voidedId_fkey`;

-- DropForeignKey
ALTER TABLE `shift` DROP FOREIGN KEY `Shift_cashpickId_fkey`;

-- DropForeignKey
ALTER TABLE `shift` DROP FOREIGN KEY `Shift_voidedId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_cashpickId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_shiftId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_spotCheckId_fkey`;

-- DropIndex
DROP INDEX `Order_voidedId_fkey` ON `order`;

-- DropIndex
DROP INDEX `Shift_cashpickId_fkey` ON `shift`;

-- DropIndex
DROP INDEX `Shift_voidedId_fkey` ON `shift`;

-- DropIndex
DROP INDEX `User_cashpickId_fkey` ON `user`;

-- DropIndex
DROP INDEX `User_id_email_password_key` ON `user`;

-- DropIndex
DROP INDEX `User_shiftId_fkey` ON `user`;

-- DropIndex
DROP INDEX `User_spotCheckId_fkey` ON `user`;

-- AlterTable
ALTER TABLE `cashpick` MODIFY `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `voidedId`,
    ADD COLUMN `voidedOrderId` INTEGER NULL;

-- AlterTable
ALTER TABLE `shift` DROP COLUMN `cashpickId`,
    DROP COLUMN `voidedId`,
    MODIFY `shiftOut` DATETIME(3) NOT NULL,
    MODIFY `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `spotcheck` MODIFY `userid` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `cashpickId`,
    DROP COLUMN `shiftId`,
    DROP COLUMN `spotCheckId`;

-- AlterTable
ALTER TABLE `voidedorder` DROP COLUMN `shiftid`,
    ADD COLUMN `amount` DOUBLE NOT NULL,
    ADD COLUMN `orderId` INTEGER NOT NULL,
    ADD COLUMN `shiftId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_email_password_key` ON `User`(`email`, `password`);

-- CreateIndex
CREATE UNIQUE INDEX `VoidedOrder_orderId_key` ON `VoidedOrder`(`orderId`);

-- AddForeignKey
ALTER TABLE `Shift` ADD CONSTRAINT `Shift_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cashpick` ADD CONSTRAINT `Cashpick_shiftId_fkey` FOREIGN KEY (`shiftId`) REFERENCES `Shift`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cashpick` ADD CONSTRAINT `Cashpick_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Spotcheck` ADD CONSTRAINT `Spotcheck_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VoidedOrder` ADD CONSTRAINT `VoidedOrder_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VoidedOrder` ADD CONSTRAINT `VoidedOrder_shiftId_fkey` FOREIGN KEY (`shiftId`) REFERENCES `Shift`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
