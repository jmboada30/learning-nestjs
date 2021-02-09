import {MigrationInterface, QueryRunner} from "typeorm";

export class usersDetailsRol1612868318674 implements MigrationInterface {
    name = 'usersDetailsRol1612868318674'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `user_details` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(50) NOT NULL, `lastname` varchar(255) NULL, `status` varchar(8) NOT NULL DEFAULT 'ACTIVE', `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `users` (`id` int NOT NULL AUTO_INCREMENT, `username` varchar(25) NOT NULL, `email` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, `status` tinyint NOT NULL DEFAULT '1', `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `detailsId` int NOT NULL, UNIQUE INDEX `IDX_fe0bb3f6520ee0469504521e71` (`username`), UNIQUE INDEX `REL_a8687924ae4d52f05db87f3352` (`detailsId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `roles` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(20) NOT NULL, `description` text NULL, `status` tinyint NOT NULL DEFAULT '1', `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `users_roles` (`usersId` int NOT NULL, `rolesId` int NOT NULL, INDEX `IDX_deeb1fe94ce2d111a6695a2880` (`usersId`), INDEX `IDX_21db462422f1f97519a29041da` (`rolesId`), PRIMARY KEY (`usersId`, `rolesId`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `users` ADD CONSTRAINT `FK_a8687924ae4d52f05db87f3352f` FOREIGN KEY (`detailsId`) REFERENCES `user_details`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `users_roles` ADD CONSTRAINT `FK_deeb1fe94ce2d111a6695a2880e` FOREIGN KEY (`usersId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `users_roles` ADD CONSTRAINT `FK_21db462422f1f97519a29041da0` FOREIGN KEY (`rolesId`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `users_roles` DROP FOREIGN KEY `FK_21db462422f1f97519a29041da0`");
        await queryRunner.query("ALTER TABLE `users_roles` DROP FOREIGN KEY `FK_deeb1fe94ce2d111a6695a2880e`");
        await queryRunner.query("ALTER TABLE `users` DROP FOREIGN KEY `FK_a8687924ae4d52f05db87f3352f`");
        await queryRunner.query("DROP INDEX `IDX_21db462422f1f97519a29041da` ON `users_roles`");
        await queryRunner.query("DROP INDEX `IDX_deeb1fe94ce2d111a6695a2880` ON `users_roles`");
        await queryRunner.query("DROP TABLE `users_roles`");
        await queryRunner.query("DROP TABLE `roles`");
        await queryRunner.query("DROP INDEX `REL_a8687924ae4d52f05db87f3352` ON `users`");
        await queryRunner.query("DROP INDEX `IDX_fe0bb3f6520ee0469504521e71` ON `users`");
        await queryRunner.query("DROP TABLE `users`");
        await queryRunner.query("DROP TABLE `user_details`");
    }

}
