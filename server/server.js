
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

app.get("/bands/date", (req, res) => {
	const date = req.query.date;
	console.log("date",date);
	const q = 
	`SELECT * FROM db.bands b
	INNER JOIN db.daily_bands d ON d.band_id=b.id
	WHERE date=?;`;
	db.query(q, [date], (err, data) => {
		if (err) {
			return res.json(err);
		}
		return res.json(data);
	})
})

app.get("/bands/dates", (req, res) => {
	const date = req.query.date;
	console.log("date",date);
	const q = 
	`SELECT * FROM db.bands b
	INNER JOIN db.daily_bands d ON d.band_id=b.id;`;
	db.query(q, (err, data) => {
		if (err) {
			return res.json(err);
		}
		return res.json(data);
	})
})

// Insert band into backend
app.post("/bands", (req, res) => {
	const q = "INSERT INTO bands (`is_artist_solo`, `name`, `years_active`, `location`, `genre`, `subgenres`, `monthly_listeners`, `notable_release_date`, `notable_is_first_work`, `notable_work_name`, `members`, `top_song_5`, `top_song_4`, `top_song_3`, `top_song_2`, `top_song_1`, `album_count`, `ep_count`, `label_name`) VALUES (?)"
	//const values = ["Woe Boys", 2020, "San Luis Obispo, CA", "dream pop", 26];
	const values = [
		req.body.is_artist_solo,
		req.body.name,
		req.body.years_active,
		req.body.location,
		req.body.genre,
		req.body.subgenres,
		req.body.monthly_listeners,
		req.body.notable_release_date,
		req.body.notable_is_first_work,
		req.body.notable_work_name,
		req.body.members,
		req.body.top_song_5,
		req.body.top_song_4,
		req.body.top_song_3,
		req.body.top_song_2,
		req.body.top_song_1,
		req.body.album_count,
		req.body.ep_count,
		req.body.label_name,
	]

	db.query(q, [values], (err, data) => {
		if (err) {
			console.log(err);
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

app.delete("/bands/:id", (req, res) => {
	const bandId = req.params.id;
	const q = "DELETE FROM bands WHERE id = ?"

	db.query(q, [bandId], (err, data) => {
		if (err) {
			return res.json(err);
		}
		return res.json("Band has been deleted successfully.");
	})
})

app.get("/accounts", (req, res) => {
	const username = req.query.username;
	//console.log("EXPRESS: USERNAME:", username);
	const q = `SELECT * FROM db.accounts WHERE username=?`;
	
	db.query(q, [username], (err, data) => {
		if (err) {
			return res.json(err);
		}
		return res.json(data);
	})
})

// app.get("/accounts", (req, res) => {
// 	const q = `SELECT * FROM db.accounts`;
	
// 	db.query(q, (err, data) => {
// 		if (err) {
// 			return res.json(err);
// 		}
// 		return res.json(data);
// 	})
// })



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

