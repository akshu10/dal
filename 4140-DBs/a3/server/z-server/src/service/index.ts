import axios from "axios";
import supabase from "../../../db/index";

interface Part471 {
  partNo471: string;
  description471: string;
  name471: string;
  currentPriceCents471: number;
  quantityOnHand471: number;
}

interface Order471 {
  poNo471: string;
  clientId471: string;
  status471: string;
  requestDate: Date;
}

interface Line471 {
  poNo471?: string;
  lineNum471?: number;
  partNo471: string;
  partPriceCents471: number;
  quantityOrdered471: number;
  priceOrdered471: number;
}

interface ExtendedLineItem471 extends Line471 {
  company?: string;
}

export interface CreateOrderItems {
  partNo471: string;
  partPriceCents471: number;
  quantityOrdered471: number;
}

export interface CreateOrderBody {
  lineItems: CreateOrderItems[];
  clientId: number;
}

export interface CreateOrderError {
  error: string;
}

const X_API_URL = "http://localhost:8002";
const Y_API_URL = "http://localhost:8003";

/**
 * Local helper that generates a unique Purchase Order ID
 */
const generateUniqueOrderId = async (): Promise<string | CreateOrderError> => {
  try {
    /**
     * Find Unique purchaseOrderId
     */
    let purchaseOrderId = "";
    let again = false;
    do {
      purchaseOrderId = `P000${Math.floor(Math.random() * 100) + 1}`;
      console.log(purchaseOrderId);
      const { count } = await supabase
        .from("z_order471")
        .select("*", { count: "exact" })
        .like("po_no471", `%${purchaseOrderId}%`);

      if (count === null) continue;
      again = count > 0 ? true : false;
    } while (again);

    return purchaseOrderId;
  } catch (error) {
    return { error: (error as Error).message };
  }
};

/**
 * Checks if the client with the given clientId exists
 */
const verifyClient = async (
  clientId471: number
): Promise<boolean | CreateOrderError> => {
  try {
    const { count } = await supabase
      .from("z_client471")
      .select("*", { count: "exact" })
      .match({ id471: clientId471 });

    if (count === null || count <= 0)
      return { error: "Client with the provided ID does not exist" };

    return true;
  } catch (error) {
    return { error: (error as Error).message };
  }
};

/**
 * Creates an order for a client and inserts lines and order into respective tables
 */
