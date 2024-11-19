import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const url = `${process.env.PROD_URL}/api/v1/ping`;

const sendPingRequest = () => {
  axios
    .get(url)
    .then((response) => {
      console.log("Response from server:", response.data);
    })
    .catch((error) => {
      console.error("Error sending request:", error);
    });
};

export default sendPingRequest;
