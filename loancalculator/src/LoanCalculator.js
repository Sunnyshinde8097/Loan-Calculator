import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./loancalculator.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [insurance, setInsurance] = useState("");
  const [emi, setEmi] = useState(null);
  const [totalPayment, setTotalPayment] = useState(null);
  const [monthlyBreakdown, setMonthlyBreakdown] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 12;

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 12 / 100;
    const months = parseInt(tenure) * 12;
    const insuranceValue = parseFloat(insurance) || 0;

    if (!principal || !rate || !months) {
      alert("Please enter valid values!");
      return;
    }

    const emiValue =
      (principal * rate * Math.pow(1 + rate, months)) /
      (Math.pow(1 + rate, months) - 1);

    const insurancePerMonth = insuranceValue / months;
    const emiWithInsurance = emiValue + insurancePerMonth;

    const total = emiWithInsurance * months;

    setEmi(emiWithInsurance.toFixed(2));
    setTotalPayment(total.toFixed(2));

    let balance = principal;
    let breakdown = [];

    for (let i = 1; i <= months; i++) {
      const interest = balance * rate;
      const principalPaid = emiValue - interest;
      balance -= principalPaid;

      breakdown.push({
        Month: i,
        "Principal Paid (₹)": principalPaid.toFixed(2),
        "Interest Paid (₹)": interest.toFixed(2),
        "Insurance (₹)": insurancePerMonth.toFixed(2),
        "Remaining Balance (₹)": balance > 0 ? balance.toFixed(2) : "0.00",
      });
    }

    setMonthlyBreakdown(breakdown);
    setCurrentPage(1);
  };

  // Excel export function
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(monthlyBreakdown);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Loan Breakdown");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "LoanBreakdown.xlsx");
  };

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
          {/* Loan Amount */}
          <div className="col-md-3 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Loan Amount (₹)"
              value={loanAmount}
              onChange={(e) => /^\d*$/.test(e.target.value) && setLoanAmount(e.target.value)}
            />
          </div>
          {/* Interest Rate */}
          <div className="col-md-3 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Interest Rate (%)"
              value={interestRate}
              onChange={(e) => /^\d*\.?\d*$/.test(e.target.value) && setInterestRate(e.target.value)}
            />
          </div>
          {/* Tenure */}
          <div className="col-md-3 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Tenure (Years)"
              value={tenure}
              onChange={(e) => /^\d*$/.test(e.target.value) && setTenure(e.target.value)}
            />
          </div>
          {/* Insurance */}
          <div className="col-md-3 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Insurance Premium (₹)"
              value={insurance}
              onChange={(e) => /^\d*\.?\d*$/.test(e.target.value) && setInsurance(e.target.value)}
            />
          </div>
        </div>

        <button className="btn btn-primary btn-lg" onClick={calculateLoan}>
          Calculate EMI
        </button>

        {/* Results */}
        {emi && (
          <div className="result-box alert alert-info mt-4">
            <p className="mb-1">Monthly EMI (incl. Insurance): <strong>₹{emi}</strong></p>
            <p>Total Payment: <strong>₹{totalPayment}</strong></p>
          </div>
        )}

        {/* Breakdown */}
        {monthlyBreakdown.length > 0 && (
          <div className="mt-4">
            <h4>📊 Monthly Breakdown</h4>
            <table className="table table-bordered mt-2">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Principal Paid (₹)</th>
                  <th>Interest Paid (₹)</th>
                  <th>Insurance (₹)</th>
                  <th>Remaining Balance (₹)</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((row) => (
                  <tr key={row.Month}>
                    <td>{row.Month}</td>
                    <td>{row["Principal Paid (₹)"]}</td>
                    <td>{row["Interest Paid (₹)"]}</td>
                    <td>{row["Insurance (₹)"]}</td>
                    <td>{row["Remaining Balance (₹)"]}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Export Button */}
            <button className="btn btn-success mb-3" onClick={exportToExcel}>
              📥 Download Excel
            </button>

            {/* Pagination */}
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
