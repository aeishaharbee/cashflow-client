import { isAuth } from "../utils/authToken";
import { Container, Spinner, Button, Card, Row, Col } from "react-bootstrap";
import { getAllCategory } from "../api/categoryApi";
import { getAllExpenses } from "../api/expensesApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import moment from "moment";
import AddExpense from "../components/expense/AddExpense";
import EditExpense from "../components/expense/EditExpense";
import { editExpenses, deleteExpenses } from "../api/expensesApi";

const Expense = () => {
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
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
    data: dataExpenses,
    isLoading: isLoadingExpenses,
    error: errorExpenses,
    refetch: refetchExpenses,
  } = useQuery({
    queryKey: ["expenses"],
    queryFn: getAllExpenses,
  });

  useEffect(() => {
    if (isAuth()) {
      refetchCategory();
      refetchExpenses();
    }
  }, [isAuth]);

  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setEditModal(true);
  };

  const updateExpenseMutation = useMutation({
    mutationFn: ({ id, updatedExpense }) => editExpenses(id, updatedExpense),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      Swal.fire({
        title: "Success!",
        text: "Expense Updated Successfully",
        icon: "success",
      });
      setEditModal(false);
    },
    onError: (error) => {
      console.error("Error updating expense:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.msg || "An unexpected error occurred.",
        icon: "error",
      });
    },
  });

  const handleUpdateExpense = (updatedExpense) => {
    const expenseId = selectedExpense._id;
    updateExpenseMutation.mutate({ id: expenseId, updatedExpense });
  };

  const deleteExpenseMutation = useMutation({
    mutationFn: (id) => deleteExpenses(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      Swal.fire({
        title: "Deleted!",
        text: "Expense deleted successfully.",
        icon: "success",
      });
    },
    onError: (error) => {
      console.error("Error deleting expense:", error);
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
        deleteExpenseMutation.mutate(id);
      }
    });
  };

  if (isLoadingCategory || isLoadingExpenses)
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

  return (
    <>
      <Container className="my-5">
        <div className="d-flex justify-content-between">
          <h2>Expenses</h2>
          <Button variant="info" onClick={() => setAddModal(true)}>
            Add Expenses
          </Button>
        </div>

        {dataExpenses && dataExpenses.length > 0 ? (
          <Row className="my-5">
            {dataExpenses.map((expense) => (
              <Col key={expense._id} md={4} className="mb-3">
                <Card>
                  <Card.Header className="d-flex flex-md-column gap-md-2 flex-lg-row  justify-content-between align-items-center">
                    <p className="m-0">{expense.category.name}</p>
                    <div className="d-flex gap-1">
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => handleEdit(expense)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(expense._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <h3>RM {expense.amount.toFixed(2)}</h3>
                    {expense.description && (
                      <p className="m-0">{expense.description}</p>
                    )}
                  </Card.Body>
                  <Card.Footer>{moment(expense.date).calendar()}</Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <h4 className="text-center my-5">No expenses yet</h4>
        )}
      </Container>

      <AddExpense
        show={addModal}
        onHide={() => setAddModal(false)}
        categories={dataCategory}
      />

      <EditExpense
        show={editModal}
        onHide={() => setEditModal(false)}
        categories={dataCategory}
        expense={selectedExpense}
        onSave={handleUpdateExpense}
      />
    </>
  );
};

export default Expense;
