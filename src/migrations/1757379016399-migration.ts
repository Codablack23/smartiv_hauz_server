import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1757379016399 implements MigrationInterface {
    name = 'Migration1757379016399'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`articles\` ADD \`banner_url\` longtext NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`articles\` DROP COLUMN \`banner_url\``);
    }

}
