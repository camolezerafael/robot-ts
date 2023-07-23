import puppeteer from 'puppeteer'
import fs from 'fs'
import https from 'https'

import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname( fileURLToPath( import.meta.url ) );

( async () => {
	console.log( 'Iniciando Robo...' )

	console.log( 'Setando Configuracoes...' )
	const browser = await puppeteer.launch( { headless: true } )
	const page = await browser.newPage()

	await page.setRequestInterception( true )
	page.on( 'request', interceptedRequest => {
		if ( interceptedRequest.isInterceptResolutionHandled() ) return
		if (
			interceptedRequest.url().endsWith( '.gif' ) ||
			interceptedRequest.url().endsWith( '.css' )
		)
			interceptedRequest.abort()
		else interceptedRequest.continue()
	} )

	console.log( '[Carregando Página Login]' )

	// Página Inicial - Login
	await page.goto( 'https://audesp.tce.sp.gov.br/audesp/escolherPerfil.do' )

	// Tamanho da tela
	await page.setViewport( { width: 1080, height: 1024 } )

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
	await page.select( perfisSelector, '60' )

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
	await page.select( municipioSelector, '306' )

	console.log( '[Preenchendo Entidade...]' )
	const entidadeSelector = 'select[name="entidade"]'
	await page.waitForSelector( entidadeSelector, { timeout: 60000 } )
	await page.select( entidadeSelector, '10674' )

	console.log( '[Preenchendo Exercicio...]' )
	const exercicioSelector = 'input[name="exercicio"]'
	await page.waitForSelector( exercicioSelector, { timeout: 60000 } )
	await page.type( exercicioSelector, '2023' )

	console.log( '[Preenchendo Documento...]' )
	const documentoSelector = 'select[name="tipoDocumento"]'
	await page.waitForSelector( documentoSelector, { timeout: 60000 } )
	await page.select( documentoSelector, '610' )

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
			// await download( file )

			// let command = `visualizar(${file.documento})`
			// await page.evaluate( `${command}`)

			const downloadPath = join( __dirname, 'downloads', file.municipio, file.entidade, file.exercicio, file.tipo, file.documento )
			// const downloadPath = join( __dirname, 'downloads' )

			fs.mkdirSync(downloadPath, {recursive:true})

			const client = await page.target().createCDPSession()
			await client.send('Page.setDownloadBehavior', {
				behavior: 'allow',
				downloadPath: downloadPath
			})

			await page.goto('https://audesp.tce.sp.gov.br/audesp/downloadDocumentoPublico.do?documentoId=' + file.documento,
				{waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']} ).catch(async ()=>{
				console.log( 'Downloading...')
				await new Promise(r => setTimeout(r, 5*1000));
			});


			// /////let x = await page.evaluate(processHeader, 'https://audesp.tce.sp.gov.br/audesp/downloadDocumentoPublico.do?documentoId=' + file.documento )


			// console.log('x: ', x)
			// await fs.writeFile(downloadPath + file.documento + '.xml', x.base64String, {encoding: "base64"}, (e) => {
			// 	console.log('wf: ', e)
			// })
		}
	} else {
		console.log( 'Nenhum arquivo para o pacote' )
	}

	console.log( 'Finalizando Robo' )
	await browser.close()
} )()

let processHeader = async (URI) => {
		console.log('Entrou No Process Header')
		// fetch the page from inside the html page
		const res = await fetch(URI, {'credentials': 'same-origin'});

		// attachment; filename="...."; size="1234"
		let str = res.headers.get('Content-Disposition');
		const regex = /filename="([^"]*)".*size="([^"]*)"/gm;

		console.log('header:', str)

		let m = regex.exec(str);
		let filename = m?m[1]:null;
		let size = m?m[2]:null;
		let blob = await res.blob()
		let bufferArray = await blob.arrayBuffer();

		let base64String = btoa([].reduce.call(new Uint8Array(bufferArray),function(p,c){return p+String.fromCharCode(c)},''))

		return {base64String, size, filename};
}



function download( file )  {
	return new Promise((resolve, reject) => {
		const downloadUrl = 'https://audesp.tce.sp.gov.br/audesp/downloadDocumentoPublico.do?documentoId='
		const downloadPath = join( __dirname, 'downloads' )

		const downloadFullPath = join( downloadPath, file.municipio, file.exercicio, file.mes, file.tipo )

		fs.mkdirSync( downloadFullPath, { recursive: true } )

		https.get( downloadUrl + file.documento, response => {
			const stream = fs.createWriteStream( join( downloadFullPath, file.documento + '.xml' ), { flags: 'w+' } )
			response.pipe( stream )

			stream.on( 'finish', () => {
				stream.close()
				console.log( 'Download Completed' )
				resolve()
			} )
		} )

	})

}