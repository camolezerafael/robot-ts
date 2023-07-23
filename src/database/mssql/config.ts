import dotenv from 'dotenv'
import {config} from 'mssql';

dotenv.config()

export const msSqlConfig:config = {
	server: process.env.DB_SERVER || '',
	database: process.env.DB_DATABASE,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	port: 1433,
	pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
	options: {
		trustServerCertificate: true,
	},
}