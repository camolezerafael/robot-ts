import Browser from './browser.js'
import {confiattaAudesp} from '../@shared/pacotes.js'
import {Page} from 'playwright'
import {join} from 'path'
import {selectors} from './selectors.js'
import {result} from './result.js'
import fs from 'fs'
import {robo} from '../database/lowdb/model.js'
import {mesesToId} from '../@shared/meses.js'
import {sleep} from '../@shared/misc.js'

export default class RobotAudesp {
    // @ts-ignore
    public browser: Browser
    // @ts-ignore
    public page: Page
    private perfil?: number
    private readonly username: string
    private readonly password: string
    private browserOptions = {headless: true, downloadsPath: join('downloads', 'temp')}
    private browserDefaultTimeout: number = 120
    private pacote?: confiattaAudesp
    private municipio?: number
    private entidade?: number
    private exercicio?: number
    private mes?: number
    private statusPacote?: number
    private results: result[] = []
    private logged: boolean = false
    private perfiled: boolean = false
    private totalPacotes = 0
    private untilToday = true
    private defaultTimeoutAwait = {timeout: this.browserDefaultTimeout * 1000}

    constructor(username: string, password: string, perfil: number) {
        this.username = username
        this.password = password
        this.setPerfil(perfil)
    }

    static async create(username: string, password: string, perfil: number = 69) {
        const i = new RobotAudesp(username, password, perfil)
        console.log('[ROBOT] Criando Navegador...')
        const robot = new Browser(i.browserOptions, i.browserDefaultTimeout)
        await robot.prepare()
        i.setBrowser(robot)
        console.log('[ROBOT] Navegador Criado')
        i.setPage(robot.getPage())
        console.log('[ROBOT] Pronto para Comandos')
        return i
    }

    async doLogin() {
        try {
            if (!this.logged && this.page) {
                console.log('[ROBOT] Carregando Página Inicial...')

                await this.page.goto('https://audesp.tce.sp.gov.br/audesp/login.do', {waitUntil: 'load'})
                    .catch(() => {
                        throw new Error('Página Login não terminou de carregar antes do timeout')
                    })

                try {
                    await this.page.waitForSelector('#username')

                    console.log('[ROBOT] Preenchendo Login...')
                    await this.page.type('#username', this.username)
                    await this.page.type('#password', this.password)

                    console.log('[ROBOT] Autenticando Login')
                    await this.page.click('input[name="submit"]')

                    this.logged = true
                } catch (e) {
                    console.log('[ROBOT] Login não carregou, tentando setar perfil...')
                    if (!this.perfiled) {
                        await this.selectPerfilAudesp()
                    }
                    this.logged = true
                }
            }
        } catch (e) {
            this.logged = false
            console.error('[ROBOT] Erro no processo de login: ', e)
            await this.browser.closeBrowser()
        }
    }

    async selectPerfilAudesp() {
        try {
            if (!this.perfiled) {
                await this.page.goto('https://audesp.tce.sp.gov.br/audesp/escolherPerfil.do', {waitUntil: 'load'})
                    .catch(() => {
                        throw new Error('Página do Perfil não terminou de carregar antes do timeout')
                    })

                console.log('[ROBOT] Selecionando Perfil...')
                await this.page.waitForSelector(selectors.perfisSelector)
                await this.page.locator(selectors.perfisSelector).selectOption('59')

                console.log('[ROBOT] Enviando Perfil Selecionado...')
                await this.page.click('#button-ok')

                await this.page.waitForSelector('#menu-button')
                console.log('[ROBOT] Perfil Selecionado')
                this.perfiled = true
            }
        } catch (e) {
            throw new Error('Não foi possível prosseguir, site parece não responder ou muito lento')
        }
    }

