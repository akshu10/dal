import axios from "axios";

const listParts = async () => {
  const result = await axios.get("http://localhost:8080/parts", {
    headers: { accept: "Application/json" },
  });

  return result.data.data;
};

const createOrder = async (body) => {
  const result = await axios.post("http://localhost:8080/orders", body, {
    headers: { accept: "Application/json" },
  });

  return result.data;
};

const getClientOrders = async (clientId) => {
  const result = await axios.get(`http://localhost:8080/orders/${clientId}`, {
    headers: { accept: "Application/json" },
  });

  return result.data.data;
};

export { listParts, createOrder, getClientOrders };
