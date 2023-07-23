import { chromium } from 'playwright'
import fs from 'fs'

import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname( fileURLToPath( import.meta.url ) );


( async () => {
	console.log( 'Iniciando Robo...' )

	console.log( 'Setando Configuracoes...' )
	const browser = await chromium.launch( { headless: true, downloadsPath: join(__dirname, 'downloads', 'temp') } )
	const context = await browser.newContext();
	await context.route('**/*.{png,jpg,jpeg,gif,css}', route => route.abort());
	context.setDefaultNavigationTimeout(90*1000)
	const page = await context.newPage()

	console.log( '[Carregando Página Login]' )

	// Página Inicial - Login
	await page.goto( 'https://audesp.tce.sp.gov.br/audesp/escolherPerfil.do' )

	console.log( '[Preenchendo Login...]' )

	// Type into search box
	await page.type( '#username', 'audesp@confiatta.com.br' )
	await page.type( '#password', '10886conf' )

	console.log( '[Autenticando Login...]' )

	// Click Login Submit
	await page.click( 'input[name="submit"]' )


	console.log( '[Selecionando Perfil...]' )

	// Select Perfil
	const perfisSelector = 'select#perfil-usuario'
	await page.waitForSelector( perfisSelector )
	await page.locator( perfisSelector).selectOption('59')

	console.log( '[Enviando Perfil...]' )

	await page.click( '#button-ok' )

	console.log( '[Carregando Página Busca...]' )
	// Acessa Página de Busca de Documentos
	await page.goto( 'https://audesp.tce.sp.gov.br/audesp/visualizarDocumentoPublico.do', {
		waitUntil: 'load',
		timeout: 70000,
	} )

	// Dados Busca
	console.log( '[Preenchendo Municipio...]' )
	const municipioSelector = 'select[name="municipio"]'
	await page.waitForSelector( municipioSelector, { timeout: 60000 } )
	await page.locator( municipioSelector ).selectOption('306')

	console.log( '[Preenchendo Entidade...]' )
	const entidadeSelector = 'select[name="entidade"]'
	await page.waitForSelector( entidadeSelector, { timeout: 60000 } )
	await page.locator( entidadeSelector ).selectOption('10674')

	console.log( '[Preenchendo Exercicio...]' )
	const exercicioSelector = 'input[name="exercicio"]'
	await page.waitForSelector( exercicioSelector, { timeout: 60000 } )
	await page.type( exercicioSelector, '2022' )

	console.log( '[Preenchendo Documento...]' )
	const documentoSelector = 'select[name="tipoDocumento"]'
	await page.waitForSelector( documentoSelector, { timeout: 60000 } )
	await page.locator( documentoSelector ).selectOption('610')

	// Efetua a Busca
	console.log( '[Efetuando Busca...]' )
	await page.evaluate( () => {
		_pesquisar()
	} )

	console.log( '[Aguardando Resultado...]' )
	const seletorResultado = 'table#item'
	await page.waitForSelector( seletorResultado, { timeout: 70000 } )

	console.log( '[Busca Realizada]' )

	const result = []
	const linhas = await page.$$eval( seletorResultado + ' tbody tr', linhas => linhas.map( e => e.innerText ) )

	console.log( '[Extraindo Resultados...]' )

	for ( let [ idx, linha ] of linhas.entries() ) {
		linhas[ idx ] = linha.split( '\t' )
	}

	if ( linhas[ 0 ].length > 3 ) {

		for ( const linha of linhas ) {
			result.push( {
				documento: linha[ 0 ],
				tipo: linha[ 2 ],
				recebido: linha[ 3 ],
				entidade: linha[ 5 ],
				municipio: linha[ 6 ],
				mes: linha[ 7 ],
				exercicio: linha[ 8 ],
				status: linha[ 9 ],
			} )
		}

		// Print Result
		console.log( 'Resultado: ', result )

		console.log( 'Download Results...' )

		for ( const file of result ) {

			const downloadPath = join( __dirname, 'downloads', file.municipio, file.tipo, file.exercicio, file.mes )

			fs.mkdirSync(downloadPath, {recursive:true})

			await page.goto('https://audesp.tce.sp.gov.br/audesp/downloadDocumentoPublico.do?documentoId=' + file.documento, {
				timeout: 30000
			} ).catch(e => {
				console.log('Downloading...')
			})

			const download = await page.waitForEvent('download', { timeout: 90000 })
			await download.saveAs( join(downloadPath, file.documento + '.xml') )

		}
	} else {
		console.log( 'Nenhum arquivo para o pacote' )
	}

	console.log( 'Finalizando Robo' )
	await context.close()
	await browser.close()

} )().catch(e => {
	console.log('Deu erro no robo! Erro: ', e)
})