    async filterPage() {
        console.log('[ROBOT] Carregando Página Filtros...')
        await this.page.goto('https://audesp.tce.sp.gov.br/audesp/visualizarDocumentoPublico.do', {
            waitUntil: 'load',
        })

        // Dados Busca
        if (this.municipio) {
            console.log('[ROBOT] Preenchendo Municipio...')
            console.log('[ROBOT] Municipio: ' + this.municipio.toString())
            await this.page.waitForSelector(selectors.municipioSelector, this.defaultTimeoutAwait)
            await this.page.locator(selectors.municipioSelector).selectOption(this.municipio.toString())
        }

        if (this.entidade) {
            console.log('[ROBOT] Preenchendo Entidade...')
            console.log('[ROBOT] Entidade: ' + this.entidade.toString())
            await this.page.waitForSelector(selectors.entidadeSelector, this.defaultTimeoutAwait)
            await this.page.locator(selectors.entidadeSelector).selectOption(this.entidade.toString())
        }

        if (this.exercicio) {
            console.log('[ROBOT] Preenchendo Exercício...')
            console.log('[ROBOT] Exercício: ' + this.exercicio.toString())
            await this.page.waitForSelector(selectors.exercicioSelector, this.defaultTimeoutAwait)
            await this.page.type(selectors.exercicioSelector, this.exercicio.toString())
        }

        if (this.pacote) {
            console.log('[ROBOT] Preenchendo Documento...')
            console.log('[ROBOT] Documento: ' + this.pacote.nome)
            await this.page.waitForSelector(selectors.documentoSelector, this.defaultTimeoutAwait)
            await this.page.locator(selectors.documentoSelector).selectOption(this.pacote.idAudesp.toString())
        }

        // Efetua a Busca
        console.log('[ROBOT] Efetuando Busca...')
        await this.page.evaluate(() => {
            // @ts-ignore
            _pesquisar()
        })

        console.log('[ROBOT] Aguardando Resultado...')
        await this.page.waitForSelector(selectors.seletorResultado, this.defaultTimeoutAwait)

        console.log('[ROBOT] Busca Realizada')
    }

    async getResults() {
        console.log('[ROBOT] Extraindo Resultados...')
        const results: result[] = []
        // @ts-ignore
        const linhas = await this.page.$$eval(selectors.seletorResultado + ' tbody tr', linhas => linhas.map(e => e.innerText))


        for (let [idx, linha] of linhas.entries()) {
            if (!linha.toString().includes('Não há registros para o critério informado')) {
                linhas[idx] = linha.split('\t')
            }
        }

        if (linhas.length > 0) {
            if (linhas[0].length > 3) {
                console.log('[ROBOT] Processando Resultados...')

                for (const linha of linhas) {
                    if (!linha[9].includes('rejeitado')) {
                        results.push({
                            documento: linha[0],
                            tipo: linha[2],
                            recebido: linha[3],
                            entidade: this.entidade || 0,
                            municipio: this.municipio || 0,
                            mes: linha[7],
                            exercicio: linha[8],
                            statusAudesp: linha[9],
                        })
                    }
                }

                console.log('[ROBOT] Pacotes Disponíveis: ' + results.length)
                this.totalPacotes += results.length
                this.results = results
            } else {
                console.log('[ROBOT] Nenhum Pacote Disponível')
            }
        } else {
            console.log('[ROBOT] Não Houve Retorno')
        }
    }

    async downloadResults() {
        if (this.results) {
            console.log('[ROBOT] Iniciando Downloads dos Resultados...')

            for (const file of this.results) {

                if (this.verifyFileDownload(file)) {
                    file.toDownload = true

                    const downloadPath = join('downloads', file.municipio.toString(), file.entidade.toString(), file.tipo, file.exercicio.toString(), mesesToId(file.mes).toString())

                    fs.mkdirSync(downloadPath, {recursive: true})

                    await this.page.goto('https://audesp.tce.sp.gov.br/audesp/downloadDocumentoPublico.do?documentoId=' + file.documento, {
                        timeout: 30000,
                    }).catch(() => {
                        console.log('[ROBOT] Downloading...')
                    })

                    const download = await this.page.waitForEvent('download', {timeout: 120000})
                    await download.saveAs(join(downloadPath, file.documento + '.xml'))
                    console.log('[ROBOT] Downloaded ' + file.municipio.toString() + ' - ' + file.entidade.toString() + ' - ' + file.tipo + ' - ' + file.exercicio.toString() + ' - ' + file.mes + ' - ' + file.documento)

                    if (fs.existsSync(join(downloadPath, file.documento + '.xml'))) {
                        file.statusDownload = true
                    }
                } else {
                    this.totalPacotes--
                    file.toDownload = false
                }

            }
            console.log('[ROBOT] Downloads dos Resultados Finalizado')
        }
    }

