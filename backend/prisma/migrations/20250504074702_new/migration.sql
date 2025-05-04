/*
  Warnings:

  - You are about to drop the column `imageAlt` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `imageSrc` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `imageTitle` on the `product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id,email,password]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `User_email_key` ON `user`;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `imageAlt`,
    DROP COLUMN `imageSrc`,
    DROP COLUMN `imageTitle`;

-- AlterTable
ALTER TABLE `user` ALTER COLUMN `role` DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX `User_id_email_password_key` ON `User`(`id`, `email`, `password`);
