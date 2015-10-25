
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var locationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String },
    addr: { type: String },
    san5: { type: Number },
    san7: { type: Number },
    san11: { type: Number },
    loc: {
        type: { type: String },
        coordinates: { type: [Number] }
    }
});

locationSchema.index({ loc: '2dsphere' });

module.exports = mongoose.model('Location', locationSchema);
