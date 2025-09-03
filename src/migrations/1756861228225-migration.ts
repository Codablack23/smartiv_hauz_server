import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1756861228225 implements MigrationInterface {
    name = 'Migration1756861228225'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`promotions\` (\`id\` varchar(36) NOT NULL, \`promotion_type\` enum ('WEB_DEVELOPMENT', 'APP_DEVELOPMENT', 'DIGITAL_MARKETING', 'SOCIAL_MEDIA_MARKETING', 'BRAND_IDENTITY_DESIGN') NOT NULL, \`title\` longtext NOT NULL, \`caption\` longtext NOT NULL, \`banner_url\` longtext NOT NULL, \`button_title\` longtext NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`telegram_handle\` \`telegram_handle\` longtext NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`telegram_handle\` \`telegram_handle\` longtext NULL DEFAULT 'NULL'`);
        await queryRunner.query(`DROP TABLE \`promotions\``);
    }

}
