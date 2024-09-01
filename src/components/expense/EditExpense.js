import { Modal, Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";

const EditExpense = ({ show, onHide, categories, expense, onSave }) => {
  const [editedExpense, setEditedExpense] = useState({
    category: "",
    amount: "",
    description: "",
    date: "",
  });

  useEffect(() => {
    if (expense) {
      setEditedExpense({
        category: expense.category._id,
        amount: expense.amount,
        description: expense.description,
        date: formatToLocalDatetime(expense.date),
      });
    }
  }, [expense]);

  const onChangeHandler = (e) => {
    setEditedExpense({ ...editedExpense, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    onSave(editedExpense);
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
          Edit Expense
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmitHandler}>
          <Form.Group className="mb-3">
            <Form.Label>Select Category</Form.Label>
            <Form.Select
              onChange={onChangeHandler}
              name="category"
              value={editedExpense.category}
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
              value={editedExpense.amount}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description (optional)</Form.Label>
            <Form.Control
              type="text"
              name="description"
              onChange={onChangeHandler}
              value={editedExpense.description}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date and Time</Form.Label>
            <Form.Control
              type="datetime-local"
              name="date"
              onChange={onChangeHandler}
              value={editedExpense.date}
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

export default EditExpense;
