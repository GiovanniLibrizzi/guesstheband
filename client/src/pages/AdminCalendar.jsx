import { useState } from "react";
import axios from "axios";
import "../css/Admin.css";
import AdminLogin from "../components/AdminLogin";

function AdminCalendar() {
  const [queryDate, setQueryDate] = useState(null);
  const [band, setBand] = useState(null);
  const [bands, setBands] = useState(null);

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

  const calendarHTML = (
    <>
      <p>Select a date</p>
      <input type="date" onChange={(e) => setQueryDate(e.target.value)}></input>
      <button onClick={handleFetch}>Fetch</button>
    </>
  );

  return <AdminLogin renderHTML={calendarHTML} />;
}

export default AdminCalendar;
