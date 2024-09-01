import { Modal, Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";

const EditBudget = ({ show, onHide, categories, budget, onSave }) => {
  const [editedBudget, setEditedBudget] = useState({
    category: "",
    amount: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (budget) {
      setEditedBudget({
        category: budget.category._id,
        amount: budget.amount,
        startDate: formatToLocalDatetime(budget.startDate),
        endDate: formatToLocalDatetime(budget.endDate),
      });
    }
  }, [budget]);

  const onChangeHandler = (e) => {
    setEditedBudget({ ...editedBudget, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    onSave(editedBudget);
  };

  const formatToLocalDatetime = (dateString) => {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
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
          Edit Budget
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmitHandler}>
          <Form.Group className="mb-3">
            <Form.Label>Select Category</Form.Label>
            <Form.Select
              onChange={onChangeHandler}
              name="category"
              value={editedBudget.category}
            >
              <option disabled value="">
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
              name="amount"
              onChange={onChangeHandler}
              value={editedBudget.amount}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="datetime-local"
              name="startDate"
              onChange={onChangeHandler}
              min={new Date().toISOString().split("T")[0]}
              value={editedBudget.startDate}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Edit Date</Form.Label>
            <Form.Control
              type="datetime-local"
              name="endDate"
              onChange={onChangeHandler}
              min={editedBudget.startDate}
              value={editedBudget.endDate}
            />
          </Form.Group>

          <Button type="submit" variant="outline-success" className="float-end">
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditBudget;
