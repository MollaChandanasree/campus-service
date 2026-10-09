const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sree@2006', // Change this to your MySQL password
    database: 'smart_campus'
});

db.connect(err => { if (err) throw err; console.log('MySQL Connected...'); });

// Registration
app.post('/api/register', (req, res) => {
    const { username, password, role } = req.body;
    db.query("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", 
    [username, password, role], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ message: "Registered" });
    });
});

// Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.query("SELECT * FROM users WHERE username = ? AND password = ?", 
    [username, password], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length > 0) res.json({ success: true, user: results[0] });
        else res.status(401).json({ success: false });
    });
});

// Requests
app.get('/api/requests', (req, res) => {
    db.query("SELECT * FROM requests", (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.post('/api/requests', (req, res) => {
    const { name, email, service, location, description, submitted_by } = req.body;
    db.query("INSERT INTO requests (name, email, service, location, description, submitted_by) VALUES (?, ?, ?, ?, ?, ?)", 
    [name, email, service, location, description, submitted_by], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ message: "Request Saved" });
    });
});

app.put('/api/requests/:id', (req, res) => {
    db.query("UPDATE requests SET status = 'Completed' WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ message: "Updated" });
    });
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
