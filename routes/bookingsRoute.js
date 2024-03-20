const router = require('express').Router();
const db = require('../config/dbConfig');
const authMiddleware = require('../middlewares/authMiddleware');
const { bookseat } = require('../models/bookingsModel');
require('dotenv').config();
const stripe = require('stripe')(process.env.stripe_key);
const { v4: uuidv4 } = require('uuid');

// book seat
router.post('/book-seat', authMiddleware, async (req, res) => {
    const { busid, userId, seatnumber,paymentid } = req.body;
    console.log(req.body);
    try {
        const newSeats = [];
        for (const seat of seatnumber) {
                const seatNumberInt = parseInt(seat);
                const newSeat = await bookseat(busid, userId, seatNumberInt,paymentid);
                newSeats.push(newSeat);
        }
        res.send({
            message: 'Seats booked successfully',
            success: true,
            data: newSeats,
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false,
            data: null,
        });
    }
});

// get booked seat by busid
router.post('/get-booked-seat', authMiddleware, async (req, res) => {
    const { busid } = req.body;
    const busidInt = parseInt(busid);
    console.log(busid);
    try {
        const bookedSeats = await db.query('SELECT seatnumber FROM bookings WHERE busid = $1', [busidInt]);
        res.send({
            message: 'Booked seats fetched successfully',
            success: true,
            data: bookedSeats.rows,
        });
        console.log(bookedSeats.rows);
    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false,
            data: null,
        });
    }
});

// make payment
router.post('/make-payment', authMiddleware, async (req, res) => {
    try {
        console.log(req.body);
        const {token,amount} =req.body;
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        });
        const payment = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'inr',
            customer: customer.id,
            receipt_email: token.email
        },{
            idempotencyKey: uuidv4(),
        });
        if(payment){
            res.status(200).send({
                message: 'Payment successful',
                success: true,
                data: {paymentid : payment.id},
            });
        }
        else{
            res.send({
                message: 'Payment failed',
                success: false,
                data: null,
            });
        }
    }catch(error){
        
        res.status(500).send({
            message: error.message,
            success: false,
            data: null,
        });
    }
});


module.exports = router;
