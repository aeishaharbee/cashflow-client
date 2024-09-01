import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("authToken");

// GET BY USER
export const getAllExpenses = async () => {
  let res = await axios.get("http://localhost:5000/expenses", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// GET BY ID
export const getExpenses = async (id) => {
  let res = await axios.get(`http://localhost:5000/expenses/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// CREATE NEW
export const createNewExpenses = async (newExpense) => {
  let res = await axios.post(`http://localhost:5000/expenses`, newExpense, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// EDIT
export const editExpenses = async (id, editedExpense) => {
  let res = await axios.put(
    `http://localhost:5000/expenses/${id}`,
    editedExpense,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// DELETE
export const deleteExpenses = async (id) => {
  let res = await axios.delete(`http://localhost:5000/expenses/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
