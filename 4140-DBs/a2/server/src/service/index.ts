import supabase from "../lib/supabase-client";

interface Part471 {
  partNo471: string;
  description471: string;
  name471: string;
  currentPriceCents471: number;
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
  qunatityOrdered471: number;
  priceOrdered471: string;
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

const checkPartQuantity = async (
  items: CreateOrderItems[]
): Promise<boolean | CreateOrderError> => {
  try {
    if (items.length < 0) return false;

    let valid = true;
    for (const item of items) {
      if (!valid)
        return {
          error:
            "Cannot create order. One of the lineItems contains more quantity than in stock",
        };

      const { data, error } = await supabase
        .from("part471")
        .select()
        .match({ part_no471: item.partNo471 });

      valid = data?.[0].qoh471 > item.quantityOrdered471;
    }

    return valid;
  } catch (error) {
    return { error: (error as Error).message };
  }
};

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

const createOrder = async (
  orderData: CreateOrderBody
): Promise<boolean | CreateOrderError> => {
  try {
    const proceed = await checkPartQuantity(orderData.lineItems);

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
      };
    });

    return result;
  } catch (error) {
    console.log(error);
  }
};

const listOrders = async (id: number): Promise<Order471[] | undefined> => {
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

const getOrders = async (): Promise<Order471[] | undefined> => {
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
        qunatityOrdered471: line.quantity_ordered471,
        priceOrdered471: line.price_ordered471,
      };
    });

    return result;
  } catch (error) {
    console.log(error);
  }
};

export { getParts, listOrders, getOrders, getLines, createOrder };
