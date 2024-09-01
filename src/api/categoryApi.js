import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("authToken");

// GET ALL
export const getAllCategory = async () => {
  let res = await axios.get("http://localhost:5000/categories", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// CREATE NEW
export const createNewCategory = async (newCategory) => {
  let res = await axios.post("http://localhost:5000/categories", newCategory, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// EDIT CREATED
export const editCategory = async (id, editedCategory) => {
  let res = await axios.put(
    `http://localhost:5000/categories/${id}`,
    editedCategory,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// DELETE CREATED
export const deleteCategory = async (id) => {
  let res = await axios.delete(`http://localhost:5000/categories/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
