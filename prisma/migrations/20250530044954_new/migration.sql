/*
  Warnings:

  - Added the required column `loggedInAt` to the `LoginHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `loginhistory` ADD COLUMN `loggedInAt` VARCHAR(191) NOT NULL;
