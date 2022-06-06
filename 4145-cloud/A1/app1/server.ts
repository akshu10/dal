import express, { Request, Response } from "express";
import axios, { AxiosError } from "axios";

const PORT = 5000;

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/checksum", async (req: Request, res: Response): Promise<void> => {
  const { file } = req.body;

  if (file === null || file === undefined) {
    res.json({ file: null, error: "Invalid JSON input." });
  } else {
    try {
      
      const result = await axios.post(`http://app2:8081/`, { file });
      res.status(200).json(result.data);
    } catch (error) {
      const errorResponse = error as AxiosError<any>;
      console.log("Error:", errorResponse.message);
    }
  }
});

app.listen(PORT);
