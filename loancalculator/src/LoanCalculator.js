import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./loancalculator.css";

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [emi, setEmi] = useState(null);
  const [totalPayment, setTotalPayment] = useState(null);
  const [monthlyBreakdown, setMonthlyBreakdown] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 12; // show 12 months per page

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

    let balance = principal;
    let breakdown = [];

    for (let i = 1; i <= months; i++) {
      const interest = balance * rate;
      const principalPaid = emiValue - interest;
      balance -= principalPaid;

      breakdown.push({
        month: i,
        principal: principalPaid.toFixed(2),
        interest: interest.toFixed(2),
        balance: balance > 0 ? balance.toFixed(2) : "0.00",
      });
    }

    setMonthlyBreakdown(breakdown);
    setCurrentPage(1); // reset to first page
  };

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = monthlyBreakdown.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(monthlyBreakdown.length / rowsPerPage);

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="calculator-card text-center">
        <h1 className="fw-bold mb-4">🏦 Loan Calculator</h1>

        {/* Inputs */}
        <div className="row mb-3">
          <div className="col-md-4 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Loan Amount (₹)"
              value={loanAmount}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) setLoanAmount(value);
              }}
            />
          </div>
          <div className="col-md-4 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Interest Rate (%)"
              value={interestRate}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d*$/.test(value)) setInterestRate(value);
              }}
            />
          </div>
          <div className="col-md-4 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Tenure (Years)"
              value={tenure}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) setTenure(value);
              }}
            />
          </div>
        </div>

        <button className="btn btn-primary btn-lg" onClick={calculateLoan}>
          Calculate EMI
        </button>

        {/* Results */}
        {emi && (
          <div className="result-box alert alert-info mt-4">
            <p className="mb-1">Monthly EMI: <strong>₹{emi}</strong></p>
            <p>Total Payment: <strong>₹{totalPayment}</strong></p>
          </div>
        )}

        {/* Breakdown with Pagination */}
        {monthlyBreakdown.length > 0 && (
          <div className="mt-4">
            <h4>📊 Monthly Breakdown</h4>
            <table className="table table-bordered mt-2">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Principal Paid (₹)</th>
                  <th>Interest Paid (₹)</th>
                  <th>Remaining Balance (₹)</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((row) => (
                  <tr key={row.month}>
                    <td>{row.month}</td>
                    <td>{row.principal}</td>
                    <td>{row.interest}</td>
                    <td>{row.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <nav>
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                    Previous
                  </button>
                </li>
                {[...Array(totalPages)].map((_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                    <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanCalculator;
