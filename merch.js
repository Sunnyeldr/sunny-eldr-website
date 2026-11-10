"use strict";

(() => {
  const checkoutBase = "https://shop.sunnyeldr.com/buy/";
  const checkoutVersion = "?ucp/version=2026-08-25";
  const priceRenderers = [];
  const saleBanner = document.querySelector("[data-sale-banner]");
  const updateSaleBanner = () => {
    if (!saleBanner) return;
    saleBanner.hidden = !document.querySelector(".merch-price.is-on-sale");
    const german = document.documentElement.lang === "de";
    saleBanner.querySelector("[data-sale-headline]").textContent = german ? "Die Angebote sind live" : "Sale prices are live";
    saleBanner.querySelector("[data-sale-cta]").textContent = german ? "Zu den Angeboten ↓" : "Shop the offers ↓";
  };

  document.querySelectorAll(".merch-product").forEach((product) => {
    const mainImage = product.querySelector("[data-gallery-main]");
    const stage = product.querySelector(".merch-gallery-stage");
    const caption = product.querySelector("[data-gallery-caption]");
    const position = product.querySelector("[data-gallery-position]");
    const thumbnails = [...product.querySelectorAll(".merch-thumbnail")];
    const previousButton = product.querySelector("[data-gallery-prev]");
    const nextButton = product.querySelector("[data-gallery-next]");
    const sizeOptions = [...product.querySelectorAll(".merch-size-option")];
    const buyButton = product.querySelector("[data-buy-button]");
    const productLink = product.querySelector("[data-product-link]");
    const priceBlock = product.querySelector(".merch-price");
    const renderPrice = () => {
      if (!priceBlock) return;
      const price = Number(product.dataset.price);
      const originalPrice = Number(product.dataset.compareAtPrice);
      const onSale = Number.isFinite(originalPrice) && originalPrice > price;
      const german = document.documentElement.lang === "de";
      const money = (cents) => new Intl.NumberFormat(german ? "de-DE" : "en-IE", { style: "currency", currency: "EUR" }).format(cents / 100);
      priceBlock.classList.toggle("is-on-sale", onSale);
      priceBlock.querySelector("[data-price-current]").textContent = money(price);
      const original = priceBlock.querySelector("[data-price-original]");
      original.hidden = !onSale;
      original.textContent = onSale ? money(originalPrice) : "";
      priceBlock.querySelector("[data-price-badge]").hidden = !onSale;
      const savings = priceBlock.querySelector("[data-price-savings]");
      savings.hidden = !onSale;
      savings.textContent = onSale ? `${german ? "Du sparst" : "You save"} ${money(originalPrice - price)}` : "";
      priceBlock.querySelector("[data-price-note]").textContent = german ? "Endpreis · keine USt. gemäß § 19 UStG" : "final price · no VAT charged (§ 19 UStG)";
      updateSaleBanner();
    };
    priceRenderers.push(renderPrice);
    renderPrice();

    const selectImage = (button) => {
      const nextSrc = button?.dataset.gallerySrc;
      if (!mainImage || !stage || !caption || !position || !nextSrc) return;

      thumbnails.forEach((thumbnail) => {
        const selected = thumbnail === button;
        thumbnail.classList.toggle("is-active", selected);
        thumbnail.setAttribute("aria-pressed", String(selected));
      });

      stage.classList.add("is-changing");
      mainImage.alt = button.dataset.galleryAlt || "Product image";
      caption.textContent = button.dataset.galleryLabel || "PRODUCT VIEW";
      position.textContent = button.dataset.galleryPosition || "";
      mainImage.addEventListener("load", () => stage.classList.remove("is-changing"), { once: true });
      mainImage.addEventListener("error", () => stage.classList.remove("is-changing"), { once: true });
      mainImage.src = nextSrc;
    };

    const moveImage = (direction) => {
      if (!thumbnails.length) return;
      const activeIndex = Math.max(0, thumbnails.findIndex((thumbnail) => thumbnail.classList.contains("is-active")));
      const nextIndex = (activeIndex + direction + thumbnails.length) % thumbnails.length;
      selectImage(thumbnails[nextIndex]);
    };

    thumbnails.forEach((button) => {
      button.addEventListener("click", () => selectImage(button));
    });
    previousButton?.addEventListener("click", () => moveImage(-1));
    nextButton?.addEventListener("click", () => moveImage(1));

    sizeOptions.forEach((button) => {
      button.addEventListener("click", () => {
        sizeOptions.forEach((option) => {
          const selected = option === button;
          option.classList.toggle("is-selected", selected);
          option.setAttribute("aria-pressed", String(selected));
        });

        if (buyButton && button.dataset.variantId) {
          buyButton.href = `${checkoutBase}${button.dataset.variantId}:1${checkoutVersion}`;
          if (productLink) {
            const productUrl = new URL(productLink.href);
            productUrl.searchParams.set("variant", button.dataset.variantId);
            productLink.href = productUrl.href;
          }
        }
        renderPrice();
      });
    });
  });
  window.addEventListener("sunny:languagechange", () => priceRenderers.forEach((renderPrice) => renderPrice()));
})();
