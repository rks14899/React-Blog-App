import "./settings.css";
import Sidebar from "../../components/sidebar/Sidebar";
import { Context } from "../../context/Context";
import { useContext, useState } from "react";
import axios from "axios";

export default function Settings() {
  const { user, dispatch } = useContext(Context);
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const PF = "https://react-blog-backend-xzzn.onrender.com/images/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "UPDATE_START" });

    const updatedUser = {
      userId: user._id,
      username: username || user.username,
      email: email || user.email,
      password: password || user.password,
    };

    if (file) {
      const data = new FormData();
      const filename = Date.now() + file.name;
      data.append("name", filename);
      data.append("file", file);
      updatedUser.profilePic = filename;

      try {
        await axios.post("https://react-blog-backend-xzzn.onrender.com/api/upload", data);
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }

    try {
      const res = await axios.put(
        `https://react-blog-backend-xzzn.onrender.com/api/users/${user._id}`,
        updatedUser
      );
      dispatch({ type: "UPDATE_SUCCESS", payload: res.data });
      setSuccess(true);
    } catch (err) {
      dispatch({ type: "UPDATE_FAILURE" });
    }
  };

  return (
    <div className="settings">
      <div className="settingsWrapper">
        <div className="settingsTitle">
          <span className="settingsUpdateTitle">Update Your Account</span>
          <span className="settingsDeleteTitle">Delete Your Account</span>
        </div>
        <form className="settingsForm" onSubmit={handleSubmit}>
          <label>Profile Pic</label>
          <div className="settingsPP">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : user.profilePic?.startsWith("http")
                  ? user.profilePic
                  : PF + user.profilePic
              }
              alt="Profile"
              className="settingsPPImg"
            />
            <label htmlFor="fileInput">
              <i className="settingsPPIcon fa-regular fa-circle-user"></i>
            </label>
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="settingsSubmit" type="submit">
            Update
          </button>

          {success && (
            <span
              style={{
                color: "green",
                marginTop: "20px",
                display: "block",
                textAlign: "center",
              }}
            >
              Profile has been updated
            </span>
          )}
        </form>
      </div>
      <Sidebar />
    </div>
  );
}
