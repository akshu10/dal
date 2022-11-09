import axios from "axios";

const listParts = async () => {
  const result = await axios.get("http://localhost:8004/parts", {
    headers: { accept: "Application/json" },
  });

  return result.data.data;
};

const createOrder = async (body) => {
  const result = await axios.post("http://localhost:8004/orders", body, {
    headers: { accept: "Application/json" },
  });

  return result.data;
};

const getClientOrders = async (clientId) => {
  const result = await axios.get(`http://localhost:8004/orders/${clientId}`, {
    headers: { accept: "Application/json" },
  });

  return result.data.data;
};

const getOrderLines = async (poNo) => {
  const result = await axios.get(`http://localhost:8004/${poNo}/lines`, {
    headers: { accept: "Application/json" },
  });

  return result.data.data;
};

export { listParts, createOrder, getClientOrders, getOrderLines };