const createOrder = async (
  orderData: CreateOrderBody
): Promise<boolean | CreateOrderError> => {
  try {
    // Check if client exists

    const response = await verifyClient(orderData.clientId);

    console.log(response);

    if ((response as CreateOrderError).error) {
      return response as CreateOrderError;
    }

    let company: string = "";
    let x_sup: boolean = false;
    let y_sup: boolean = false;
    let x_price: number = 0;
    let y_price: number = 0;

    const xParts = await axios.get(`${X_API_URL}/parts`);
    const yParts = await axios.get(`${Y_API_URL}/parts`);

    const xPartsData = (xParts.data.data as Part471[]) || [];
    const yPartsData = (yParts.data.data as Part471[]) || [];

    const newPartsMapping: ExtendedLineItem471[] = [];

    for (const item of orderData.lineItems) {
      for (const x of xPartsData) {
        if (x.partNo471 === item.partNo471) {
          if (item.quantityOrdered471 < x.quantityOnHand471) {
            x_sup = true;
            x_price = x.currentPriceCents471;
          }
        }
      }

      for (const y of yPartsData) {
        if (y.partNo471 === item.partNo471) {
          if (item.quantityOrdered471 < y.quantityOnHand471) {
            y_sup = true;
            y_price = y.currentPriceCents471;
          }
        }
      }

      if (!x_sup && !y_sup && x_price === 0 && y_price === 0) {
        return {
          error:
            "Quantity of one of the parts requested is not sufficient to complete the order",
        };
      }

      item.partPriceCents471 =
        y_sup && x_sup && x_price && y_price
          ? Math.min(x_price, y_price)
          : x_price || y_price;

      company = item.partPriceCents471 === x_price ? "X" : "Y";

      newPartsMapping.push({
        company,
        partPriceCents471: item.partPriceCents471,
        priceOrdered471: item.partPriceCents471,
        partNo471: item.partNo471,
        quantityOrdered471: item.quantityOrdered471,
      });
    }

    let createOrderBodyY: CreateOrderBody = {
      clientId: 1, // Default for Company 'Z'
      lineItems: [],
    };

    let createOrderBodyX: CreateOrderBody = {
      clientId: 1, // Default for Company 'Z'
      lineItems: [],
    };

    for (const lineItem of newPartsMapping) {
      if (lineItem.company === "Y") {
        createOrderBodyY.lineItems.push({
          partNo471: lineItem.partNo471,
          partPriceCents471: lineItem.partPriceCents471,
          quantityOrdered471: lineItem.quantityOrdered471,
        });
      }

      if (lineItem.company === "X") {
        createOrderBodyX.lineItems.push({
          partNo471: lineItem.partNo471,
          partPriceCents471: lineItem.partPriceCents471,
          quantityOrdered471: lineItem.quantityOrdered471,
        });
      }
    }

    if (createOrderBodyX.lineItems.length > 0) {
      // create order in X
      console.log("Order Request Object X: ", createOrderBodyX);

      const response = await axios.post(
        `${X_API_URL}/orders`,
        createOrderBodyX,
        {
          headers: {
            accept: "Application/json",
            "content-type": "application/json",
          },
        }
      );

      console.log(response.data);

      if (!response.data) {
        return { error: "Something went wrong when creating order" };
      }
    }

    if (createOrderBodyY.lineItems.length > 0) {
      // create order in Y
      console.log("Order Request Object Y: ", createOrderBodyY);

      const response = await axios.post(
        `${Y_API_URL}/orders`,
        createOrderBodyY,
        {
          headers: {
            accept: "Application/json",
            "content-type": "application/json",
          },
        }
      );

      if (!response.data) {
        return { error: "Something went wrong when creating order" };
      }
    }

    const orderIdResponse = await generateUniqueOrderId();

    // Create PO on table for Z
    // Create Line Entry on table for Z along with company
    // Generate data for each line item
    const lineItems: ExtendedLineItem471[] = newPartsMapping.map(
      (item, index) => {
        return {
          poNo471: orderIdResponse as string,
          lineNum471: index + 1,
          partNo471: item.partNo471,
          partPriceCents471: item.partPriceCents471,
          quantityOrdered471: item.quantityOrdered471,
          priceOrdered471:
            item.quantityOrdered471 * item.partPriceCents471 * 100,
          company: item.company,
        };
      }
    );

    // Insert new Purchase Order
    let result = await supabase.from("z_order471").insert({
      po_no471: orderIdResponse,
      client_id471: orderData.clientId,
      status471: "Active",
      request_date471: new Date(),
    });

    if (result.error) {
      return { error: "Internal Server Error" };
    }

    // Insert Lines for each PO
    for (const item of lineItems) {
      const { count } = await supabase
        .from("z_part471")
        .select("*", { count: "exact" })
        .match({ part_no471: item.partNo471 });

      if (count === 0) {
        const result = await supabase.from("z_part471").insert([
          {
            part_no471: item.partNo471,
            qoh471: item.quantityOrdered471,
            current_price_cents471: item.partPriceCents471 * 100,
          },
        ]);

        if (result.error) {
          return { error: "While Insert parts" };
        }
      }

      const { data, error } = await supabase.from("z_line471").insert([
        {
          po_no471: item.poNo471,
          part_no471: item.partNo471,
          part_price_cents471: item.partPriceCents471 * 100,
          price_ordered471: item.priceOrdered471,
          quantity_ordered471: item.quantityOrdered471,
          line_num471: item.lineNum471,
          company: item.company,
        },
      ]);

      if (error) {
        return { error: "Internal Server Error" };
      }
    }

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

/**
 * Return all the parts from the Parts471 table.
 */
const getParts = async (): Promise<Part471[] | undefined> => {
  try {
    const xParts = await axios.get(`${X_API_URL}/parts`);

    const xPartsData = (xParts.data.data as Part471[]) || [];

    const yParts = await axios.get(`${Y_API_URL}/parts`);

    const yPartsData = (yParts.data.data as Part471[]) || [];

    const parts: Part471[] = [];

    const set = new Set<string>();

    for (const xPart of xPartsData) {
      set.add(xPart.partNo471);
      parts.push(xPart);
    }

    for (const yPart of yPartsData) {
      if (set.has(yPart.partNo471)) {
        continue;
      } else {
        set.add(yPart.partNo471);
        parts.push(yPart);
      }
    }

    return parts;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Retrieves a Purchase Order for the given ClientId
 */
const getOrders = async (id: number): Promise<Order471[] | undefined> => {
  try {
    const { data } = await supabase
      .from("z_order471")
      .select()
      .match({ client_id471: id });

    console.log(data);

    const result: Order471[] | undefined = data?.map((order) => {
      return {
        poNo471: order.po_no471,
        clientId471: order.client_id471,
        status471: order.status471,
        requestDate: order.request_date471,
      };
    });

    return result;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Get all Orders on the Orders471 table
 */
const listOrders = async (): Promise<Order471[] | undefined> => {
  try {
    const { data } = await supabase.from("z_order471").select();

    const result: Order471[] | undefined = data?.map((order) => {
      return {
        poNo471: order.po_no471,
        clientId471: order.client_id471,
        status471: order.status471,
        requestDate: order.request_date471,
      };
    });

    return result;
  } catch (error) {
    console.log(error);
  }
};

/**
 * List Lines for the given purchase Order no
 */
const getLines = async (
  orderNumber: string
): Promise<Line471[] | undefined> => {
  try {
    const { data } = await supabase.from("z_line471").select().match({
      po_no471: orderNumber?.toUpperCase(),
    });

    const result: Line471[] | undefined = data?.map((line) => {
      return {
        partNo471: line.part_no471,
        poNo471: line.po_no471,
        lineNum471: line.line_num471,
        partPriceCents471: line.part_price_cents471,
        quantityOrdered471: line.quantity_ordered471,
        priceOrdered471: line.price_ordered471,
      };
    });

    return result;
  } catch (error) {
    console.log(error);
  }
};

export { getParts, listOrders, getOrders, getLines, createOrder };
