import express, { Request, Response } from "express";

const PORT = 8080;

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
