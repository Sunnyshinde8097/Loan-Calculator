import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./loancalculator.css";

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [emi, setEmi] = useState(null);
  const [totalPayment, setTotalPayment] = useState(null);

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 12 / 100;
    const months = parseInt(tenure) * 12;

    if (!principal || !rate || !months) {
      alert("Please enter valid values!");
      return;
    }

    const emiValue =
      (principal * rate * Math.pow(1 + rate, months)) /
      (Math.pow(1 + rate, months) - 1);

    const total = emiValue * months;

    setEmi(emiValue.toFixed(2));
    setTotalPayment(total.toFixed(2));
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="calculator-card text-center">
        <h1 className="fw-bold mb-4">🏦 Loan Calculator</h1>

        <div className="row mb-3">
          <div className="col-md-4 mb-2">
            <input
              type="number"
              className="form-control"
              placeholder="Loan Amount (₹)"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
            />
          </div>
          <div className="col-md-4 mb-2">
            <input
              type="number"
              className="form-control"
              placeholder="Interest Rate (%)"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
            />
          </div>
          <div className="col-md-4 mb-2">
            <input
              type="number"
              className="form-control"
              placeholder="Tenure (Years)"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
            />
          </div>
        </div>

        <button className="btn btn-primary btn-lg" onClick={calculateLoan}>
          Calculate EMI
        </button>

        {emi && (
          <div className="result-box alert alert-info mt-4"><b>
            <p className="mb-1">
              Monthly EMI: <strong>₹{emi}</strong>
            </p>
            <p>
              Total Payment: <strong>₹{totalPayment}</strong>
            </p></b>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanCalculator;
