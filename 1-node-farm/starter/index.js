// const fs = require('fs');

const http = require('http');
const url = require('url');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%EMOJI%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if (!product.organic)
      output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
  };

  const overviewtemp = fs.readFileSync('./templates/overview.html', 'utf-8');
  const producttemp = fs.readFileSync('./templates/product.html', 'utf-8');
  const cardstemp = fs.readFileSync('./templates/overview-cards.html', 'utf-8');

  const data = fs.readFileSync('./dev-data/data.json', 'utf-8');
  const dataObj = JSON.parse(data);
  const { query, pathname } = url.parse(req.url, true);

  if (pathname == '/overview' || pathname == '/') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(cardstemp, el))
      .join(' ');
    const output = overviewtemp.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);
  } else if (pathname == '/product') {
    const product = dataObj[query.id];
    const output = replaceTemplate(producttemp, product);
    res.end(output);
  } else if (pathname == '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/html',
    });
    res.end('<h1>Page not found</h1>');
  }
});

server.listen(8000, 'localhost', () => {
  console.log('listening at 8000 port!');
});
