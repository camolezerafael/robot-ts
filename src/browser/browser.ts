import {Browser as PlaywrightBrowser, BrowserContext, chromium, Page} from 'playwright'

export default class Browser {
    private readonly browserOptions
    private readonly defaultTimeout
    // @ts-ignore
    private browser: PlaywrightBrowser
    // @ts-ignore
    private context: BrowserContext
    // @ts-ignore
    private page: Page

    constructor(browserOptions: object, defaultTimeout: number) {
        console.log('[Browser] Construindo...')
        this.browserOptions = browserOptions
        this.defaultTimeout = defaultTimeout
        console.log('[Browser] Construído')
    }

    static async create(browserOptions: object, defaultTimeout: number) {
        return new Browser(browserOptions, defaultTimeout)
    }

    async prepare() {
        await this.startBrowser()
        await this.setContext()
        await this.createPage()
        console.log('[Browser] Pronto Para Ações')
    }

    async startBrowser() {
        console.log('[Browser] Iniciando...')
        this.browser = await chromium.launch(this.browserOptions)
        console.log('[Browser] Iniciado!')
    }

    async setContext() {
        console.log('[Browser] Iniciando Contexto...')
        this.context = await this.browser.newContext()
        await this.context.route('**/*.{png,jpg,jpeg,gif,css}', route => route.abort())
        this.context.setDefaultNavigationTimeout(this.defaultTimeout * 1000)
        console.log('[Browser] Contexto Iniciado')
    }

    async createPage() {
        console.log('[Browser] Abrindo Nova Aba...')
        this.page = await this.context.newPage()
        console.log('[Browser] Nova Aba Aberta')
    }

    async closeBrowser() {
        console.log('[Browser] Finalizando...')
        await this.context.close()
        await this.browser.close()
        console.log('[Browser] Finalizado')
    }

    getPage() {
        return this.page
    }
}