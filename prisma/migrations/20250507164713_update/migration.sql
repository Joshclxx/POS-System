-- DropForeignKey
ALTER TABLE `orderitem` DROP FOREIGN KEY `OrderItem_productVariantId_fkey`;

-- DropIndex
DROP INDEX `OrderItem_productVariantId_fkey` ON `orderitem`;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_productVariantId_fkey` FOREIGN KEY (`productVariantId`) REFERENCES `ProductVariant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
