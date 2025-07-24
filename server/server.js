
//import express from "express"
const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const fs = require('fs')



const app = express()
const port = process.env.DB_PORT



const db = mysql.createConnection({
	host: process.env.DB_HOST,//"localhost",
	user: process.env.DB_USER,//"root",
	password: process.env.DB_PASSWORD,
	database: process.env.DB_SCHEMA, //"db",
	ssl: process.env.TIDB_ENABLE_SSL === 'true' ? {
         minVersion: 'TLSv1.2',
         ca: process.env.TIDB_CA_PATH ? fs.readFileSync(process.env.TIDB_CA_PATH) : undefined
      } : null,

});

app.use(express.json())
app.use(cors())

app.get("/", (req, res)=>{
	res.json("Hello")
})


app.get("/bands", (req,res) => {
	const q = "SELECT * FROM bands"
	db.query(q, (err, data) => {
		if (err) {
			return res.json(err)
		} 
		return res.json(data)	
	})
})

app.get("/bands/today", (req, res) => {
	const q = 
	`SELECT * FROM db.bands b
	INNER JOIN db.daily_bands d ON d.band_id=b.id
	WHERE CURDATE()=date;`;
	db.query(q, (err, data) => {
		if (err) {
			return res.json(err);
		}
		return res.json(data);
	})
})

// Insert band into backend
app.post("/bands", (req, res) => {
	const q = "INSERT INTO bands (`name`, `year`, `location`, `genres`, `monthly_listeners`) VALUES (?)"
	//const values = ["Woe Boys", 2020, "San Luis Obispo, CA", "dream pop", 26];
	const values = [
		req.body.name,
		req.body.year,
		req.body.location,
		req.body.genres,
		req.body.monthly_listeners
	]

	db.query(q, [values], (err, data) => {
		if (err) {
			return res.json(err)
		}
		return res.json("Band has been created successfully.")
		
	});
});

app.post("/time", (req, res) => {
	const q = "CURDATE()"
	db.query(q, (err, data) => {
		if (err) {
			return res.json(err);
		}
		return res.json(data);
	})
})

app.listen(port, () => {
	console.log(`Connected to backend on ${port}`)
})




// app.get('/insert', (req, res) => {
// 	db.query('INSERT INTO bands (name, monthly_listeners) VALUES ("Woe Boys", 25)', (err, result) => {
// 		if (err) {
// 			console.log(err)
// 		}
		
// 		res.send(result);
// 	})
// })

