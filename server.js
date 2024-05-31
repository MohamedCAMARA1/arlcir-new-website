require("dotenv").config();
const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
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
  "https://gn.instantbillspay.com/instantpay/payload/bill/payment";

// Fonction de vérification du statut de la transaction (simulation)
const checkTransactionStatus = (ref) => {
  const isSuccessful = parseInt(ref) % 2 === 0;
  return {
    status: isSuccessful ? "SUCCESSFUL" : "FAILED",
    info: isSuccessful ? "Payment Successful" : "Payment Failed",
  };
};

// Route pour initier une transaction de paiement
app.post("/api/donate", async (req, res) => {
  const { email, firstname, lastname, phone, amount } = req.body;
  const uniqueID = Date.now().toString(); // Générer un identifiant unique pour la transaction

  const stringToHash = `${email}${firstname}${lastname}${merchantID}${uniqueID}${amount}`;
  const hash = crypto
    .createHmac("sha512", secretKey)
    .update(stringToHash)
    .digest("hex");

  const payload = {
    email,
    firstname,
    lastname,
    phone,
    merchantID,
    uniqueID,
    description: "Don Pour l'ONG ARLCIR",
    amount,
    returnUrl: `https://${req.get("host")}/return`, // Utiliser l'URL de la route de retour
    hash,
  };

  try {
    const response = await axios.post(baseURL, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    res.json({
      success: true,
      message: "Transaction initiated successfully",
      reference: response.data.reference, // Envoyer la référence de transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error processing donation",
      error: error.message,
    });
  }
});

// Route pour gérer les retours de paiement
app.get("/return", (req, res) => {
  const { ref } = req.query;
  const transactionStatus = checkTransactionStatus(ref);
  res.json(transactionStatus);
});

// Route pour servir l'application React
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
