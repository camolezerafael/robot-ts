const {join} = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
	cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
	// downloadPath: join(__dirname, 'downloads'),
	skipDownload: false
};