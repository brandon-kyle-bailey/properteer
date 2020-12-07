const FileHandler = require('./handlers/FileHandler');
const DataHandler = require('./handlers/DataHandler');

const MailClient = require('./template/email/Client');

const ScraperStrategy = require('./strategy/scraper/ScrapeStrategy');
const RoyalLepageProvider = require('./strategy/scraper/provider/RoyalLepage');
const RealtorProvider = require('./strategy/scraper/provider/Realtor');


const main = async () => {

    const DATA_PATH = './data';
    const DATA_FILE = 'data.json';
    const DATA_FULL_PATH = `${DATA_PATH}/${DATA_FILE}`;

    const MEDIA_PATH = './data/media';

    // scrape data
    const royalLePageStrategy = new ScraperStrategy(provider=RoyalLepageProvider);
    royalLePageStrategy.resource = "https://www.royallepage.ca/en/search/homes/nb/saint-john/?search_str=Saint+John%2C+New+Brunswick%2C+Canada&csrfmiddlewaretoken=WUfGsa78vDenJsx9czgNirZXOXntDvy0RSqE97CM3g2ec0YD0Pj6s01HdEUSDwVD&property_type=5&house_type=201%2C202&features=&listing_type=&lat=45.2733153&lng=-66.06330799999999&upper_lat=&upper_lng=&lower_lat=&lower_lng=&bypass=&radius=&zoom=&display_type=gallery-view&travel_time=&travel_time_min=30&travel_time_mode=drive&travel_time_congestion=&da_id=&segment_id=&tier2=False&tier2_proximity=0&address=Saint+John&method=homes&address_type=city&city_name=Saint+John&prov_code=NB&school_id=&min_price=0&max_price=200000&min_leaseprice=0&max_leaseprice=5000%2B&beds=0&baths=0&transactionType=SALE&archive_status=All&archive_timespan=6&sfproperty_type%5B5%5D=5&sfhouse_type%5B201%5D=201&sfhouse_type%5B202%5D=202&keyword=&sortby=date";
    const data = await royalLePageStrategy.execute();

    const fileHandler = new FileHandler();
    const dataHandler = new DataHandler();

    // write data
    if(!fileHandler.fileExists(DATA_FULL_PATH)) {
        console.log("Data file does not exist.");
        fileHandler.writeToJsonFile(data, DATA_FULL_PATH);
    } else {
        const oldData = fileHandler.readFromJsonFile(DATA_FULL_PATH);
        const newListings = dataHandler.compareObjectArrays(oldData, data, "listing_id");
        if(newListings.length > 0) {
            // construct email
            const client = new MailClient(options = {
                host: process.env.APP_MAIL_HOST,
                port: 465,
                secure: true, // use TLS
                auth: {
                    user: process.env.APP_EMAIL,
                    pass: process.env.APP_PASSWORD
                },
                tls: {
                    // do not fail on invalid certs
                    rejectUnauthorized: false
                }
            }
            );
            let attachmentObjects = [];
            // download media
            let bodyHtml = "<div>";
            newListings.forEach(listing => {
                const mediaPath = `${MEDIA_PATH}/${listing.listing_thumbnail.split('/').pop()}`;
                fileHandler.download(`http:${listing.listing_thumbnail}`, mediaPath);
                const attachmentObject = {
                    filename: mediaPath.split('/').pop(),
                    path: mediaPath,
                    cid : listing.listing_thumbnail.split('/').pop().split('.').shift()
                }
                bodyHtml += "<div>";
                bodyHtml += `<h1>${listing.listing_address}</h1>`;
                bodyHtml += `<h2>${listing.listing_price}</h2>`;
                bodyHtml += `<img src="${client.constructCidObject(attachmentObject.cid)}"/>`;
                bodyHtml += `<a href="${listing.listing_link}"> See more...</a>`;
                attachmentObjects.push(attachmentObject);
            });
            bodyHtml += "</div>";
            client.createMailObject(
                from=`"Properteer" <${process.env.APP_EMAIL}>`, 
                to=`${process.env.APP_EMAIL}`, 
                subject="Properteer | New property alert!", 
                text="New property alerts",
                html=bodyHtml,
                attachments=attachmentObjects
            );
            client.sendEmail();
            fileHandler.writeToJsonFile(data, DATA_FULL_PATH);
        } else {
            console.log("No new listings found...");
        }
    }
};main();
