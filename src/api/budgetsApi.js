import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("authToken");

// GET BY USER
export const getAllBudgets = async () => {
  let res = await axios.get("http://localhost:5000/budgets", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// GET BY ID
export const getBudgets = async (id) => {
  let res = await axios.get(`http://localhost:5000/budgets/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// CREATE NEW
export const createNewBudgets = async (newBudget) => {
  let res = await axios.post(`http://localhost:5000/budgets`, newBudget, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// EDIT
export const editBudgets = async (id, editedBudget) => {
  let res = await axios.put(
    `http://localhost:5000/budgets/${id}`,
    editedBudget,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// DELETE
export const deleteBudgets = async (id) => {
  let res = await axios.delete(`http://localhost:5000/budgets/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
