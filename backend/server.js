const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/token", async (req, res) => {
  try {
    const response = await fetch("https://atoms.smallest.ai/api/v1/session", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.SMALLEST_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        agent_id: process.env.AGENT_ID
      })
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Backend running on http://localhost:3000"));
