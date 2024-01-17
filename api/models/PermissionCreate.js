var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const PermissionCreate = new Schema({
   
});

module.exports = mongoose.model('PermissionCreate', PermissionCreate, 'PermissionCreate');