import axios from "axios";

export const getBaseUrl = () => {
  let url;
  switch (import.meta.env.NODE_ENV) {
    case "production":
      url = import.meta.env.VITE_API_URL;
      break;
    case "development":
      url = import.meta.env.VITE_API_URL;
      break;
    default:
      url = import.meta.env.VITE_API_URL || "http://localhost:4000";
  }

  return url;
};

export default axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
});
export const HOST = import.meta.env.VITE_API_URL || "http://localhost:4000";
