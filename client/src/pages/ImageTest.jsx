import { useState, useEffect } from "react";
import axios from "axios";
import "../css/Admin.css";

function ImageTest() {
  const [file, setFile] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    if (file == null) {
      return;
    }

    console.log("file", file);

    const formData = new FormData();
    formData.append("file", file);
  }
  function handleChange(e) {
    const target = e.target;
    console.log("target", target.files);
    setFile(target.files[0]);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".jpg"
          placeholder="img_album"
          name="img_album"
          onChange={handleChange}
        ></input>
        <button onClick={handleSubmit}>Submit image</button>
      </form>
    </>
  );
}

export default ImageTest;
