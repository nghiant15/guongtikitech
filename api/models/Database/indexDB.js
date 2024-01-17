var mongoose = require('mongoose');
var config = require('./../../config/configDB');
// mongoose.set("useCreateIndex", true);
// mongoose.set("useNewUrlParser", true);
// mongoose.set("useUnifiedTopology", true);
// mongoose.set("useFindAndModify", false);

let options = { 
    useNewUrlParser: true, useUnifiedTopology: true 
}

mongoose.connect(`mongodb://127.0.0.1:27017/dbapp`, options)
    .catch(error => {
        console.log('connection error:', error)
    });

var db = mongoose.connection;
db.once('open', function () {
    console.log("connect db success");
});
db.on('reconnect', () => {
    console.log('-> reconnected');
});
db.on('close', () => {
    console.log('-> lost connection');
});
module.exports = db;