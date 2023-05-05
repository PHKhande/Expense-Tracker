const process = require('process');
const Razorpay = require('razorpay');

// const Order = require('../models/premiumOrders');

const Order = require('../models/premiumOrders');

exports.getpurchasePremium = async (req, res, next) => {

    try{
        const rzp = new Razorpay({
            key_id: process.env.KEY_ID_RAZORPAY,
            key_secret: process.env.KEY_SECRET_RAZORPAY
        });
        console.log(rzp);

        const amount = 2500;

        const order = await rzp.orders.create( {amount, currency: "INR"} );

        const neworders = new Order({
            orderId: order.id,
            status : 'PENDING',
            userId: req.user
        })
        neworders.save();
        // await req.user.createOrder({
        //     orderId: order.id,
        //     status : 'PENDING'
        // });

        res.status(201).json( {order, key_id: rzp.key_id} );
    }

    catch(err){
        console.log(err);
        res.status(404).json({message:err});
    }

}

exports.postTransactionStatus = async( req, res, next) => {
 
    try{
        const {order_id, payment_id, status} = req.body;

        const singleOrder = await Order.find( {orderId: order_id } );
        const lastOrder = singleOrder[0];
        lastOrder.status = status;
        lastOrder.paymentId = payment_id;
        lastOrder.save();

        // const singleOrder = await Order.findOne( {where: {orderId: order_id} } );

        // await singleOrder.update( {paymentId: payment_id, status: status} );

        if (status === "SUCCESSFUL"){

            const user = req.user
            user.isPremium = true
            user.save();

            // await req.user.update({ isPremium: true })
            // res.status(202).json( {singleOrder, message: "Transaction Successful"} );
            res.status(202).json( {lastOrder, message: "Transaction Successful"} );

        }
        else{

            // res.status(202).json( {singleOrder, message: "Transaction Failed"} );
            res.status(202).json( {lastOrder, message: "Transaction Failed"} );

        }
        
    } 

    catch(err){ 
        console.log(err);
        res.status(404).json({message:err});
    }
 
}