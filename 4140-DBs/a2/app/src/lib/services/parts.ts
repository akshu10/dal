import axios from "../axios";

const getParts = async (id: string): Promise<object | null> => {
  try {
    const result = await axios.get(`/parts`);

    console.log("Result", result);

    return result.data.data;
  } catch (error) {
    console.error(error.message);

    return null;
  }
};

export { getParts };
