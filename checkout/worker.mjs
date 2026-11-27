const shopId = "1599820";
const shopPath = "/api/v1/shops/" + shopId;
const apiHost = "https://api.spreadshirt.net";
const checkoutOrigin = "https://checkout.spreadshirt.de";
const shopOrigin = "https://eldr-sthetic.myspreadshop.de";
const shopCheckoutPath = "/checkout/";
const allowedOrigins = new Set(["https://sunnyeldr.com", "https://www.sunnyeldr.com"]);
const products = new Map([
  ["break-the-silence", { typeId: "2940", appearanceId: "1256", sellableId: "rpfnhpkjb490-2940" }],
  ["still-here-cruiser", { typeId: "2091", appearanceId: "2", sellableId: "rpfobi1om9my-2091" }],
]);

async function spreadshirt(key, path, payload) {
  const headers = {
    Authorization: 'SprdAuth apiKey="' + key + '"',
    Accept: "application/json",
    "User-Agent": "SunnyELDRMerch/1.0 (https://sunnyeldr.com; contact@sunnyeldr.com)",
  };
  if (payload) headers["Content-Type"] = "application/json";
  const query = new URLSearchParams({ mediaType: "json", locale: "de_DE" });
  const response = await fetch(apiHost + path + "?" + query, {
    method: payload ? "POST" : "GET",
    headers,
    body: payload ? JSON.stringify(payload) : undefined,
    redirect: "manual",
    signal: AbortSignal.timeout(6500),
  });
  if (!response.ok) {
    const step = payload ? " while creating a basket" : " while reading shop data";
    throw new Error("Spreadshirt returned " + response.status + step);
  }
  return response.json();
}

async function readSizes(key, product) {
  const type = await spreadshirt(key, shopPath + "/productTypes/" + product.typeId);
  if (!Array.isArray(type.stockStates)) throw new Error("Spreadshirt did not return product stock");
  const available = new Set(type.stockStates
    .filter(stock => String(stock.appearance?.id) === product.appearanceId && stock.available === true)
    .map(stock => String(stock.size?.id)));
  return type.sizes
    .filter(size => available.has(String(size.id)))
    .map(size => ({ id: String(size.id), name: size.name }));
}

async function openCheckout(key, product, size) {
  const basket = await spreadshirt(key, "/api/v1/baskets", {
    basketItems: [{
      quantity: 1,
      element: {
        id: product.sellableId,
        type: "sprd:sellable",
        properties: [
          { key: "size", value: size },
          { key: "appearance", value: product.appearanceId },
        ],
        shop: { id: shopId },
      },
    }],
  });
  if (typeof basket.id !== "string" || !/^[a-z0-9-]{1,80}$/i.test(basket.id)) {
    throw new Error("Unexpected Spreadshirt basket identifier");
  }
  const details = basket.basketItems && basket.links
    ? basket
    : await spreadshirt(key, "/api/v1/baskets/" + basket.id);
  const item = details.basketItems?.[0];
  const properties = item?.element?.properties || [];
  if (details.basketItems?.length !== 1 || item.quantity !== 1 || item.element?.id !== product.sellableId
      || String(item.element.shop?.id) !== shopId
      || !properties.some(property => property.key === "size" && String(property.value) === size)
      || !properties.some(property => property.key === "appearance" && String(property.value) === product.appearanceId)) {
    throw new Error("Spreadshirt did not place the selected product and size in the basket");
  }
  const href = details.links?.find(link => link.type === "shopCheckout")?.href;
  const checkout = href && new URL(href);
  if (!checkout || checkout.origin !== checkoutOrigin
      || checkout.searchParams.get("basketId") !== basket.id
      || checkout.searchParams.get("shopId") !== shopId) {
    throw new Error("Spreadshirt did not return a checkout link for the Sunny ELDR shop");
  }
  // The shop's checkout applies the same prices as the published storefront.
  const shopCheckout = new URL(shopCheckoutPath, shopOrigin);
  shopCheckout.search = new URLSearchParams({ basketId: basket.id, shopId });
  return shopCheckout.href;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");
    const headers = { "Cache-Control": "no-store", Vary: "Origin" };
    const respond = (body, status = 200) => Response.json(body, { status, headers });
    if (url.pathname === "/health" && request.method === "GET") {
      return respond({ configured: Boolean(env.SPREADSHIRT_API_KEY) });
    }
    if (!allowedOrigins.has(origin)) return respond({ error: "origin_not_allowed" }, 403);
    headers["Access-Control-Allow-Origin"] = origin;
    if (url.pathname !== "/sizes" && url.pathname !== "/checkout") {
      return respond({ error: "not_found" }, 404);
    }
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: { ...headers, "Access-Control-Allow-Methods": "GET, POST, OPTIONS" },
      });
    }
    const expectedMethod = url.pathname === "/sizes" ? "GET" : "POST";
    if (request.method !== expectedMethod) return respond({ error: "method_not_allowed" }, 405);
    const product = products.get(url.searchParams.get("product"));
    if (!product) return respond({ error: "unknown_product" }, 400);
    const size = url.searchParams.get("size");
    if (expectedMethod === "POST" && !/^\d{1,8}$/.test(size || "")) {
      return respond({ error: "invalid_size" }, 400);
    }
    const key = env.SPREADSHIRT_API_KEY?.trim();
    if (!key) return respond({ error: "checkout_unavailable" }, 503);
    try {
      const sizes = await readSizes(key, product);
      if (expectedMethod === "GET") return respond({ sizes });
      if (!sizes.some(option => option.id === size)) return respond({ error: "size_unavailable" }, 409);
      return respond({ url: await openCheckout(key, product, size) });
    } catch (error) {
      console.error(JSON.stringify({ event: "spreadshop_request_failed", error: error.message }));
      return respond({ error: "checkout_unavailable" }, 502);
    }
  },
};
