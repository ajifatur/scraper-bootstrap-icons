const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');

const app = express();
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
    axios
        .get('https://icons.getbootstrap.com')
        .then(response => {
            if(response.status === 200) {
                const $ = cheerio.load(response.data);
                let icons = [];
                $('#content .list li').each(function(i, elem) {
                    icons[i] = $(elem).find('.name').text();
                });
                icons = icons.filter(n => n !== undefined);
                res.json(icons);
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