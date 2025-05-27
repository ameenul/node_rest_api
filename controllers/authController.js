const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Import the database connection

const registerUser =async (req, res) => {
    console.log('→ payload:', req.body);
    const {name, email, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(sql, [name, email, hashedPassword], (err, result) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).json({error: 'Database error'});
        }
                res.status(201).json({message: 'User registered successfully'});
    });
};   

 const loginUser = (req, res) => {
    const {email, password} = req.body;
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], async (err, result) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({error: 'Database error'});
        }
        if (result.length === 0) {
            return res.status(401).json({error: 'Invalid email or password'});
        }
        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({error: 'Invalid email or password'});
        }
         const token = jwt.sign({id: user.id}, process.env.jwt_secret_key, {expiresIn: '1h'});
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }});
        
    });
 };


// const hello= (req, res) => {
//     res.status(200).send('Hello World!');
// };

module.exports = {registerUser, loginUser};