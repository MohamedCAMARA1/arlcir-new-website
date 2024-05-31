const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(bodyParser.json());

const secretKey = process.env.SECRET_KEY;
const merchantID = process.env.MERCHANT_ID;
const baseURL =
  "https://zm.instantbillspay.com/instantpay/payload/bill/makepayment";

// Route pour initier une transaction de paiement
app.post("/api/donate", async (req, res) => {
  const { email, firstname, lastname, phone, amount } = req.body;
  const uniqueID = Date.now().toString(); // Générer un identifiant unique pour la transaction

  // Créer le payload avec les détails de la transaction
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
    // Envoyer la demande à l'API
    const response = await axios.post(baseURL, payload, {
      headers: {
        "Content-Type": "application/json",
        "Secret-Key": secretKey, // Utilisation de la clé secrète dans l'en-tête
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
