-- CreateTable
CREATE TABLE `nguoi_dung` (
    `nguoi_dung_id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `mat_khau` VARCHAR(255) NOT NULL,
    `ho_ten` VARCHAR(255) NULL,
    `tuoi` INTEGER NULL,
    `anh_dai_dien` VARCHAR(255) NULL,

    UNIQUE INDEX `nguoi_dung_email_key`(`email`),
    PRIMARY KEY (`nguoi_dung_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hinh_anh` (
    `hinh_id` INTEGER NOT NULL AUTO_INCREMENT,
    `ten_hinh` VARCHAR(255) NOT NULL,
    `duong_dan` VARCHAR(255) NOT NULL,
    `mo_ta` TEXT NULL,
    `nguoi_dung_id` INTEGER NOT NULL,

    INDEX `hinh_anh_nguoi_dung_id_idx`(`nguoi_dung_id`),
    INDEX `hinh_anh_ten_hinh_idx`(`ten_hinh`),
    PRIMARY KEY (`hinh_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `binh_luan` (
    `binh_luan_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nguoi_dung_id` INTEGER NOT NULL,
    `hinh_id` INTEGER NOT NULL,
    `ngay_binh_luan` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `noi_dung` TEXT NOT NULL,

    INDEX `binh_luan_nguoi_dung_id_idx`(`nguoi_dung_id`),
    INDEX `binh_luan_hinh_id_ngay_binh_luan_idx`(`hinh_id`, `ngay_binh_luan`),
    PRIMARY KEY (`binh_luan_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `luu_anh` (
    `nguoi_dung_id` INTEGER NOT NULL,
    `hinh_id` INTEGER NOT NULL,
    `ngay_luu` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `luu_anh_hinh_id_idx`(`hinh_id`),
    PRIMARY KEY (`nguoi_dung_id`, `hinh_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `hinh_anh` ADD CONSTRAINT `hinh_anh_nguoi_dung_id_fkey` FOREIGN KEY (`nguoi_dung_id`) REFERENCES `nguoi_dung`(`nguoi_dung_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `binh_luan` ADD CONSTRAINT `binh_luan_nguoi_dung_id_fkey` FOREIGN KEY (`nguoi_dung_id`) REFERENCES `nguoi_dung`(`nguoi_dung_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `binh_luan` ADD CONSTRAINT `binh_luan_hinh_id_fkey` FOREIGN KEY (`hinh_id`) REFERENCES `hinh_anh`(`hinh_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `luu_anh` ADD CONSTRAINT `luu_anh_nguoi_dung_id_fkey` FOREIGN KEY (`nguoi_dung_id`) REFERENCES `nguoi_dung`(`nguoi_dung_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `luu_anh` ADD CONSTRAINT `luu_anh_hinh_id_fkey` FOREIGN KEY (`hinh_id`) REFERENCES `hinh_anh`(`hinh_id`) ON DELETE CASCADE ON UPDATE CASCADE;
