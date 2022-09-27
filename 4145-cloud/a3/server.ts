import express, { Request, Response } from "express";
import axios from "axios";
import { readFileSync } from "fs";
import { privateDecrypt, publicEncrypt } from "crypto";

const PORT = 80;

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const start = async () => {
  try {
    console.log("Start Request");
    const response = await axios.post("http://3.85.202.201:8080/start", {
      banner: "B00811471",
      ip: "54.210.247.30:80", // TODO: ADD this
    });

    console.log("ROBS Response", response);
  } catch (err) {
    console.error(err);
  }
};

app.post("/decrypt", async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body;

    const binary = Buffer.from(message, "base64");
    const pk = readFileSync("./private_key.txt", { encoding: "utf-8" });

    const result = privateDecrypt(pk, binary);

    res.status(200).json({ response: result.toString("utf-8") });
  } catch (error) {
    res.status(400).json("Bad Request");
  }
});

app.post("/encrypt", async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body;

    const pk = readFileSync("./public_key.txt", { encoding: "utf-8" });
    const buffer = Buffer.from(message, "utf-8");
    const result = publicEncrypt(pk, buffer);

    res.status(200).json({ response: result.toString('base64') });
  } catch (error) {
    res.status(400).json("Bad Request");
  }
});

app.post("/deletefile", async (req: Request, res: Response): Promise<void> => {
  try {
  } catch (error) {
    res.status(400).json("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

setTimeout(start, 3000);
