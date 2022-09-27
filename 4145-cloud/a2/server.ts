import express, { Request, Response } from "express";
import axios from "axios";
import fileService from "./file-service";

const PORT = 80;

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const start = async () => {
  try {
    // ROB's URL
    console.log("Start Request");
    const response = await axios.post("http://52.23.207.11:8081/start", {
      banner: "B00811471",
      ip: "44.201.85.161:80", // TODO: ADD this
    });

    console.log("ROBS Response", response);
  } catch (err) {
    console.error(err);
  }
};

app.post("/storedata", async (req: Request, res: Response): Promise<void> => {
  try {
    const { data } = req.body;

    console.log("Storedata Request", data);
    const uploadResponse = await fileService.storeObject(data);

    res.status(200).json({ s3uri: uploadResponse.Location });
  } catch (error) {
    res.status(400).json("Bad Request");
  }
});

app.post("/appenddata", async (req: Request, res: Response): Promise<void> => {
  try {
    const { data } = req.body;

    console.log("Appenddata Request", data);
    const appendResponse = await fileService.appendObject(data);

    res.status(200).json({ s3uri: appendResponse.Location });
  } catch (error) {
    res.status(400).json("Bad Request");
  }
});

app.post("/deletefile", async (req: Request, res: Response): Promise<void> => {
  try {
    const { s3uri } = req.body;

    console.log("Delete Request", s3uri);
    const deleteResponse = await fileService.deleteObject(s3uri);

    if (deleteResponse) {
      res.status(200).json();
    }
  } catch (error) {
    res.status(400).json("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

setTimeout(start, 3000);
