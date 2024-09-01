import Cookies from "js-cookie";

export const saveToken = (newToken) => {
  Cookies.set("authToken", newToken, { expires: 1 });
};

export const clearToken = () => {
  Cookies.remove("authToken");
};

export const isAuth = () => {
  if (Cookies.get("authToken")) return true;
  else return false;
};
