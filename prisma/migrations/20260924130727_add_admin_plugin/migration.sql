-- AlterTable
ALTER TABLE `auth_user` ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'user',
    ADD COLUMN `banned` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `banReason` TEXT NULL,
    ADD COLUMN `banExpires` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `auth_session` ADD COLUMN `impersonatedBy` VARCHAR(191) NULL;
