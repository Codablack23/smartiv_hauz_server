import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1760687877053 implements MigrationInterface {
    name = 'Migration1760687877053'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`team_members\` (\`id\` varchar(36) NOT NULL, \`name\` longtext NOT NULL, \`position\` longtext NOT NULL, \`avatar\` longtext NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_f48b5a6a9d78efa954705e92e5\` (\`name\`), UNIQUE INDEX \`IDX_703e027ffc3ea62f236a23fab4\` (\`position\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`quotes\` CHANGE \`company_name\` \`company_name\` longtext NULL`);
        await queryRunner.query(`ALTER TABLE \`videos\` CHANGE \`description\` \`description\` longtext NULL`);
        await queryRunner.query(`ALTER TABLE \`articles\` DROP FOREIGN KEY \`FK_65d9ccc1b02f4d904e90bd76a34\``);
        await queryRunner.query(`ALTER TABLE \`articles\` CHANGE \`authorId\` \`authorId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`clients\` CHANGE \`company_website\` \`company_website\` longtext NULL`);
        await queryRunner.query(`ALTER TABLE \`projects\` DROP FOREIGN KEY \`FK_091f9433895a53408cb8ae3864f\``);
        await queryRunner.query(`ALTER TABLE \`projects\` CHANGE \`description\` \`description\` longtext NULL`);
        await queryRunner.query(`ALTER TABLE \`projects\` CHANGE \`clientId\` \`clientId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`invoice_addons\` DROP FOREIGN KEY \`FK_6930b2a893031cee4bd54d34e60\``);
        await queryRunner.query(`ALTER TABLE \`invoice_addons\` CHANGE \`invoiceId\` \`invoiceId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`invoice_notes\` DROP FOREIGN KEY \`FK_ac5555e18a06f4e99c0ebb3c4e5\``);
        await queryRunner.query(`ALTER TABLE \`invoice_notes\` CHANGE \`invoiceId\` \`invoiceId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`invoices\` CHANGE \`template_name\` \`template_name\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`invoices\` CHANGE \`theme_color\` \`theme_color\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`invoices\` CHANGE \`company_address\` \`company_address\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`invoices\` CHANGE \`company_email\` \`company_email\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`invoices\` CHANGE \`company_phone\` \`company_phone\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`invoices\` CHANGE \`bank_name\` \`bank_name\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`invoices\` CHANGE \`bank_code\` \`bank_code\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`invoices\` CHANGE \`account_name\` \`account_name\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`invoices\` CHANGE \`account_number\` \`account_number\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`invoices\` CHANGE \`subject\` \`subject\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`invoices\` CHANGE \`published_at\` \`published_at\` date NULL`);
        await queryRunner.query(`ALTER TABLE \`invoices\` CHANGE \`billed_to\` \`billed_to\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`invoices\` CHANGE \`currency\` \`currency\` varchar(3) NULL`);
        await queryRunner.query(`ALTER TABLE \`invoices\` CHANGE \`logo\` \`logo\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`invoices\` CHANGE \`due_date\` \`due_date\` date NULL`);
        await queryRunner.query(`ALTER TABLE \`invoices\` CHANGE \`expires_at\` \`expires_at\` date NULL`);
        await queryRunner.query(`ALTER TABLE \`invoice_products\` DROP FOREIGN KEY \`FK_881e262323b57e3bd6446782f4d\``);
        await queryRunner.query(`ALTER TABLE \`invoice_products\` CHANGE \`invoiceId\` \`invoiceId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`articles\` ADD CONSTRAINT \`FK_65d9ccc1b02f4d904e90bd76a34\` FOREIGN KEY (\`authorId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`projects\` ADD CONSTRAINT \`FK_091f9433895a53408cb8ae3864f\` FOREIGN KEY (\`clientId\`) REFERENCES \`clients\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`invoice_addons\` ADD CONSTRAINT \`FK_6930b2a893031cee4bd54d34e60\` FOREIGN KEY (\`invoiceId\`) REFERENCES \`invoices\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`invoice_notes\` ADD CONSTRAINT \`FK_ac5555e18a06f4e99c0ebb3c4e5\` FOREIGN KEY (\`invoiceId\`) REFERENCES \`invoices\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`invoice_products\` ADD CONSTRAINT \`FK_881e262323b57e3bd6446782f4d\` FOREIGN KEY (\`invoiceId\`) REFERENCES \`invoices\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`invoice_products\` DROP FOREIGN KEY \`FK_881e262323b57e3bd6446782f4d\``);
        await queryRunner.query(`ALTER TABLE \`invoice_notes\` DROP FOREIGN KEY \`FK_ac5555e18a06f4e99c0ebb3c4e5\``);
        await queryRunner.query(`ALTER TABLE \`invoice_addons\` DROP FOREIGN KEY \`FK_6930b2a893031cee4bd54d34e60\``);
        await queryRunner.query(`ALTER TABLE \`projects\` DROP FOREIGN KEY \`FK_091f9433895a53408cb8ae3864f\``);
        await queryRunner.query(`ALTER TABLE \`articles\` DROP FOREIGN KEY \`FK_65d9ccc1b02f4d904e90bd76a34\``);
        await queryRunner.query(`ALTER TABLE \`invoice_products\` CHANGE \`invoiceId\` \`invoiceId\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`invoice_products\` ADD CONSTRAINT \`FK_881e262323b57e3bd6446782f4d\` FOREIGN KEY (\`invoiceId\`) REFERENCES \`invoices\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`invoices\` CHANGE \`expires_at\` \`expires_at\` date NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`invoices\` CHANGE \`due_date\` \`due_date\` date NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`invoices\` CHANGE \`logo\` \`logo\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`invoices\` CHANGE \`currency\` \`currency\` varchar(3) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`invoices\` CHANGE \`billed_to\` \`billed_to\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`invoices\` CHANGE \`published_at\` \`published_at\` date NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`invoices\` CHANGE \`subject\` \`subject\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`invoices\` CHANGE \`account_number\` \`account_number\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`invoices\` CHANGE \`account_name\` \`account_name\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`invoices\` CHANGE \`bank_code\` \`bank_code\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`invoices\` CHANGE \`bank_name\` \`bank_name\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`invoices\` CHANGE \`company_phone\` \`company_phone\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`invoices\` CHANGE \`company_email\` \`company_email\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`invoices\` CHANGE \`company_address\` \`company_address\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`invoices\` CHANGE \`theme_color\` \`theme_color\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`invoices\` CHANGE \`template_name\` \`template_name\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`invoice_notes\` CHANGE \`invoiceId\` \`invoiceId\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`invoice_notes\` ADD CONSTRAINT \`FK_ac5555e18a06f4e99c0ebb3c4e5\` FOREIGN KEY (\`invoiceId\`) REFERENCES \`invoices\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`invoice_addons\` CHANGE \`invoiceId\` \`invoiceId\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`invoice_addons\` ADD CONSTRAINT \`FK_6930b2a893031cee4bd54d34e60\` FOREIGN KEY (\`invoiceId\`) REFERENCES \`invoices\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`projects\` CHANGE \`clientId\` \`clientId\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`projects\` CHANGE \`description\` \`description\` longtext NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`projects\` ADD CONSTRAINT \`FK_091f9433895a53408cb8ae3864f\` FOREIGN KEY (\`clientId\`) REFERENCES \`clients\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`clients\` CHANGE \`company_website\` \`company_website\` longtext NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`articles\` CHANGE \`authorId\` \`authorId\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`articles\` ADD CONSTRAINT \`FK_65d9ccc1b02f4d904e90bd76a34\` FOREIGN KEY (\`authorId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`videos\` CHANGE \`description\` \`description\` longtext NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`quotes\` CHANGE \`company_name\` \`company_name\` longtext NULL DEFAULT 'NULL'`);
        await queryRunner.query(`DROP INDEX \`IDX_703e027ffc3ea62f236a23fab4\` ON \`team_members\``);
        await queryRunner.query(`DROP INDEX \`IDX_f48b5a6a9d78efa954705e92e5\` ON \`team_members\``);
        await queryRunner.query(`DROP TABLE \`team_members\``);
    }

}
