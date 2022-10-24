import axios from "../axios/index";

export default {
  getParts: async () => {
    try {
      const result = await axios.get("/parts");

      return result.data.data;
    } catch (error) {
      console.log(error);
    }
  },
};
