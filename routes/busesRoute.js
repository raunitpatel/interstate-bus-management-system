const router = require('express').Router();
const db = require('../config/dbConfig');
const authMiddleware = require('../middlewares/authMiddleware');
const { addBus } = require('../models/busModel');
require('dotenv').config();


// add bus
router.post('/add-bus',authMiddleware, async (req, res) => {
    const { busnumber, busid, capacity, origin, destination, dates, departuretime, arrivaltime, amount } = req.body;

    try {
        const checkBusExistsQuery = 'SELECT * FROM buses WHERE busid = $1';
        const busExists = await db.query(checkBusExistsQuery, [busid]);
        if (busExists.rows.length > 0) {
            return res.send({
                message: 'Bus already exists',
                success: false,
                data: null,
            });
        }
        // No bus exists, proceed with creating a new bus
        const newBus = await addBus(busnumber, busid, capacity, origin, destination, dates, departuretime, arrivaltime, amount);

        res.send({
            message: 'Bus added successfully',
            success: true,
            data: newBus,
        });

    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false,
            data: null,
        });
    }
});

// get all buses
router.post('/get-all-buses',authMiddleware, async (req, res) => {
    try {
        const allBuses = await db.query('SELECT * FROM buses');
        res.send({
            message: 'Buses fetched successfully',
            success: true,
            data: allBuses.rows,
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false,
            data: null, 
        });
    }
});

// update bus
router.post('/update-bus',authMiddleware, async (req, res) => {
    try{
        const checkBusExistsQuery = 'SELECT * FROM buses WHERE busid = $1';
        console.log(req.body);
        const { busnumber, busid, capacity, origin, destination, dates, departuretime, arrivaltime, amount } = req.body;
        const updateBusQuery = 'UPDATE buses SET busnumber = $1, capacity = $2, origin = $3, destination = $4, dates = $5, departuretime = $6, arrivaltime = $7, amount = $8 WHERE busid = $9';
        const updatedBus = await db.query(updateBusQuery, [busnumber, capacity, origin, destination, dates, departuretime, arrivaltime, amount, busid]);
        res.send({
            message: 'Bus updated successfully',
            success: true,
            data: updatedBus.rows,
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false,
            data: null,
        });
    }
});

// delete bus
router.post('/delete-bus',authMiddleware, async (req, res) => {
    try {
        const { busid } = req.body;
        console.log(req.body);
        const deleteBusQuery = 'DELETE FROM buses WHERE busid = $1';
        const deletedBus = await db.query(deleteBusQuery, [busid]);
        res.send({
            message: 'Bus deleted successfully',
            success: true,
            data: deletedBus.rows,
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false,
            data: null,
        });
    }
});

module.exports = router;
