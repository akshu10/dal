import express, { Request, Response } from "express";
import * as dotenv from "dotenv";

console.log(dotenv.config());

const PORT = process.env.PORT;

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/status", (req: Request, res: Response) => {
  res.status(200).json({ app: "a2-server", status: "OK" });
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
