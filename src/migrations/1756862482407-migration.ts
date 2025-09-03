import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1756862482407 implements MigrationInterface {
    name = 'Migration1756862482407'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`telegram_handle\` \`telegram_handle\` longtext NULL`);
        await queryRunner.query(`ALTER TABLE \`promotions\` ADD UNIQUE INDEX \`IDX_2da787629e8153ef439a1be190\` (\`promotion_type\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`promotions\` DROP INDEX \`IDX_2da787629e8153ef439a1be190\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`telegram_handle\` \`telegram_handle\` longtext NULL DEFAULT 'NULL'`);
    }

}
