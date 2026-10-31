"use strict";

(() => {
  const mainImage = document.querySelector("[data-gallery-main]");
  const stage = document.querySelector(".merch-gallery-stage");
  const caption = document.querySelector("[data-gallery-caption]");
  const position = document.querySelector("[data-gallery-position]");
  const thumbnails = [...document.querySelectorAll(".merch-thumbnail")];

  function selectImage(button) {
    if (!mainImage || !stage || !caption || !position) return;
    const nextSrc = button.dataset.gallerySrc;
    if (!nextSrc) return;

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
  }

  thumbnails.forEach((button) => button.addEventListener("click", () => selectImage(button)));
})();
