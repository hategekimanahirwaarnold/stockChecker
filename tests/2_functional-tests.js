const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
let likes;

suite('Functional Tests', function() {
    // Viewing one stock: GET request to /api/stock-prices/
    test('Viewing one stock: GET request to /api/stock-prices/', function() {
        chai
          .request(server)
          .keepOpen()
          .get('/api/stock-prices')
          .query({ stock: 'goog' })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'stockData');
            assert.property(res.body.stockData, 'stock');
            assert.property(res.body.stockData, 'price');
            assert.property(res.body.stockData, 'likes');
          })
      
      });
    // Viewing one stock and liking it: GET request to /api/stock-prices/
    test('Viewing one stock and liking it: GET request to /api/stock-prices/', function() {
        chai
          .request(server)
          .keepOpen()
          .get('/api/stock-prices')
          .query({ stock: 'goog', like: true})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'stockData');
            assert.property(res.body.stockData, 'stock');
            assert.property(res.body.stockData, 'price');
            assert.property(res.body.stockData, 'likes');
            assert.notEqual(res.body.stockData.likes, 0);
            likes = res.body.stockData.likes;
          })
      
      });
    // Viewing the same stock and liking it again: GET request to /api/stock-prices/
    test('Viewing the same stock and liking it again: GET request to /api/stock-prices/', function() {
      chai
        .request(server)
        .keepOpen()
        .get('/api/stock-prices')
        .query({ stock: 'goog', like: true})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'stockData');
          assert.property(res.body.stockData, 'stock');
          assert.property(res.body.stockData, 'price');
          assert.property(res.body.stockData, 'likes');
          assert.equal(res.body.stockData.likes, likes);
        })
    
    });
    // Viewing two stocks: GET request to /api/stock-prices/
    test('Viewing the same stock and liking it again: GET request to /api/stock-prices/', function() {
      chai
        .request(server)
        .keepOpen()
        .get('/api/stock-prices/stock=GOOG&stock=MSFT&like=false')
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'stockData');
          assert.property(res.body.stockData[0], 'stock');
          assert.property(res.body.stockData[1], 'price');
          assert.property(res.body.stockData[1], 'likes');
          assert.equal(res.body.stockData.length, 2);
        })
    
    });
    // Viewing two stocks and liking them: GET request to /api/stock-prices/
    test('Viewing the same stock and liking it again: GET request to /api/stock-prices/', function() {
      chai
        .request(server)
        .keepOpen()
        .get('/api/stock-prices/stock=GOOG&stock=MSFT&like=true')
        .query({ stock: 'AAPL', stock: 'goog', like: true})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData.length, 2);
        })
    
    });
});
