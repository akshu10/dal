import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import supabase from "./lib/supabase-client";

// Loads .env
console.log(dotenv.config());

const PORT = process.env.PORT;

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/status", (req: Request, res: Response) => {
  res.status(200).json({ app: "a2-server", status: "OK" });
});

app.get("/parts", async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from("part471").select();
    console.log(data);
    res.status(200).json({ test: "test" });
  } catch (error) {
    const error2 = error as Error;
    console.log(error);
    console.log(error2.message);
  }
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
