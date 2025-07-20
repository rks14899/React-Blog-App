// const express = require("express");
// const app = express();
// const dotenv = require("dotenv");
// const mongoose = require("mongoose");
// const authRoute = require("./routes/auth");
// const userRoute = require("./routes/users");
// const postRoute = require("./routes/posts");
// const categoryRoute = require("./routes/categories");

// dotenv.config();
// app.use(express.json());

// mongoose.connect(process.env.MONGO_URL)
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.log(err));

//   app.use("/api/auth",authRoute);
//   app.use("/api/users",userRoute);
//   app.use("/api/posts",postRoute);
//   app.use("/api/categories", categoryRoute);

// app.listen("5000", () => {
//     console.log("Backend is running")
// })


// const express = require("express");
// const app = express();
// const dotenv = require("dotenv");
// const mongoose = require("mongoose");
// const authRoute = require("./routes/auth");
// const userRoute = require("./routes/users");
// const postRoute = require("./routes/posts");
// const categoryRoute = require("./routes/categories");
// const multer = require("multer");
// const path = require("path");

// dotenv.config();
// app.use(express.json());
// app.use("/images", express.static(path.join(__dirname, "/images")));

// mongoose
//   .connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
    
//   })
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.log(err));

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, req.body.name);
//   },
// });

// const upload = multer({ storage: storage });
// app.post("/api/upload", upload.single("file"), (req, res) => {
//   res.status(200).json("File has been uploaded");
// });

// app.use("/api/auth", authRoute);
// app.use("/api/users", userRoute);
// app.use("/api/posts", postRoute);
// app.use("/api/categories", categoryRoute);

// app.listen("5000", () => {
//   console.log("Backend is running.");
// });


const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const cors = require("cors");
app.use(cors());


dotenv.config();
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// -------- Updated storage configuration --------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "images";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    if (!req.body.name) {
      return cb(new Error("Missing 'name' field in request body"), null);
    }
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json("No file uploaded");
    }

    console.log("Uploaded file name:", req.file.filename);
    res.status(200).json("File has been uploaded");
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(500).json("Error uploading file");
  }
});

// -------- Routes --------
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);

app.listen("5000", () => {
  console.log("Backend is running.");
});

