const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/myDB');

var Item = require('./app/models/item.js');

const router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res){
    res.json({message: 'Yeah, Welcome to my api.'});
})

router.route('/items')
.post(function(req, res){
    var item = new Item();
    item.name = req.body.name;
    item.price = req.body.price;
    item.brand = req.body.brand;

    item.save(function(err){
        if(err){
            res.status(500);
            res.json({
                status: 500,
                error: err
            });
            res.end();
        }

        res.json({ message: item });
    });
})
 // get all the items (accessed at GET http://localhost:8080/api/items)
 .get(function(req, res) {
    Item.find(function(err, items) {
        if (err)
            res.send(err);

        res.json(items);
    });
});

router.route('/items/:item_id')
// delete the item with this id (accessed at DELETE http://localhost:8080/api/items/:item_id)
.delete(function(req, res) {
    Item.remove({
        _id: req.params.item_id
    }, function(err, item) {
        if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

app.listen(port);
console.log('Server started at '+port+'...');