    verifyFileDownload(file: result) {
        console.log('[ROBOT] Verificando Arquivos a Baixar...')

        const importacao = this.pacote?.importacao as robo[] || null

        if (!importacao) {
            return true
        } else {
            const mes = mesesToId(file.mes) || 1

            let pacoteMes = importacao.find(pacote => pacote.mes === mes)

            if(pacoteMes){
                if (pacoteMes.nome_arquivo && pacoteMes.nome_arquivo.length) {
                    const arquivo = parseInt(pacoteMes.nome_arquivo.split('.xml')[0])

                    if (file.documento > arquivo || (file.documento == arquivo && pacoteMes.status_arquivo === 0 && file.statusAudesp.includes('armazenado')) ) {
                        return true
                    }
                } else {
                    if ((file.exercicio == pacoteMes.exercicio && mes >= pacoteMes.mes) && (file.exercicio > pacoteMes.exercicio)) {
                        return true
                    }
                }
            }else{
                return true
            }

        }
        return false

    }

    async autoProcessPacote(municipio: number, entidade: number, exercicio: number, mes: number, pacote: confiattaAudesp, statusPacote: number, untilToday: boolean = true): Promise<result[]> {
        try {
            this.setFiltros(municipio, entidade, exercicio, mes, pacote, statusPacote, untilToday)
            if (!this.logged) {
                await this.doLogin()
            }
            if (!this.perfiled) {
                await this.selectPerfilAudesp()
            }
            return await this.doProcess()
        } catch (e) {
            console.log('[ROBOT] Erro no processamento automático: ', e)
            return []
        }
    }

    async doProcess(): Promise<result[]> {
        return new Promise(async (resolve) => {
            let results: result[] = []

            if (this.untilToday) {
                const yearActual = new Date().getFullYear()

                for (let exercicio = this.exercicio || 2023; exercicio <= yearActual; exercicio++) {
                    this.setExercicio(exercicio)
                    await this.filterPage()
                    await this.getResults()
                    results = [...results, ...this.results]
                    await this.downloadResults()
                    await sleep(0.5)
                }
            } else {
                await this.filterPage()
                await this.getResults()
                results = [...results, ...this.results]
                await this.downloadResults()
            }

            await sleep(0.5)

            resolve(results)
        })
    }

    async closeBrowser() {
        await this.browser.closeBrowser()
    }

    setPerfil(perfil: number) {
        this.perfil = perfil
    }

    setFiltros(municipio: number, entidade: number, exercicio: number, mes: number, pacote: confiattaAudesp, statusPacote: number, untilToday: boolean) {
        this.setMunicipio(municipio)
        this.setEntidade(entidade)
        this.setExercicio(exercicio > 0 ? exercicio : 2023)
        this.setMes(mes > 0 ? mes : 1)
        this.setPacote(pacote)
        this.setStatusPacote(statusPacote)
        this.setUntilToday(untilToday)
    }

    setPacote(pacote: confiattaAudesp) {
        this.pacote = pacote
    }

    setEntidade(entidade: number) {
        this.entidade = entidade
    }

    setMunicipio(municipio: number) {
        this.municipio = municipio
    }

    setExercicio(exercicio: number) {
        this.exercicio = exercicio
    }

    setMes(mes: number) {
        this.mes = mes
    }

    setStatusPacote(statusPacote: number) {
        this.statusPacote = statusPacote
    }

    setPage(page: Page) {
        this.page = page
    }

    setBrowser(browser: Browser) {
        this.browser = browser
    }

    getTotalPacotes() {
        return this.totalPacotes
    }

    setUntilToday(untilToday: boolean) {
        this.untilToday = untilToday
    }
}





