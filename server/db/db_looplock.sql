CREATE DATABASE IF NOT EXISTS db_looplock;

USE db_looplock;

CREATE TABLE IF NOT EXISTS `user` (
    `user_id` INT NOT NULL AUTO_INCREMENT,
    `user_username` VARCHAR(255) NOT NULL,
    `user_email` VARCHAR(200) NOT NULL,
    `user_master_password` VARCHAR(255) NOT NULL,
    `created_at` DATETIME NOT NULL,
    `updated_at` DATETIME NOT NULL,
    CONSTRAINT `user_pk` PRIMARY KEY (`user_id`)
);

CREATE TABLE IF NOT EXISTS `credential` (
    `credential_id` BIGINT NOT NULL AUTO_INCREMENT,
    `credential_name` VARCHAR(100) NOT NULL,
	`credential_username` VARCHAR(100) DEFAULT NULL,
    `credential_password` VARCHAR(162) DEFAULT NULL,
    `credential_domain` VARCHAR(100) DEFAULT NULL,
    `credential_slug` VARCHAR(200) NOT NULL,
	`created_at` DATETIME NOT NULL,
    `updated_at` DATETIME NOT NULL,
    `user_id` INT NOT NULL,
    CONSTRAINT `fk_user_credential` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE,
	CONSTRAINT `credential_pk` PRIMARY KEY (`credential_id`)
);

CREATE TABLE IF NOT EXISTS `security` (
    `security_id` BIGINT NOT NULL AUTO_INCREMENT,
	`security_event_type` VARCHAR(100) NOT NULL,
    `status` VARCHAR(10) NOT NULL,
    `user_id` INT NOT NULL,
    `timestamp` DATETIME NOT NULL,
    CONSTRAINT `fk_user_security` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`),
	CONSTRAINT `security_pk` PRIMARY KEY (`security_id`)
);

CREATE TABLE IF NOT EXISTS `recovery` (
    `recovery_id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `used` BOOLEAN DEFAULT 0, 
    `token` VARCHAR(8) NOT NULL,
    `expires_at` DATETIME NOT NULL,
    CONSTRAINT `fk_user_recovery` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE,
	CONSTRAINT `recovery_pk` PRIMARY KEY (`recovery_id`)
);