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
  poNo471: string;
  lineNum471?: number;
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
 * Validate the price and quantity for a part that will be on an Order
 */

const validatePartData = async (
  items: CreateOrderItems[]
): Promise<boolean | CreateOrderError> => {
  try {
    if (items.length <= 0) {
      return { error: "Order contains no parts" };
    }

    let validQuantity = true;
    let validPrice = true;

    for (const item of items) {
      console.log(item);
      if (!validQuantity || !validPrice) {
        return {
          error:
            "Cannot create order. One of the items on the cart contains more quantity than in stock or incorrect price",
        };
      }

      const { data } = await supabase
        .from("x_part471")
        .select()
        .like("part_no471", `%${item.partNo471}%`);

      validQuantity =
        data && data.length > 0
          ? data?.[0].qoh471 > item.quantityOrdered471
          : false;
      validPrice =
        data && data.length > 0
          ? data?.[0].current_price_cents471 / 100 === item.partPriceCents471
          : false;
    }

    return validQuantity && validPrice
      ? true
      : {
          error:
            "Cannot create order. One of the items on the cart contains more quantity than in stock or incorrect price",
        };
  } catch (error) {
    console.log((error as Error).message);
    return { error: (error as Error).message };
  }
};

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
        .from("x_order471")
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
      .from("x_client471")
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
    const lineItems: Line471[] = orderData.lineItems.map((item, index) => {
      return {
        poNo471: orderIdResponse as string,
        lineNum471: index + 1,
        partNo471: item.partNo471,
        partPriceCents471: item.partPriceCents471,
        quantityOrdered471: item.quantityOrdered471,
        priceOrdered471: item.quantityOrdered471 * item.partPriceCents471 * 100,
      };
    });

    // Insert new Purchase Order
    let result = await supabase.from("x_order471").insert({
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
      const { data, error } = await supabase.from("x_line471").insert([
        {
          po_no471: item.poNo471,
          part_no471: item.partNo471,
          part_price_cents471: item.partPriceCents471 * 100,
          price_ordered471: item.priceOrdered471,
          quantity_ordered471: item.quantityOrdered471,
          line_num471: item.lineNum471,
        },
      ]);

      if (error) {
        return { error: "Internal Server Error" };
      }
    }

    // Update Part471 to decrease QOH
    for (const item of lineItems) {
      const qResult = await supabase
        .from("x_part471")
        .select("qoh471")
        .ilike("part_no471", `%${item.partNo471}%`);

      if (qResult.error) {
        return { error: "Internal Server Error" };
      }

      if (qResult.data && qResult.data?.length > 0) {
        const updateValue = qResult.data[0].qoh471 - item.quantityOrdered471;
        const result = await supabase
          .from("x_part471")
          .update({ qoh471: updateValue })
          .ilike("part_no471", `%${item.partNo471}%`);

        if (result.error) {
          return { error: "Internal Server Error" };
        }
      } else {
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
    const { data } = await supabase.from("x_part471").select();

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
 * Retrieves a Purchase Order for the given ClientId
 */
const getOrders = async (id: number): Promise<Order471[] | undefined> => {
  try {
    const { data } = await supabase
      .from("x_order471")
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
    const { data } = await supabase.from("x_order471").select();

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
    const { data } = await supabase.from("x_line471").select().match({
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
