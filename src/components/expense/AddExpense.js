import { Modal, Form, Button } from "react-bootstrap";
import { createNewExpenses } from "../../api/expensesApi";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

const AddExpense = ({ show, onHide, categories }) => {
  const [expense, setExpense] = useState({
    category: "",
    amount: "",
    description: "",
    date: "",
  });
  const queryClient = useQueryClient();

  const onChangeHandler = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  };

  const onSubmitMutation = useMutation({
    mutationFn: createNewExpenses,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      Swal.fire({
        title: "Success!",
        text: "Expense Added Successfully",
        icon: "success",
      });
      onHide();
      setExpense({
        category: "",
        amount: "",
        description: "",
        date: "",
      });
    },
    onError: (error) => {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.msg || "An unexpected error occurred.",
        icon: "error",
      });
    },
  });

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    onSubmitMutation.mutate(expense);
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Add New Expense
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmitHandler}>
          <Form.Group className="mb-3">
            <Form.Label>Select Category</Form.Label>
            <Form.Select
              onChange={onChangeHandler}
              name="category"
              value={expense.category}
            >
              <option disabled hidden value="">
                Categories
              </option>

              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              rows={3}
              name="amount"
              onChange={onChangeHandler}
              value={expense.amount}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description (optional)</Form.Label>
            <Form.Control
              type="text"
              rows={3}
              name="description"
              onChange={onChangeHandler}
              value={expense.description}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="datetime-local"
              rows={3}
              name="date"
              onChange={onChangeHandler}
              value={expense.date}
            />
          </Form.Group>

          <Button
            type="submit"
            variant="outline-success"
            className=" float-end"
          >
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddExpense;
