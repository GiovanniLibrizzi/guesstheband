import { useState } from "react";
import axios from "axios";
import AdminLogin from "../components/AdminLogin.jsx";

import "../css/Admin.css";

function AdminSubmit() {
  const [band, setBand] = useState({
    is_artist_solo: false,
    name: null,
    years_active: null,
    location: null,
    genre: null,
    subgenres: null,
    monthly_listeners: null,
    notable_is_first_work: false,
    notable_release_date: null,
    notable_work_name: null,
    members: null,
    top_song_5: null,
    top_song_4: null,
    top_song_3: null,
    top_song_2: null,
    top_song_1: null,
    album_count: null,
    ep_count: null,
    label_name: null,
  });
  var bandImageSubmitted = false;

  var noMembers = false;

  const handleChange = (e) => {
    if (e.target.name == "img_band" || e.target.name == "img_album") {
      return;
    }
    var value = e.target.value;

    if (
      e.target.name == "is_artist_solo" ||
      e.target.name == "notable_is_first_work"
    ) {
      //console.log("checked:", e.target.checked);
      value = e.target.checked;
    }

    setBand((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (band.is_artist_solo) {
      band.members = null;
    }

    var invalidNull = false;
    for (const key in band) {
      switch (key) {
        case "members":
          if (band[key] == null || band[key] == "") {
            // check if band member image has been uploaded
            if (bandImageSubmitted) {
              break;
            }
            //invalidNull = true;
            noMembers = true;
            //console.log(`${key} was found with an empty value! Cannot submit.`);

            break;
          }
          break;
        case "ep_count":
          break;
        case "label_name":
          break;
        case "is_artist_solo":
          break;
        case "notable_is_first_work":
          break;
        default:
          if (band[key] == null || band[key] == "") {
            invalidNull = true;
            alert(`${key} was found with an empty value! Cannot submit.`);
            console.log(`${key} was found with an empty value! Cannot submit.`);
          }
          break;
      }
      //console.log(key, " ||| ", band[key]);
    }

    try {
      await axios.post("http://localhost:8800/bands", band);
      alert("Successfully entered!");
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
    //console.log("Band object:", band);
  };

  const handleShuffle = async (e) => {
    // try {
    //   const res = await axios.get("http://localhost:8800/bands/upcoming");
    //   console.log(res.data);
    //   const latestDate = new Date(res.data[0].date);
    //   const increasedDate = new Date(latestDate);
    //   increasedDate.setDate(latestDate.getDate() + 1);
    //   console.log("latest", latestDate);
    //   console.log("increased", increasedDate);
    // } catch (err) {
    //   console.log(err);
    // }
    try {
      await axios.post("http://localhost:8800/bands/daily/shuffle");
    } catch (err) {
      console.log(err);
    }
  };

  const submitHTML = (
    <>
      <h3>Submit a band entry into the database</h3>

      <form onChange={handleChange} autocomplete="off">
        <p>Entry is an artist (and not a band)</p>
        <input
          type="checkbox"
          placeholder="Is an artist (and not a band)"
          name="is_artist_solo"
        ></input>
        <input placeholder="Band name" name="name"></input>
        <input placeholder="Years active" name="years_active"></input>
        <input placeholder="Location" name="location"></input>
        <input placeholder="Main genre" name="genre"></input>
        <input placeholder="Subgenres" name="subgenres"></input>
        <input
          type="number"
          placeholder="Monthly listeners"
          name="monthly_listeners"
        ></input>

        <p>Notable release is first work</p>
        <input
          type="checkbox"
          placeholder="Notable is first work"
          name="notable_is_first_work"
        ></input>
        <input placeholder="Notable work name" name="notable_work_name"></input>
        <p>Notable release is first work</p>

        <input
          type="date"
          placeholder="Notable release date"
          name="notable_release_date"
        ></input>
        <input placeholder="Top song #5" name="top_song_5"></input>
        <input placeholder="Top song #4" name="top_song_4"></input>
        <input placeholder="Top song #3" name="top_song_3"></input>
        <input placeholder="Top song #2" name="top_song_2"></input>
        <input placeholder="Top song #1" name="top_song_1"></input>
        <input
          type="number"
          placeholder="Album count"
          name="album_count"
        ></input>
        <input type="number" placeholder="EP count" name="ep_count"></input>
        <input placeholder="Label name(s)" name="label_name"></input>
        {!band.is_artist_solo && (
          <>
            <input placeholder="Band members" name="members"></input>
          </>
        )}
      </form>

      {!band.is_artist_solo && (
        <>
          <p>Band members image</p>
          <input
            type="file"
            accept=".jpg"
            placeholder="img_band"
            name="img_band"
          ></input>{" "}
        </>
      )}

      <p>Notable album cover image</p>
      <input
        type="file"
        accept=".jpg"
        placeholder="img_album"
        name="img_album"
      ></input>

      <br></br>
      <br></br>
      <button onClick={handleSubmit}>Submit new band entry</button>

      <button onClick={handleShuffle}>Shuffle</button>
    </>
  );

  return <AdminLogin renderHTML={submitHTML} />;
}

export default AdminSubmit;
