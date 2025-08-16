import { useState, useEffect } from "react";
import axios from "axios";
import "../css/Admin.css";
import AdminLogin from "../components/AdminLogin";

function ImageTest() {
  const [image, setImage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    //console.log("target", target.files);

    const formData = new FormData();
    // formData.append("my-image-file", image, image.name);

    // axios.post(`${process.env.DB_URL}/image/album`, formData).then((res) => {
    //   console.log("Axios response: ", res);
    // });
    try {
      const res = await axios.get(`${process.env.DB_URL}/bands/latest_id`);
      //console.log(res);
      var filename = res.data;
      console.log(filename);

      formData.append("my-image-file", image, filename + ".jpg");

      axios.post(`${process.env.DB_URL}/image/album`, formData).then((res) => {
        console.log("Axios response: ", res);
      });
    } catch (err) {
      console.log(err);
    }
  }

  function handleChange(e) {
    const target = e.target;

    setImage(target.files[0]);
  }

  const testHtml = (
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

  return <AdminLogin renderHTML={testHtml} />;
}

export default ImageTest;
