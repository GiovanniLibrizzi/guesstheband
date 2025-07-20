import { useState, useEffect } from "react";
import axios from "axios";
import "../css/Home.css";

function Home() {
  const [bands, setBands] = useState([]);
  const test = "hi";
  var date = new Date();

  useEffect(() => {
    const fetchAllBands = async () => {
      try {
        const res = await axios.get("http://localhost:8800/bands");
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllBands();
  }, []);

  return (
    <div className="App">
      <p>Band</p>
      <form>
        <input placeholder="Enter your guess" />
      </form>
      <p>{`test: ${date.toLocaleString()}`}</p>
    </div>
  );
}

export default Home;

// 	const handleSearch = async (e) => {
// 		e.preventDefault(); // prevent page refresh
// 		if (!searchQuery.trim()) return;
// 		if (loading) return;
// 		setLoading(true);

// 		try {
// 		const searchResults = await searchMovies(searchQuery);
// 		setMovies(searchResults);
// 		setError(null);
// 		} catch (err) {
// 		console.log(err);
// 		setError("Failed to search movies...");
// 		} finally {
// 		setLoading(false);
// 		}
//   };
