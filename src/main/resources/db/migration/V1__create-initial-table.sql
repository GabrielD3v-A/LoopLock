CREATE TABLE IF NOT EXISTS product (

    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) DEFAULT NULL

);

CREATE TABLE IF NOT EXISTS role (

    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) DEFAULT NULL

);

CREATE TABLE IF NOT EXISTS users (

    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) DEFAULT NULL,
    password VARCHAR(255) DEFAULT NULL

);

CREATE TABLE IF NOT EXISTS users_roles (

    user_id BIGINT NOT NULL,
    roles_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, roles_id),
    CONSTRAINT FK_USERS_ROLES_USER_ID FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT FK_USERS_ROLES_ROLE_ID FOREIGN KEY (roles_id) REFERENCES role(id)

);

insert into `role` (NAME) values ("PRODUCT_SELECT");
insert into `role` (NAME) values ("PRODUCT_INSERT");
insert into `role` (NAME) values ("PRODUCT_UPDATE");
insert into `role` (NAME) values ("PRODUCT_DELETE");
insert into `role` (NAME) values ("RO_DELETE");