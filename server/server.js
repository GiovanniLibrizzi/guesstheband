
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
	multipleStatements: true,

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
	//console.log("date",date);
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
app.get("/bands/date/id", (req, res) => {
	const id = req.query.id;
	//console.log("id",id);
	const q = 
	`SELECT * FROM db.bands b
	INNER JOIN db.daily_bands d ON d.band_id=b.id
	WHERE d.id=(?);`;
	db.query(q, [id], (err, data) => {
		if (err) {
			return res.json(err);
		}
		return res.json(data);
	})
})

app.get("/bands/dates", (req, res) => {
	const date = req.query.date;
	//console.log("date",date);
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

app.get("/bands/upcoming", (req, res) => {
	const q = 
	`SELECT * FROM db.daily_bands
	WHERE date > CURDATE()
	ORDER BY date DESC;`;

	db.query(q, (err, data) => {
		if (err) {
			return res.json(err);
		}
		console.log(data);
		return res.json(data);
	})
})


// Insert band into backend
app.post("/bands", (req, res) => {
	const q = "INSERT INTO bands (`is_artist_solo`, `name`, `years_active`, `location`, `genre`, `subgenres`, `monthly_listeners`, `notable_release_date`, `notable_is_first_work`, `notable_work_name`, `members`, `top_song_5`, `top_song_4`, `top_song_3`, `top_song_2`, `top_song_1`, `album_count`, `ep_count`, `label_name`) VALUES (?)"
	// insert into bands db
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

	var bandId = null;
	db.query(q, [values], (err, data) => {
		if (err) {
			console.log(err);
			return res.json(err)
		}
		//console.log(res.json(data));
		//bandId = data[0].band_id;
		//return res.json("Band has been created successfully.")
		
	});

	// Get last insert ID, then insert into daily_bands db with a new unused date
	const q2 = 
	`SELECT LAST_INSERT_ID()`
	db.query(q2, (err, data) => {
		if (err) {
			return res.json(err);
		}
		bandId = Object.values(data[0])[0];

		// get previous date
		const q3 = 
		`SELECT * FROM db.daily_bands
		WHERE date > CURDATE()
		ORDER BY date DESC;`;

		var newDate = null;
		//var bandId = null;

		db.query(q3, (err, data) => {
			if (err) {
				return res.json(err);
			}

			//bandId = data[0].band_id;
			const latestDate = new Date(data[0].date);
			newDate = new Date(latestDate);
			newDate.setDate(latestDate.getDate() + 1);
			console.log("latest", latestDate);
			console.log("increased", newDate);
			console.log(data);
			//return res.json(data);

			
			// insert into daily_bands db
			const q4 = 
			"INSERT INTO daily_bands (`date`, `band_id`) VALUES (?)"
			const values3 = [
				newDate,
				bandId
			]
			db.query(q4, [values3], (err, data) => {
				if (err) {
					console.log(err);
					return res.json(err);
				}
				return res.json("Band has been inserted successfully.");
			});
		})
	})

	




});

app.post("/bands/daily/shuffle", (req, res) => {
	// get previous date
	const q = 
	`SELECT * FROM db.daily_bands
	WHERE date > CURDATE()
	ORDER BY date ASC;`;

	

	db.query(q, (err, data) => {
		if (err) {
			return res.json(err);
		}

		console.log(data);
		const startId = data[0].id;
		const bandIds = []
		const dayIds = []

		data.forEach(e => {
			bandIds.push(e.band_id)
			dayIds.push(e.id);
			//console.log(element.band_id)
		});
		console.log(startId, bandIds);

		var q2 = "";
		shuffle(bandIds);
		console.log(bandIds);


		bandIds.forEach((e, i) => {
			q2 += `UPDATE db.daily_bands SET band_id = ${e} WHERE (id = ${dayIds[i]}); `
		})

		// q2 = `UPDATE db.daily_bands SET band_id = 10 WHERE (id = 8);`

		console.log(q2);

		db.query(q2, (err, data) => {
				if (err) {
					console.log(err);
					return res.json(err);
				}
				return res.json("Upcoming daily bands have successfully been shuffled.");
			});
		
	})
})


// app.post("/bands/daily/swap", (req, res) => {
// 	// get previous date
// 	const q = 
// 	`SELECT * FROM db.daily_bands
// 	WHERE date > CURDATE()
// 	ORDER BY date ASC;`;

	

// 	db.query(q, (err, data) => {
// 		if (err) {
// 			return res.json(err);
// 		}

// 		console.log(data);
// 		const startId = data[0].id;
// 		const bandIds = []
// 		const dayIds = []

// 		data.forEach(e => {
// 			bandIds.push(e.band_id)
// 			dayIds.push(e.id);
// 			//console.log(element.band_id)
// 		});
// 		console.log(startId, bandIds);

// 		var q2 = "";
// 		shuffle(bandIds);
// 		console.log(bandIds);


// 		bandIds.forEach((e, i) => {
// 			q2 += `UPDATE db.daily_bands SET band_id = ${e} WHERE (id = ${dayIds[i]}); `
// 		})

// 		// q2 = `UPDATE db.daily_bands SET band_id = 10 WHERE (id = 8);`

// 		console.log(q2);

// 		db.query(q2, (err, data) => {
// 				if (err) {
// 					console.log(err);
// 					return res.json(err);
// 				}
// 				return res.json("Upcoming daily bands have successfully been shuffled.");
// 			});
		
// 	})


	
// })


// Get stats
app.get("/bands/daily/stats", (req, res) => {
	const day_id = req.query.day_id;
	//console.log("date",date);
	const q = 
	`SELECT * FROM db.stats WHERE day_id=?`;
	db.query(q, [day_id], (err, data) => {
		if (err) {
			return res.json(err);
		}
		return res.json(data);
	})
})

// Set stats in the server for every day's games
app.post("/bands/daily/stats", (req, res) => {
	const day_id = req.body.day_id;
	// detect if row needs to be inserted
	const q = `SELECT EXISTS(SELECT * FROM db.stats WHERE day_id=?);`;

	

	db.query(q, [day_id], (err, data) => {
		if (err) {
			return res.json(err);
		}

		const exists = Object.values(data[0])[0];

		var q2 = ""
		if (!exists) {
			// insert row if it needs to be inserted
			q2 += `INSERT INTO db.stats (day_id) VALUES (${day_id}); `;
		}
		
		// update in# columns
		var columns = []
		for (var i = 0; i < Object.keys(req.body).length; i++) {
			var key = Object.keys(req.body)[i];
			var value = Object.values(req.body)[i];
			if (key != "day_id") {
				if (value > 0) {
					columns.push(key);
				}
				console.log("key", key);
			}
		}

		columns.forEach((e) => {
			q2 += `UPDATE db.stats SET ${e} = ${e} + 1 WHERE (day_id = ${day_id}); `;
		})

		// update knew it columns


		console.log(q2);

		db.query(q2, (err, data) => {
			if (err) {
				console.log(err);
				return res.json(err);
			}
			return res.json("Play stats have been added to the database.");
		});

	})
})

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




app.listen(port, () => {
	console.log(`Connected to backend on ${port}`)
})



function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}