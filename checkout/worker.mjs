const shopId = "1599820";
const shopPath = "/api/v1/shops/" + shopId;
const apiHost = "https://api.spreadshirt.net";
const checkoutOrigin = "https://checkout.spreadshirt.de";
const allowedOrigins = new Set(["https://sunnyeldr.com", "https://www.sunnyeldr.com"]);
const products = new Map([
  ["break-the-silence", { typeId: "2940", ideaId: "329bf6c241b17d44", appearanceId: "1256", publicSellable: "rpfnhpkjb490-2940" }],
  ["still-here", { typeId: "2963", ideaId: "329bf8e1cf91764a", appearanceId: "1257", publicSellable: "rpfobi1om9my-2963" }],
]);

async function spreadshirt(key, path, payload) {
  const headers = {
    Authorization: 'SprdAuth apiKey="' + key + '"',
    Accept: "application/json",
    "User-Agent": "SunnyELDRMerch/1.0 (https://sunnyeldr.com; contact@sunnyeldr.com)",
  };
  if (payload) headers["Content-Type"] = "application/json";
  const response = await fetch(apiHost + path + "?mediaType=json", {
    method: payload ? "POST" : "GET",
    headers,
    body: payload ? JSON.stringify(payload) : undefined,
    redirect: "error",
    signal: AbortSignal.timeout(6500),
  });
  if (!response.ok) throw new Error("Spreadshirt returned " + response.status);
  return response.json();
}

async function readProduct(key, product) {
  const [listing, type] = await Promise.all([
    spreadshirt(key, shopPath + "/sellables"),
    spreadshirt(key, shopPath + "/productTypes/" + product.typeId),
  ]);
  const match = listing.sellables.find(item =>
    (String(item.ideaId) === product.ideaId && String(item.productTypeId) === product.typeId)
    || item.sellableId === product.publicSellable
    || item.sellableId?.startsWith(product.publicSellable + "-")
  );
  if (!match?.sellableId) throw new Error("Configured product is missing from the shop");
  const available = new Set((type.stockStates || [])
    .filter(stock => String(stock.appearance?.id) === product.appearanceId && stock.available === true)
    .map(stock => String(stock.size?.id)));
  const sizes = type.sizes
    .filter(size => available.has(String(size.id)))
    .map(size => ({ id: String(size.id), name: size.name }));
  return { sellableId: match.sellableId, sizes };
}

async function openCheckout(key, product, productData, size) {
  const basket = await spreadshirt(key, "/api/v1/baskets", {
    basketItems: [{
      quantity: 1,
      element: {
        id: productData.sellableId,
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
  const details = basket.links ? basket : await spreadshirt(key, "/api/v1/baskets/" + basket.id);
  const href = details.links?.find(link => link.type === "shopCheckout")?.href;
  const checkout = href && new URL(href);
  if (!checkout || checkout.origin !== checkoutOrigin
      || checkout.searchParams.get("basketId") !== basket.id
      || checkout.searchParams.get("shopId") !== shopId) {
    throw new Error("Spreadshirt did not return a checkout link for the Sunny ELDR shop");
  }
  return checkout.href;
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
      const data = await readProduct(key, product);
      if (expectedMethod === "GET") return respond({ sizes: data.sizes });
      if (!data.sizes.some(option => option.id === size)) return respond({ error: "size_unavailable" }, 409);
      return respond({ url: await openCheckout(key, product, data, size) });
    } catch (error) {
      console.error(JSON.stringify({ event: "spreadshop_request_failed", error: error.message }));
      return respond({ error: "checkout_unavailable" }, 502);
    }
  },
};
