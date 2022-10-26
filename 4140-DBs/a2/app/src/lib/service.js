import axios from "axios";

const listParts = async () => {
  const result = await axios.get("http://localhost:8080/parts", {
    headers: { accept: "Application/json" },
  });

  return result.data.data;
};

export { listParts };
