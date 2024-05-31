require("dotenv").config();
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Servir les fichiers statiques de l'application React
app.use(express.static(path.join(__dirname, "build")));

// Route POST pour initier un paiement
app.post("/api/make-payment", async (req, res) => {
  const paymentDetails = {
    ...req.body,
    uniqueID: uuidv4(),
    description: "Test Payment",
    returnUrl: "https://arlcir.com/success-page",
    failUrl: "https://arlcir.com/failure-page",
    cancelUrl: "https://arlcir.com/cancel-page",
  };

  try {
    const response = await axios.post(
      process.env.API_TEST_URL,
      paymentDetails,
      {
        headers: {
          "Content-Type": "application/json",
          "Secret-Key": process.env.API_SECRET_KEY,
        },
      }
    );

    if (response.status === 200) {
      res.json({ status: 200, gateway_url: response.data.gateway_url });
    } else {
      res.status(response.status).json({
        message: "Failed to initiate payment",
        details: response.data,
      });
    }
  } catch (error) {
    console.error("Error processing payment:", error);
    if (error.response) {
      return res
        .status(error.response.status)
        .json({ message: error.response.data.message });
    }
    res.status(500).json({ message: "Server error processing payment" });
  }
});

// Pour toutes les autres requêtes, retourner l'application React
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
