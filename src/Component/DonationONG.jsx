import React, { useState } from "react";
import axios from "axios";

const DonationONG = () => {
  const [formData, setFormData] = useState({
    email: "",
    firstname: "",
    lastname: "",
    phone: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "https://zm.instantbillspay.com/instantpay/payload/bill/makepayment",
        {
          email: formData.email,
          firstname: formData.firstname,
          lastname: formData.lastname,
          phone: formData.phone,
          amount: formData.amount,
          merchantID: "NG0700144", // Ajoutez votre ID de marchand ici
          uniqueID: Date.now().toString(), // Générez un identifiant unique pour la transaction
          description: "Test description",
          successReturnUrl: "https://xyz.com/success-page",
          cancelReturnUrl: " https://xyz.com/cancel-page ",
          failureReturnUrl: " https://xyz.com/failure-page ",
        }
      );

      if (response.data.status === 200) {
        setSuccess("Transaction initiated successfully.");
        window.location.href = response.data.gateway_url; // Redirection vers l'URL de paiement
      } else {
        setError("Failed to initiate transaction. Please try again.");
      }
    } catch (error) {
      setError("There was an error processing your request. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Instant Bills Pay</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Make Payment"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
};

export default DonationONG;
