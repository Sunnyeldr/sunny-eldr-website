"use strict";

(() => {
  const checkoutBase = "https://shop.sunnyeldr.com/buy/";
  const checkoutVersion = "?ucp/version=2026-08-25";

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
        }
      });
    });
  });
})();
