import database from './src/database/main.js'
import RobotAudesp from './src/browser/main.js'
import {entidade, robo} from './src/database/lowdb/model.js'
import PostProcess from './src/post-process/post-process.js'
import minimist from 'minimist'
// const logger = require( './src/logger' );

(async () => {
    let robot = null

    try {
        let argumentos = minimist(process.argv.slice(2))

        // Pega a lista de itens a processar do banco de dados
        // Guarda as informações localmente para não ficar requisitando o banco
        let entidades: Array<entidade> = await database.getEntidades(argumentos)

        let audesp_email = ''

        for (const entidade of entidades) {
            if (entidade) {
                if (audesp_email.length === 0 || audesp_email !== entidade.audesp_email) {
                    if (robot) {
                        await robot.closeBrowser()
                    }
                    robot = await RobotAudesp.create(entidade.audesp_email, entidade.audesp_senha)
                    audesp_email = entidade.audesp_email
                }

                if (robot && entidade.pacotes) {

                    for (const pacoteLista of entidade.pacotes) { //Itera os pacotes da Entidade
                        let lastYear = argumentos?.ano || new Date().getFullYear()
                        let lastMonth = new Date().getMonth() + 1
                        let statusArquivo = 1

                        if (typeof pacoteLista === 'object') {

                            if (Array.isArray(pacoteLista)) {

                                for (const pacote of pacoteLista) {
                                    if (argumentos?.pacote && pacote.idPacote !== argumentos.pacote) {
                                        continue
                                    }

                                    if (pacote.importacao) {
                                        lastYear = argumentos?.anoMinimo || argumentos?.ano || pacote.importacao.exercicio
                                        lastMonth = pacote.importacao.mes
                                        statusArquivo = pacote.importacao.status_arquivo
                                    }

                                    let result = await robot.autoProcessPacote(entidade.audesp_municipio, entidade.audesp_entidade, lastYear, lastMonth, pacote, statusArquivo)
                                    await database.saveResults(result)
                                }
                            } else {
                                if (argumentos?.pacote && pacoteLista.idPacote !== argumentos.pacote) {
                                    continue
                                }

                                const pacote = pacoteLista.importacao as robo

                                if (pacote) {
                                    lastYear = argumentos?.anoMinimo || argumentos?.ano || pacote.exercicio
                                    lastMonth = pacote.mes
                                    statusArquivo = pacote.status_arquivo
                                }

                                let result = await robot.autoProcessPacote(entidade.audesp_municipio, entidade.audesp_entidade, lastYear, lastMonth, pacoteLista, statusArquivo)
                                await database.saveResults(result)
                            }
                        }
                    }
                }

            }
        }

        if (robot !== null) {
            console.log('[ROBOT] Total pacotes baixados: ' + robot.getTotalPacotes())
            await robot.closeBrowser()
        }

        await PostProcess.transportData()
        PostProcess.cleanup()

    } catch (error) {
        console.error(error)
    } finally {
        if (robot !== null) {
            await robot.closeBrowser()
        }
        console.log('[ROBOT] BYE!')
    }
})()