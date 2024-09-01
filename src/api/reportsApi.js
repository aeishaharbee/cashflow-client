import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("authToken");

// CREATE NEW
export const createNewReport = async (newReport) => {
  let res = await axios.post(`http://localhost:5000/reports`, newReport, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// GET REPORTS BY USER
export const getLatestReport = async () => {
  let res = await axios.get(`http://localhost:5000/reports`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
