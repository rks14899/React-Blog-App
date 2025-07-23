import axios from "axios";
import "./write.css";
import { useState, useContext } from "react";
import { Context } from "../../context/Context";

export default function Write() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const { user } = useContext(Context);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = {
      username: user.username,
      title,
      desc,
    };

    if (file) {
      const data = new FormData();
      const filename = Date.now() + file.name;
      data.append("name", filename);
      data.append("file", file);
      newPost.photo = filename;

      try {
        await axios.post(
          "https://react-blog-backend-xzzn.onrender.com/api/upload",
          data
        );
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }

    try {
      const res = await axios.post(
        "https://react-blog-backend-xzzn.onrender.com/api/posts",
        newPost
      );

      const postId = res.data._id;

      // Retry logic to wait until post is available
      let tries = 0;
      const checkPostAvailable = async () => {
        try {
          const checkRes = await axios.get(
            `https://react-blog-backend-xzzn.onrender.com/api/posts/${postId}`
          );
          if (checkRes.status === 200) {
            window.location.replace("/post/" + postId);
          }
        } catch (err) {
          if (tries < 5) {
            tries++;
            setTimeout(checkPostAvailable, 500); // Retry after 500ms
          } else {
            alert("Post created, but not yet available. Try again shortly.");
          }
        }
      };

      checkPostAvailable();
    } catch (err) {
      console.error("Post creation failed:", err.response?.data || err.message);
    }
  };

  return (
    <div className="write">
      {file && (
        <img
          className="writeImg"
          src={URL.createObjectURL(file)}
          alt=""
        />
      )}

      <form className="writeForm" onSubmit={handleSubmit}>
        <div className="writeFormGroup">
          <label htmlFor="fileInput">
            <i className="fa-solid fa-plus"></i>
          </label>
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <input
            type="text"
            placeholder="Title"
            className="writeInput"
            autoFocus={true}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="writeFormGroup">
          <textarea
            placeholder="Tell your story..."
            type="text"
            className="writeInput writeText"
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
        </div>

        <button className="writeSubmit" type="submit">
          Publish
        </button>
      </form>
    </div>
  );
}
