import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const ReturnPage = () => {
  const [transactionStatus, setTransactionStatus] = useState({});
  const location = useLocation();
  const ref = new URLSearchParams(location.search).get("ref");

  useEffect(() => {
    const fetchTransactionStatus = async () => {
      try {
        const response = await axios.get(`/return?ref=${ref}`); // URL du backend pour vérifier le statut de la transaction
        setTransactionStatus(response.data);
      } catch (error) {
        console.error("Error fetching transaction status:", error);
      }
    };
    fetchTransactionStatus();
  }, [ref]);

  return (
    <div>
      <h1>Transaction Status</h1>
      {ref ? (
        <p>Transaction Reference: {ref}</p>
      ) : (
        <p>No transaction reference found.</p>
      )}
      {transactionStatus.status && <p>Status: {transactionStatus.status}</p>}
      {transactionStatus.info && <p>Info: {transactionStatus.info}</p>}
    </div>
  );
};

export default ReturnPage;
