/*
  Warnings:

  - You are about to drop the column `shiftIn` on the `shift` table. All the data in the column will be lost.
  - You are about to drop the column `shiftOut` on the `shift` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[loginHistoryId]` on the table `Shift` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `loginHistoryId` to the `Shift` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `shift` DROP COLUMN `shiftIn`,
    DROP COLUMN `shiftOut`,
    ADD COLUMN `loginHistoryId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `LoginHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `timeIn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `timeOut` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Shift_loginHistoryId_key` ON `Shift`(`loginHistoryId`);

-- AddForeignKey
ALTER TABLE `Shift` ADD CONSTRAINT `Shift_loginHistoryId_fkey` FOREIGN KEY (`loginHistoryId`) REFERENCES `LoginHistory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LoginHistory` ADD CONSTRAINT `LoginHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
