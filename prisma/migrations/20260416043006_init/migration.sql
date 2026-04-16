-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'EMPLOYEE') NOT NULL DEFAULT 'EMPLOYEE',
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    INDEX `user_role_idx`(`role`),
    INDEX `user_is_active_idx`(`is_active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employee` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `employee_code` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `department` VARCHAR(191) NULL,
    `position` VARCHAR(191) NULL,
    `join_date` DATETIME(3) NULL,
    `address` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `employee_user_id_key`(`user_id`),
    UNIQUE INDEX `employee_employee_code_key`(`employee_code`),
    INDEX `employee_full_name_idx`(`full_name`),
    INDEX `employee_department_idx`(`department`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attendance` (
    `id` VARCHAR(191) NOT NULL,
    `employee_id` VARCHAR(191) NOT NULL,
    `work_date` DATETIME(3) NOT NULL,
    `check_in_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `photo_check_in_url` VARCHAR(191) NOT NULL,
    `check_in_note` VARCHAR(191) NULL,
    `check_out_at` DATETIME(3) NULL,
    `photo_check_out_url` VARCHAR(191) NULL,
    `check_out_note` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `attendance_work_date_idx`(`work_date`),
    INDEX `attendance_employee_id_idx`(`employee_id`),
    UNIQUE INDEX `attendance_employee_id_work_date_key`(`employee_id`, `work_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `employee` ADD CONSTRAINT `employee_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendance` ADD CONSTRAINT `attendance_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
