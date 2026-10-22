

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ""
  }
});

const Item = mongoose.model("Item", itemSchema);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "Serveur fonctionne correctement"
  });
});

app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

app.post("/api/items", async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Le nom est obligatoire"
      });
    }

    const item = await Item.create({
      name: name.trim(),
      description: description || ""
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({
      message: "Impossible de créer l'élément"
    });
  }
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connecté");

    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
    });
  } catch (error) {
    console.error("Erreur de connexion MongoDB:", error.message);
    process.exit(1);
  }
}

startServer();
