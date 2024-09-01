import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("authToken");

// GET TOTAL SPENDING OF A USER
export const getTotalsSpending = async () => {
  let res = await axios.get("http://localhost:5000/totals/spending", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
