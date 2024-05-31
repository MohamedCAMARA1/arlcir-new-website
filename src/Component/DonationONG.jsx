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

    const { email, firstname, lastname, phone, amount } = formData;

    try {
      const response = await axios.post(
        "/api/donate", // URL du backend
        {
          email,
          firstname,
          lastname,
          phone,
          amount,
        }
      );
      setSuccess(
        "Transaction initiated successfully. Redirecting to payment page..."
      );
      console.log("Response:", response.data);

      if (response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl; // Rediriger vers l'URL de paiement
      }
    } catch (error) {
      setError(
        "There was an error processing your donation. Please try again."
      );
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Don pour l'ONG ARLCIR</h1>
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
          {loading ? "Processing..." : "Donate"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
};

export default DonationONG;
