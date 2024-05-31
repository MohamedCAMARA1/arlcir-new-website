require("dotenv").config();
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

// Servir les fichiers statiques de l'application React
app.use(express.static(path.join(__dirname, "build")));

const secretKey = process.env.SECRET_KEY;
const merchantID = process.env.MERCHANT_ID;
const baseURL =
  "https://zm.instantbillspay.com/instantpay/payload/bill/makepayment";

// Vérification des variables d'environnement
const requiredEnvVars = ["SECRET_KEY", "MERCHANT_ID"];
requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Environment variable ${key} is missing!`);
    process.exit(1);
  }
});

// Route pour initier une transaction de paiement
app.post("/api/donate", async (req, res) => {
  const { email, firstname, lastname, phone, amount } = req.body;
  const uniqueID = Date.now().toString(); // Générer un identifiant unique pour la transaction

  const payload = {
    email,
    firstname,
    lastname,
    phone,
    merchantID,
    uniqueID,
    description: "Don Pour l'ONG ARLCIR",
    amount,
    successReturnUrl: `https://${req.get("host")}/success`,
    cancelReturnUrl: `https://${req.get("host")}/cancel`,
    failureReturnUrl: `https://${req.get("host")}/failure`,
  };

  try {
    const response = await axios.post(baseURL, payload, {
      headers: {
        "Content-Type": "application/json",
        "Secret-Key": secretKey,
      },
    });

    if (response.data.status === 200) {
      res.json({
        success: true,
        message: "Transaction initiated successfully",
        paymentUrl: response.data.gateway_url, // Envoyer l'URL de paiement
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to initiate transaction",
      });
    }
  } catch (error) {
    console.error("Error processing donation:", error);
    res.status(500).json({
      success: false,
      message: "Error processing donation",
      error: error.message,
    });
  }
});

// Route pour servir l'application React
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
