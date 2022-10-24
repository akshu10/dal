import supabase from "../lib/supabase-client";

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
  poNo471: string;
  lineNum471: number;
  partNo471: string;
  partPriceCents471: number;
  quantityOrdered471: number;
  priceOrdered471: number;
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

/**
 * Line Validation when creating PO
 */

const validatePartData = async (
  items: CreateOrderItems[]
): Promise<boolean | CreateOrderError> => {
  try {
    if (items.length < 0) return false;

    let validQuantity = true;
    let validPrice = true;
    for (const item of items) {
      if (!validQuantity || !validPrice) {
        return {
          error:
            "Cannot create order. One of the lineItems contains more quantity than in stock or incorrect price",
        };
      }

      const { data } = await supabase
        .from("part471")
        .select()
        .match({ part_no471: item.partNo471 });

      validQuantity = data?.[0].qoh471 >= item.quantityOrdered471;
      validPrice = data?.[0].current_price_cents471 === item.partPriceCents471;
    }

    console.log(validPrice, validQuantity);
    return validQuantity && validPrice
      ? true
      : {
          error:
            "Cannot create order. One of the lineItems contains more quantity than in stock or incorrect price",
        };
  } catch (error) {
    return { error: (error as Error).message };
  }
};

/**
 * Local helper that creates a unique PO ID
 */
const generateUniqueOrderId = async (): Promise<string | CreateOrderError> => {
  try {
    /**
     * Find Unique purchaseOrderId
     */
    let purchaseOrderId = `P000${Math.floor(Math.random() * 100) + 1}`;
    let again = false;
    do {
      console.log(purchaseOrderId);
      const { data, count } = await supabase
        .from("order471")
        .select("*", { count: "exact" })
        .match({ po_no471: purchaseOrderId });

      purchaseOrderId = `P000${Math.floor(Math.random() * 100) + 1}`;

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
    const { data, count } = await supabase
      .from("client471")
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
 * Create an order for for a client
 */
const createOrder = async (
  orderData: CreateOrderBody
): Promise<boolean | CreateOrderError> => {
  try {
    const proceed = await validatePartData(orderData.lineItems);

    if ((proceed as CreateOrderError).error) {
      return proceed as CreateOrderError;
    }

    const orderIdResponse = await generateUniqueOrderId();

    if ((orderIdResponse as CreateOrderError).error) {
      return orderIdResponse as CreateOrderError;
    }

    const response = await verifyClient(orderData.clientId);

    console.log(response);

    if ((response as CreateOrderError).error) {
      return response as CreateOrderError;
    }

    // Generate price_ordered471 for each line item
    const line: Line471[] = orderData.lineItems.map((item, index) => {
      return {
        poNo471: orderIdResponse as string,
        lineNum471: index + 1,
        partNo471: item.partNo471,
        partPriceCents471: item.partPriceCents471,
        quantityOrdered471: item.quantityOrdered471,
        priceOrdered471: item.quantityOrdered471 * item.partPriceCents471,
      };
    });

    console.log(line);

    // TODO Insert everything from `line` into DB and update `part471`
    // to reflect reduction of quantity
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const getParts = async (): Promise<Part471[] | undefined> => {
  try {
    const { data, error } = await supabase.from("part471").select();

    const result: Part471[] | undefined = data?.map((part) => {
      const n = Number(part.current_price_cents471) / 100;
      const a = parseFloat(n.toFixed(2));

      return {
        partNo471: part.part_no471,
        description471: part.description471,
        name471: part.name471,
        currentPriceCents471: a,
        quantityOnHand471: part.qoh471,
      };
    });

    return result;
  } catch (error) {
    console.log(error);
  }
};

/**
 *
 * Get Purchase Order given a clientId
 */
const getOrders = async (id: number): Promise<Order471[] | undefined> => {
  try {
    const { data, error } = await supabase
      .from("order471")
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
 *
 * Get Orders (all)
 */
const listOrders = async (): Promise<Order471[] | undefined> => {
  try {
    const { data, error } = await supabase.from("order471").select();

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
 *
 * List Lines given a orderNumber
 */
const getLines = async (
  orderNumber: string
): Promise<Line471[] | undefined> => {
  try {
    const { data, error } = await supabase.from("line471").select().match({
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
