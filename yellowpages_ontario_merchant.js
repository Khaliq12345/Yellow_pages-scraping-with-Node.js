
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const json2csv = require('json2csv');

scrapedData = [];
const base_url = 'https://www.yellowpages.ca';

async function yellowpages_scraper(){
    for (let p = 1; p < 69; p++){
        const url = `https://www.yellowpages.ca/search/si/${p}/Grocery+Stores/Toronto+ON`;
        const response = await axios(url);
        const $ = cheerio.load(response.data);
        
        $('.jsGoToMp').each((index, e) =>{
            const link = $(e).find('.jsListingName').attr('href');
            const shop_link = base_url + link;
            const shop_name = $(e).find('.jsListingName').text().trim();
            const shop_address = $(e).find('.listing__address--full').text().trim();
            const shop_details = $(e).find('.listing__details__teaser').first().text().trim();
            const shop_type = $(e).find('.listing__headings__roots').text().trim();
            const shop_openHours = $(e).find('.goToByScroll').text().trim();
            const shop_phone = $(e).find('.mlr__submenu__item').text().trim();

            scrapedData.push({
                shop_name,
                shop_address,
                shop_type,
                shop_phone,
                shop_openHours,
                shop_details,
                shop_link
            });
        })
    }
    const csv = json2csv.parse(scrapedData);
    fs.writeFileSync('Ontario_merchant.csv', csv);
    console.log(csv);
}

yellowpages_scraper();