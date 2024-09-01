import { Modal, Form, Button } from "react-bootstrap";
import { createNewBudgets } from "../../api/budgetsApi";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

const AddBudget = ({ show, onHide, categories }) => {
  const [budget, setBudget] = useState({
    category: "",
    amount: "",
    startDate: "",
    endDate: "",
  });
  const [errors, setErrors] = useState({});
  const queryClient = useQueryClient();

  const onChangeHandler = (e) => {
    setBudget({ ...budget, [e.target.name]: e.target.value });
    setErrors({});
  };

  const validate = () => {
    const currentErrors = {};

    const today = new Date().toISOString().split("T")[0];
    const { startDate, endDate } = budget;

    if (startDate && startDate < today) {
      currentErrors.startDate = "Start date cannot be before today.";
    }

    if (endDate && startDate && endDate < startDate) {
      currentErrors.endDate = "End date cannot be before start date.";
    }

    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const onSubmitMutation = useMutation({
    mutationFn: createNewBudgets,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      Swal.fire({
        title: "Success!",
        text: "Budget Added Successfully",
        icon: "success",
      });
      onHide();
      setBudget({
        category: "",
        amount: "",
        startDate: "",
        endDate: "",
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
    if (!validate()) return;
    onSubmitMutation.mutate(budget);
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
          Add New Budget
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmitHandler}>
          <Form.Group className="mb-3">
            <Form.Label>Select Category</Form.Label>
            <Form.Select
              onChange={onChangeHandler}
              name="category"
              value={budget.category}
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
              value={budget.amount}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              rows={3}
              name="startDate"
              onChange={onChangeHandler}
              value={budget.startDate}
              min={new Date().toISOString().split("T")[0]}
              isInvalid={!!errors.startDate}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              rows={3}
              name="endDate"
              onChange={onChangeHandler}
              value={budget.endDate}
              min={budget.startDate}
              isInvalid={!!errors.endDate}
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

export default AddBudget;
