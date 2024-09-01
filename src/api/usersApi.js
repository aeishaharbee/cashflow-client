import axios from "axios";
import Cookies from "js-cookie";

// REGISTER
export const registerUser = async (user) => {
  let res = await axios.post("http://localhost:5000/users/register", user);
  return res.data;
};

// LOGIN
export const loginUser = async (user) => {
  let res = await axios.post("http://localhost:5000/users/login", user);
  return res.data;
};

// GET OWN USER INFO
export const getUserInfo = async () => {
  const token = Cookies.get("authToken");
  let res = await axios.get("http://localhost:5000/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
