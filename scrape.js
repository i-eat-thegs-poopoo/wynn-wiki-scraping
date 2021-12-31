
const puppeteer = require('puppeteer');
const { convert } = require('html-to-text');

exports.search = async query => {

    let browser = await puppeteer.launch();
    let page = await browser.newPage();
    await page.goto('https://wynncraft.fandom.com/wiki/Special:Search?fulltext=0&query=' + query.replace(/\s+/gi, '+'), );

    if (page.url().includes('Special:Search')) {

        try {
            var url = await page.$eval('.unified-search__result__title', elem => elem.href);
        }
        catch {
            return null;
        }

        await page.goto(url);

    }

    try {
        var contents = await page.$eval('.mw-parser-output', elem => elem.innerHTML);
    }
    catch {
        return null;
    }

	let out = convert(contents, {
        wordwrap: 100,
        formatters: {
            'fmtImg': () => {}
        },
        selectors: [
            {
              selector: 'img',
              format: 'fmtImg',
              options: { leadingLineBreaks: 0, trailingLineBreaks: 0 }
            }
        ]
    });

    await browser.close();
	return out.replace(/\n{3,}/gi, '\n\n');

};
