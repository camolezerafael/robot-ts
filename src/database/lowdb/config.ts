import dotenv from 'dotenv'

dotenv.config()

export type lowDbConfig = {
    dbPath: string,
    dbFile: string,
    dbInit: object
}

export const robotConfig: lowDbConfig = {
    dbPath: process.env.LOWDB_PATH || '',
    dbFile: process.env.LOWDB_ROBOT_FILE || '',
    dbInit: {entidades: [], results: []}
}

export const logConfig: lowDbConfig = {
    dbPath: process.env.LOWDB_PATH || '',
    dbFile: process.env.LOWDB_LOG_FILE || '',
    dbInit: {atividades: []}
}
