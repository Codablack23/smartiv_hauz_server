/* eslint-disable prettier/prettier */
import { ENVIRONMENT } from "./config.env"
import { DataSource, DataSourceOptions } from "typeorm"

function getDBConfig(){
    return {
        database:ENVIRONMENT.DB.NAME,
        password:ENVIRONMENT.DB.PASSWORD,
        username:ENVIRONMENT.DB.USERNAME,
        host:ENVIRONMENT.DB.HOST,
        port:ENVIRONMENT.DB.PORT,
    }
}

function getTypeOrmConfig(){
    const dbConfig:DataSourceOptions = {
        ...getDBConfig(),
        type: "mysql",
        entities: [__dirname + '/../**/entity.*.{js,ts}'],
        migrations: [__dirname + '/../migrations/*.{js,ts}'],
        synchronize:false,
    }
    return dbConfig
}

const AppDataSource = new DataSource({
    ...getTypeOrmConfig()
})

export default AppDataSource