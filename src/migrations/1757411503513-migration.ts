import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1757411503513 implements MigrationInterface {
    name = 'Migration1757411503513'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`articles\` ADD \`author\` longtext NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`articles\` DROP COLUMN \`author\``);
    }

}
