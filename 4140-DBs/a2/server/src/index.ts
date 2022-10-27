import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import * as Service from "./service";

// Loads .env
dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/status", (req: Request, res: Response) => {
  res.status(200).json({ app: "a2-server", status: "OK" });
  return;
});

/**
 * List all parts for sale
 */
app.get("/parts", async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await Service.getParts();

    res.status(200).json({ data });
    return;
  } catch (error) {
    const error2 = error as Error;
    console.log(error2.message);
  }
});

app.get("/orders/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const data = await Service.getOrders(Number(id));

    if (data) {
      res.status(200).json({ data });
      return;
    } else {
      res.status(400).json({ error: "No order found" });
      return;
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/orders", async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await Service.listOrders();

    if (data) {
      res.status(200).json({ data });
      return;
    } else {
      res.status(400).json({ error: "Something went wrong." });
      return;
    }
  } catch (error) {
    console.log(error);
  }
});

app.get(
  "/:orderNumber/lines",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await Service.getLines(req.params.orderNumber);

      if (data) {
        res.status(200).json({ data });
        return;
      } else {
        res.status(400).json({ error: "Something went wrong." });
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }
);

app.post("/orders", async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("REQ BODY", req.body);
    const data = await Service.createOrder(
      req.body as unknown as Service.CreateOrderBody
    );

    const response = data as Service.CreateOrderError;

    if (response.error) {
      res.status(200).json({ error: response.error });
      return;
    }

    if (data) {
      res.status(201).json({ data });
      return;
    } else {
      res.status(200).json({ error: "Something went wrong." });
      return;
    }
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`Listening on PORT:${PORT}`);
});
