import { isAuth } from "../utils/authToken";
import {
  Container,
  Spinner,
  Row,
  Col,
  Card,
  Button,
  ProgressBar,
} from "react-bootstrap";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import moment from "moment";
import { getAllBudgets, editBudgets, deleteBudgets } from "../api/budgetsApi";
import { getAllCategory } from "../api/categoryApi";
import AddBudget from "../components/budget/AddBudget";
import EditBudget from "../components/budget/EditBudget";

const Budget = () => {
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const queryClient = useQueryClient();

  const {
    data: dataCategory,
    isLoading: isLoadingCategory,
    error: errorCategory,
    refetch: refetchCategory,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategory,
  });
  const {
    data: dataBudgets,
    isLoading: isLoadingBudgets,
    error: errorBudgets,
    refetch: refetchBudgets,
  } = useQuery({
    queryKey: ["budgets"],
    queryFn: getAllBudgets,
  });

  useEffect(() => {
    if (isAuth()) {
      refetchBudgets();
      refetchCategory();
    }
  }, [isAuth]);

  const handleEdit = (budget) => {
    setSelectedBudget(budget);
    setEditModal(true);
  };

  const validate = (budget) => {
    const currentErrors = {};

    const today = new Date().toISOString().split("T")[0];
    const { startDate, endDate } = budget;

    if (startDate && startDate < today) {
      currentErrors.startDate = "Start date cannot be before today.";
    }

    if (endDate && startDate && endDate < startDate) {
      currentErrors.endDate = "End date cannot be before start date.";
    }

    if (Object.keys(currentErrors).length > 0) {
      Swal.fire({
        title: "Validation Error",
        text: Object.values(currentErrors).join(", "),
        icon: "error",
        confirmButtonText: "OK",
      });
      return false;
    }

    return true;
  };

  const updateBudgetMutation = useMutation({
    mutationFn: ({ id, updatedBudget }) => editBudgets(id, updatedBudget),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      Swal.fire({
        title: "Success!",
        text: "Budget Updated Successfully",
        icon: "success",
      });
      setEditModal(false);
    },
    onError: (error) => {
      console.error("Error updating budget:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.msg || "An unexpected error occurred.",
        icon: "error",
      });
    },
  });

  const handleUpdateBudget = (updatedBudget) => {
    const budgetId = selectedBudget._id;
    if (!validate(updatedBudget)) return;
    updateBudgetMutation.mutate({ id: budgetId, updatedBudget });
  };

  const deleteBudgetMutation = useMutation({
    mutationFn: (id) => deleteBudgets(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      Swal.fire({
        title: "Deleted!",
        text: "Budget deleted successfully.",
        icon: "success",
      });
    },
    onError: (error) => {
      console.error("Error deleting budget:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.msg || "An unexpected error occurred.",
        icon: "error",
      });
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteBudgetMutation.mutate(id);
      }
    });
  };

  if (isLoadingBudgets || isLoadingCategory)
    return (
      <Container className="my-5 d-flex justify-content-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );

  if (!isAuth())
    return (
      <Container className="my-5">
        <h2>Can't access this page.</h2>
      </Container>
    );

  const inactiveBudgets = dataBudgets?.filter((budget) => !budget.isActive);

  console.log(inactiveBudgets);
  return (
    <>
      <Container className="my-5">
        <div className="d-flex justify-content-between">
          <h2>Budget</h2>
          <Button variant="info" onClick={() => setAddModal(true)}>
            Add Budgets
          </Button>
        </div>

        {dataBudgets && dataBudgets.length > 0 ? (
          <>
            <Row className="my-5">
              {dataBudgets.map(
                (budget) =>
                  budget.isActive && (
                    <Col key={budget._id} md={6} lg={4} className="mb-3">
                      <Card>
                        <Card.Header className="d-flex flex-md-column gap-md-2 flex-lg-row  justify-content-between align-items-center">
                          <p className="m-0">{budget.category.name}</p>
                          <div className="d-flex gap-1">
                            <Button
                              variant="outline-warning"
                              size="sm"
                              onClick={() => handleEdit(budget)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(budget._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </Card.Header>
                        <Card.Body>
                          <div className="d-flex justify-content-between">
                            <div>
                              <p className="m-0">Budgetted:</p>
                              <h5>RM {budget.amount.toFixed(2)}</h5>
                            </div>
                            <div>
                              <p className="m-0">Spent:</p>
                              <h5>RM {budget.totalExpenses.toFixed(2)}</h5>
                            </div>
                          </div>

                          <ProgressBar
                            striped
                            variant={budget.isOverspent ? "danger" : "success"}
                            now={(budget.totalExpenses / budget.amount) * 100}
                            label={`${(
                              (budget.totalExpenses / budget.amount) *
                              100
                            ).toFixed(2)}%`}
                          />
                        </Card.Body>
                        <Card.Footer>
                          {moment(budget.startDate).format("L")} -{" "}
                          {moment(budget.endDate).format("L")}
                        </Card.Footer>
                      </Card>
                    </Col>
                  )
              )}
            </Row>

            {inactiveBudgets.length > 0 && (
              <>
                <h4 className="mt-5 mb-3">Past Budgets</h4>
                <Row className="mb-5">
                  {inactiveBudgets.map((budget) => (
                    <Col key={budget._id} md={6} lg={4} className="mb-3">
                      <Card>
                        <Card.Header className="d-flex flex-md-column gap-md-2 flex-lg-row  justify-content-between align-items-center">
                          <p className="m-0">{budget.category.name}</p>
                          <div className="d-flex gap-1">
                            <Button
                              disabled
                              variant="outline-warning"
                              size="sm"
                              onClick={() => handleEdit(budget)}
                            >
                              Edit
                            </Button>
                            <Button
                              disabled
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(budget._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </Card.Header>
                        <Card.Body>
                          <div className="d-flex justify-content-between">
                            <div>
                              <p className="m-0">Budgetted:</p>
                              <h5>RM {budget.amount.toFixed(2)}</h5>
                            </div>
                            <div>
                              <p className="m-0">Spent:</p>
                              <h5>RM {budget.totalExpenses.toFixed(2)}</h5>
                            </div>
                          </div>

                          <ProgressBar
                            striped
                            variant={budget.isOverspent ? "danger" : "success"}
                            now={(budget.totalExpenses / budget.amount) * 100}
                            label={`${(
                              (budget.totalExpenses / budget.amount) *
                              100
                            ).toFixed(2)}%`}
                          />
                        </Card.Body>
                        <Card.Footer>
                          {moment(budget.startDate).format("L")} -{" "}
                          {moment(budget.endDate).format("L")}
                        </Card.Footer>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </>
            )}
          </>
        ) : (
          <h4 className="text-center my-5">No Budgets yet</h4>
        )}
      </Container>

      <AddBudget
        show={addModal}
        onHide={() => setAddModal(false)}
        categories={dataCategory}
      />
      <EditBudget
        show={editModal}
        onHide={() => setEditModal(false)}
        categories={dataCategory}
        budget={selectedBudget}
        onSave={handleUpdateBudget}
      />
    </>
  );
};

export default Budget;
