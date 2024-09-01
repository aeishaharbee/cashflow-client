import moment from "moment";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { isAuth } from "../utils/authToken";
import { Container, Spinner, Button, Table } from "react-bootstrap";
import { Doughnut } from "react-chartjs-2";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getTotalsSpending } from "../api/totalsApi";
import { getLatestReport, createNewReport } from "../api/reportsApi";
import { Chart, ArcElement, Tooltip, Legend, Title } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend, Title);

const Dashboard = () => {
  const [reportGenerated, setReportGenerated] = useState(false);

  const {
    data: spendingData,
    isLoading: isSpendingLoading,
    error: spendingError,
  } = useQuery({
    queryKey: ["totals"],
    queryFn: getTotalsSpending,
  });

  const {
    data: reportData,
    isLoading: isReportLoading,
    error: reportError,
  } = useQuery({
    queryKey: ["latestReport"],
    queryFn: getLatestReport,
    enabled: reportGenerated,
  });

  const mutation = useMutation({
    mutationFn: createNewReport,
    onSuccess: () => {
      setReportGenerated(true);
      Swal.fire({
        title: "Created!",
        text: "Report created successfully.",
        icon: "success",
      });
    },
    onError: (error) => {
      console.error("Error creating report:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.msg || "An unexpected error occurred.",
        icon: "error",
      });
    },
  });

  const handleGenerateReport = () => {
    mutation.mutate({
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    });
  };

  if (!isAuth())
    return (
      <Container className="my-5">
        <h2>Can't access this page.</h2>
      </Container>
    );

  if (isSpendingLoading)
    return (
      <Container className="my-5 d-flex justify-content-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );

  if (spendingError || !spendingData) {
    return (
      <Container className="my-5">
        <h2>Error loading data</h2>
        <p>{spendingError ? spendingError.message : "No data available"}</p>
      </Container>
    );
  }

  const totalSpending = spendingData.totalSpending;
  const chartData = {
    labels: spendingData.spendingByCategory.map(
      (category) => category.category
    ),
    datasets: [
      {
        data: spendingData.spendingByCategory.map(
          (category) => category.totalAmount
        ),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        hoverOffset: 4,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      title: {
        display: true,
        text: `Spending by Category for the Current Month`,
        font: {
          size: 20,
        },
      },
    },
  };

  return (
    <>
      <Container className="my-5">
        <h2>Dashboard</h2>
        <h4>Total Spendings: ${totalSpending.toFixed(2)}</h4>

        {totalSpending ? (
          <div style={{ width: "50%", margin: "0 auto" }}>
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        ) : (
          ""
        )}

        <h2 className="mt-5 mb-2">User Report</h2>
        {isReportLoading ? (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading report...</span>
          </Spinner>
        ) : reportError ? (
          <p>Error loading report: {reportError.message}</p>
        ) : reportData ? (
          <div>
            <h4>
              {moment(reportData.startDate).format("L")} -{" "}
              {moment(reportData.endDate).format("L")}
            </h4>
            <p>
              Generated At:{" "}
              <strong>{moment(reportData.generatedAt).calendar()}</strong>
            </p>
            <Table striped bordered>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Budget</th>
                  <th>Expenses</th>
                </tr>
              </thead>
              <tbody>
                {reportData.categories.map((cat, index) => (
                  <tr key={index}>
                    <td>{cat.category.name} </td>
                    <td>
                      ${cat.budget ? cat.budget.amount.toFixed(2) : "N/A"}
                    </td>
                    <td>${cat.categoryExpenses.toFixed(2)}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={2} className="text-end">
                    Total Expenses:
                  </td>
                  <td className="fw-bold">
                    ${reportData.totalExpenses.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        ) : (
          <p>No report available</p>
        )}

        <Button onClick={handleGenerateReport} disabled={mutation.isLoading}>
          Generate New Report
        </Button>
      </Container>
    </>
  );
};

export default Dashboard;
