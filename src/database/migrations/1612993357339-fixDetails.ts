import {MigrationInterface, QueryRunner} from "typeorm";

export class fixDetails1612993357339 implements MigrationInterface {
    name = 'fixDetails1612993357339'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user_details` CHANGE `name` `name` varchar(50) NULL");
        await queryRunner.query("ALTER TABLE `user_details` CHANGE `lastname` `lastname` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `roles` CHANGE `description` `description` text NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `roles` CHANGE `description` `description` text NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `user_details` CHANGE `lastname` `lastname` varchar(255) NULL DEFAULT 'NULL'");
        await queryRunner.query("ALTER TABLE `user_details` CHANGE `name` `name` varchar(50) NOT NULL");
    }

}
