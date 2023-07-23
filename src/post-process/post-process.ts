import fs from 'fs'
import path from 'node:path'
import Database from '../database/main.js'

export default class PostProcess {

	static cleanup() {
		for (const file of fs.readdirSync('./downloads/temp')) {
			fs.unlinkSync(path.join('./downloads/temp', file));
		}
	}

    static async transportData() {
        await Database.savePstRobo()
    }
}