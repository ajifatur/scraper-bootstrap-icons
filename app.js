const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const express = require('express');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors({
    origin: '*'
}));

app.get('/', (req, res) => {
    axios
        .get('https://icons.getbootstrap.com')
        .then(response => {
            if(response.status === 200) {
                const $ = cheerio.load(response.data);

                // Get icons
                let icons = [];
                $('#content .list li').each(function(i, elem) {
                    icons[i] = $(elem).find('.name').text();
                });
                icons = icons.filter(n => n !== undefined);

                // Get version
                let version = $('footer.bd-footer p a:first-child').text();

                // Get CDN URL
                let url = $('#cdn').parent().find('code.language-html span.s').last().text();
                url = url.replace('\"','');
                url = url.replace('"','');

                res.json({
                    version: version,
                    url: url,
                    icons: icons,
                    length: icons.length
                });
            }
        })
        .catch(error => {
            console.log(error);
        })
});

app.use((req, res, next) => {
    res.status(404).send('Route is not found!');
});

app.listen(port, () => {
    console.log(`App listening on port ${port}...`);
});