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
});

/**
 * List all parts for sale
 */
app.get("/parts", async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("HEre");
    const data = await Service.getParts();

    console.log(data);

    res.status(200).json({ data });
  } catch (error) {
    const error2 = error as Error;
    console.log(error);
    console.log(error2.message);
  }
});

app.get("/order/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const data = await Service.listOrders(Number(id));

    if (data) {
      res.status(200).json({ data });
    } else {
      res.status(400).json({ error: "No order found" });
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/orders", async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await Service.getOrders();

    if (data) {
      res.status(200).json({ data });
    } else {
      res.status(400).json({ error: "Something went wrong." });
    }
  } catch (error) {
    console.log(error);
  }
});

app.get(
  "/lines/:orderNumber",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await Service.getLines(req.params.orderNumber);

      if (data) {
        res.status(200).json({ data });
      } else {
        res.status(400).json({ error: "Something went wrong." });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

app.post("/order", async (req: Request, res: Response) => {
  try {
    const data = await Service.createOrder(
      req.body as unknown as Service.CreateOrderBody
    );

    const response = data as Service.CreateOrderError;

    if (response.error) {
      res.status(400).json({ error: response.error });

      return;
    }

    if (data) {
      res.status(200).json({ data });
    } else {
      res.status(400).json({ error: "Something went wrong." });
    }
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`Listening on PORT:${PORT}`);
});
