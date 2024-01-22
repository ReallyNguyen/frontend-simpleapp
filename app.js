const http = require('http');
const fs = require('fs');
const url = require('url')

const tempList = fs.readFileSync(`${__dirname}/listview.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/eachAnimalList.html`, 'utf-8')
const tempAnimal = fs.readFileSync(`${__dirname}/animal.html`, 'utf-8')

const replaceTemplate = (temp, animal) => {
    let output = temp.replace(/{%NAME%}/g, animal.name)
    output = output.replace(/{%SOUND%}/g, animal.sound)
    output = output.replace(/{%ID%}/g, animal.id)
    return output;
}

const data = fs.readFileSync(`${__dirname}/data.json`, 'utf-8')
const animalData = JSON.parse(data);
const server = http.createServer((req, res) => {

    const { query, pathname } = url.parse(req.url, true);
    const pathName = pathname;
    if (pathName === '/listview' || pathname === '/') {
        const cardsHtml = animalData.map(el => replaceTemplate(tempCard, el)).join('');
        console.log(cardsHtml)
        const output = tempList.replace(/{%EACH_ANIMAL%}/, cardsHtml);
        res.writeHead(200, {
            "Content-type": 'text/html'
        })
        res.end(output);
    } else if (pathname === '/animal') {
        res.writeHead(200, {
            "Content-type": "text/html",
        });
        const animal = animalData[query.id];
        const output = replaceTemplate(tempAnimal, animal)
        res.end(output)
    } else if (pathname === '/api') {
        res.writeHead(200, {
            "Content-type": 'application/json'
        })
        res.end(data)
    } else {
        res.writeHead(404, {
            "Content-type": 'text/html',
            "A-Random-Header": "a random header value"
        })
        res.end('<h3>page not found</h3>')
    }
})

const PORT = 3000;
const LOCALHOST = "127.0.0.1";
server.listen(PORT, LOCALHOST, () => {
    console.log(`The server is listening on port ${PORT}`)
})
