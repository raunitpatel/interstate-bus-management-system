const router = require('express').Router();
const db = require('../config/dbConfig');
const { createUser } = require('../models/usersModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// register new user
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const checkUserExistsQuery = 'SELECT * FROM users WHERE email = $1';
        const userExists = await db.query(checkUserExistsQuery, [email]);
        console.log(userExists.rows.length)
        if (userExists.rows.length > 0) {
            return res.send({
                message: 'User already exists',
                success: false,
                data: null,
            });
        }
        // No user exists, proceed with creating a new user
        const newUser = await createUser(name, email, password);
        
        res.send({
            message: 'User created successfully',
            success: true,
            data: newUser,
        });

    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false,
            data: null,
        });
    }
});

router.post('/login', async (req, res) =>{
    try{
        const userExistsQuery = 'SELECT * FROM users WHERE email = $1';
        const userExists = await db.query(userExistsQuery, [req.body.email]);
        if(userExists.rows.length === 0){
            return res.send({
                message: 'User does not exist',
                success: false,
                data: null,
            });
        }
        const user = userExists.rows[0];
        const passwordMatch = await bcrypt.compare(req.body.password, user.password_hash);
        if(!passwordMatch){
            return res.send({
                message: 'Incorrect password',
                success: false,
                data: null,
            });
        }

        const token = jwt.sign({userId: user.userid}, process.env.jwt_secret, {expiresIn: '1d'});
        res.send({
            message: 'Login successful',
            success: true,
            data: token,
        });
    } catch(error){
        res.status(500).send({
            message: error.message,
            success: false,
            data: null,
        });
    }
});


module.exports = router;
