'use strict';
const { response } = require("express");
const Stock = require("../models/stock");


let addStock = async (stock,like, ip) => {
  let data;
  if (like == "true")
    data = new Stock({name: stock, likes: ip});
  else
    data = new Stock({name: stock}); 
  return data.save()
  .then(res => {
    // console.log(res);
    return(res);
  })
  .catch(err => console.log("Error: ", err));
}

let process = async (stock, like, ip) => {
  const fcc = await fetch(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`);
  const { latestPrice } = await fcc.json();

  if (latestPrice) {
    const db = await Stock.findOne({name: stock});
    if (db) {
      if (like == 'true') {
          if (db.likes && db.likes.includes(ip)) {
            // console.log("Ip is in.");
            return({"stockData":{"stock":stock,"price":latestPrice,"likes": db.likes? db.likes.length : 0}});
          } else {
            // console.log("The ip not already in.", like);
            // console.log({"stockData":{"stock":stock,"price":latestPrice,"likes": db.likes? db.likes.length : 0}});
            db.likes ? db.likes.push(ip) : db.likes = [ip];
            db.save()
            .then(data => {
              // console.log("The ip was new. New likes: ", data.likes);
              // console.log({"stockData":{"stock":stock,"price":latestPrice,"likes":db.likes.length}})
              return ({"stockData":{"stock":stock,"price":latestPrice,"likes": db.likes ? data.likes.length : 0}});
            }).catch(err => console.log("Error: ", err));
          }
      } else {
        // console.log({"stockData":{"stock":stock,"price":latestPrice,"likes": db.likes ? db.likes.length : 0}})
        return({"stockData":{"stock":stock,"price":latestPrice,"likes": db.likes ? db.likes.length : 0}});
      }
    } else {
      let data = await addStock(stock, like, ip);
      if (data) {
        return ({"stockData":{"stock":stock,"price":latestPrice,"likes": data.likes ? data.likes.length : 0}});
      }
    }

  } else {
    return {"stockData": {"error": "invalid symbol"}}
  }
}

module.exports = function (app) {
  app.route('/api/stock-prices')
    .get(async function (req, res){
      let { stock, like } = req.query;
      let size = stock.length;
      console.log(stock, like);
      if (size == 2 && stock[0][0]) {
        let result = await Promise.all(stock.map(item => process(item, like, req.ip)));
        let diff = result[0]["stockData"]["likes"] -  result[1]["stockData"]["likes"];
        let result1 = {stock: result[0]["stockData"]["stock"],price: result[0]["stockData"]["price"],rel_likes: diff};
        let result2 = {stock: result[1]["stockData"]["stock"],price: result[1]["stockData"]["price"],rel_likes: -diff};
        let response = {"stockData": [result1, result2]};
        // console.log("response", response, "diff: ", diff);
        res.send(response);
      } else {
        const response = await process(stock, like, req.ip);
        // console.log("response",response);
        res.send(response);
      }
    });

};
