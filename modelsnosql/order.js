const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({

    orderId: {
        type: String,
    },
    
    status: {
        type: String,
    },
    
    paymentId: {
        type: String,
    },

    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }

});

module.exports = mongoose.model('Order', orderSchema);



