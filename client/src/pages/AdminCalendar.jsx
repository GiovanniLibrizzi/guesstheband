import React from "react";
import { useState } from "react";
import axios from "axios";
import "../css/Admin.css";
import { login } from "../components/AdminLogin";

function AdminCalendar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [queryDate, setQueryDate] = useState(null);
  const [band, setBand] = useState(null);
  const [bands, setBands] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    var success = await login("admin", password);
    if (success) {
      setLoggedIn(true);
    } else {
      alert("Incorrect login!");
    }
  };

  const handleFetch = async (e) => {
    e.preventDefault();

    const dateObj = {
      date: queryDate,
    };
    if (dateObj.date == null) {
      alert("Date is null!");
      return;
    }
    console.log(dateObj);

    try {
      const res = await axios.get("http://localhost:8800/bands/date", {
        params: dateObj,
      });
      const resBand = res.data[0];
      setBand(resBand);
      console.log(band);
    } catch (err) {
      console.log(err);
    }
  };

  if (!loggedIn) {
    return (
      <>
        <form onSubmit={handleLogin}>
          <p>Password:</p>
          <input
            type="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <button>Login</button>
        </form>
      </>
    );
  } else {
    return (
      <>
        <p>Select a date</p>
        <input
          type="date"
          onChange={(e) => setQueryDate(e.target.value)}
        ></input>
        <button onClick={handleFetch}>Fetch</button>
      </>
    );
  }
}

export default AdminCalendar;
