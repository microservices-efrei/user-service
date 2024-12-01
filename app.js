const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./src/routes/userRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
