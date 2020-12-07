const Provider = require('./Provider');

class RoyalLepage extends Provider {
    constructor() {
        super();
    }

    async strategy(page) {
        try {
            const pageData = await page.evaluate(() => {
              let listings = document.getElementsByClassName('card card--listing-card js-listing js-property-details');
              let listingConstruction = [];
              for(listing of listings) {
                const listingMedia = listing.getElementsByClassName('card__media')[0].children[0];
                let listing_id = listing.getAttribute('data-id');
                let listing_thumbnail = listingMedia.children[0].getAttribute('data-src');
                if(!listing_thumbnail) {
                  listing_thumbnail = listingMedia.children[0].getAttribute('src');
                }
                let listing_link = listingMedia.getAttribute('href');
                let listing_address = listingMedia.children[0].getAttribute('alt');
                let listing_price = listing.getElementsByClassName('price')[0].textContent.trim();
        
                let coordinates = listing.getAttribute('data-rlp-key');
        
                listingConstruction.push({
                  listing_id,
                  listing_thumbnail,
                  listing_link,
                  listing_address,
                  listing_price,
                  coordinates
                });
        
              }
              return listingConstruction;
            })
            return pageData;
        
          } catch(error) {
            console.log(error);
        }
    }
}

module.exports = RoyalLepage;