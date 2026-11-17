import * as React from "react";
import { products, categories } from "../data/catalog.js";
export default function Catalog({
  en: isEnglish,
  saved: saved,
  save: toggleSaved,
  only: onlySaved,
  onOnly: setOnlySaved,
}) {
  let translate = (t, n) => (isEnglish ? t : n),
    [category, setCategory] = React.useState("all"),
    [search, setSearch] = React.useState(""),
    [view, setView] = React.useState("rail"),
    [selectedProduct, setSelectedProduct] = React.useState(null),
    [imageIndex, setImageIndex] = React.useState(0),
    [galleryIndex, setGalleryIndex] = React.useState(0),
    galleryRef = React.useRef(null),
    worldsRef = React.useRef(null),
    closeButtonRef = React.useRef(null),
    [worldIndex, setWorldIndex] = React.useState(0),
    filteredProducts = products.filter(
      (e) =>
        (category === "all" || e.category === category) &&
        (!onlySaved || saved.includes(e.name)) &&
        e.name.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()),
    );
  React.useEffect(() => {
    function e(e) {
      (setCategory(e.detail),
        setSearch(""),
        setOnlySaved(false),
        setGalleryIndex(0),
        galleryRef.current?.scrollTo({
          left: 0,
        }));
    }
    return (
      window.addEventListener("forma-category", e),
      () => window.removeEventListener("forma-category", e)
    );
  }, [setOnlySaved]);
  function selectCategory(e) {
    (setCategory(e),
      setGalleryIndex(0),
      galleryRef.current?.scrollTo({
        left: 0,
      }));
  }
  function openProduct(e) {
    (setSelectedProduct(e), setImageIndex(0));
  }
  React.useEffect(() => {
    if (!selectedProduct) return;
    let e = document.activeElement;
    ((document.body.style.overflow = "hidden"),
      closeButtonRef.current?.focus());
    function t(e) {
      if (
        (e.key === "Escape" && setSelectedProduct(null),
        e.key === "ArrowRight" &&
          setImageIndex((e) => (e + 1) % selectedProduct.images.length),
        e.key === "ArrowLeft" &&
          setImageIndex(
            (e) =>
              (e + selectedProduct.images.length - 1) %
              selectedProduct.images.length,
          ),
        e.key === "Tab")
      ) {
        let t = Array.from(
            document.querySelectorAll(
              ".catalog-dialog button:not(:disabled),.catalog-dialog a[href]",
            ),
          ),
          n = t[0],
          r = t[t.length - 1];
        e.shiftKey && document.activeElement === n
          ? (e.preventDefault(), r.focus())
          : !e.shiftKey &&
            document.activeElement === r &&
            (e.preventDefault(), n.focus());
      }
    }
    return (
      window.addEventListener("keydown", t),
      () => {
        ((document.body.style.overflow = ""),
          window.removeEventListener("keydown", t),
          e?.focus({ preventScroll: true }));
      }
    );
  }, [selectedProduct]);
  function scrollGallery(e) {
    if (galleryRef.current) {
      let t = galleryRef.current.querySelector("article");
      galleryRef.current.scrollBy({
        left: e * ((t?.getBoundingClientRect().width || 400) + 24),
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    }
  }
  return (
    <>
      <section className="collection expanded-collection" id="collection">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              {"02 / "}
              {translate("A WORLD OF POSSIBILITIES", "MÜMKINÇILIKLER DÜNÝÄSI")}
            </p>
            <h2>
              {translate("Every form of living.", "Ýaşaýşyň ähli görnüşleri.")}
            </h2>
          </div>
          <p className="catalog-intro">
            {translate(
              "From a single object to a complete interior. Discover the collection, one detail at a time.",
              "Bir esbapdan tutuş interýere çenli. Kolleksiýany her bir aýratynlygy bilen öwreniň.",
            )}
          </p>
        </div>
        <div
          className="category-ribbon"
          aria-label={translate("Furniture categories", "Mebel görnüşleri")}
        >
          <button
            className={category === "all" ? "active" : ""}
            onClick={() => selectCategory("all")}
          >
            {translate("All pieces", "Ähli görnüşler")}{" "}
            <sup>{products.length}</sup>
          </button>
          {categories.map((t) => (
            <button
              className={category === t.id ? "active" : ""}
              onClick={() => selectCategory(t.id)}
              key={t.id}
            >
              {isEnglish ? t.en : t.tm}
              <sup>{products.filter((e) => e.category === t.id).length}</sup>
            </button>
          ))}
        </div>
        <div className="catalog-toolbar">
          <label className="catalog-search">
            <span>{"⌕"}</span>
            <input
              aria-label={translate("Search furniture", "Mebel gözle")}
              placeholder={translate("Find a piece…", "Mebel gözläň…")}
              value={search}
              onChange={(e) => {
                (setSearch(e.target.value),
                  setGalleryIndex(0),
                  galleryRef.current?.scrollTo({
                    left: 0,
                  }));
              }}
            />
            <button
              aria-label={translate("Clear search", "Gözlegi arassala")}
              hidden={!search}
              onClick={() => setSearch("")}
            >
              {"×"}
            </button>
          </label>
          <div>
            <button
              className={onlySaved ? "active" : ""}
              onClick={() => {
                (setOnlySaved(!onlySaved), setGalleryIndex(0));
              }}
            >
              {"♡ "}
              {translate("My selection", "Saýlananlar")}
              {" ("}
              {saved.length}
              {")"}
            </button>
            <button onClick={() => setView(view === "rail" ? "grid" : "rail")}>
              {view === "rail"
                ? translate("Grid view", "Tor görnüşi")
                : translate("Horizontal view", "Keseligine görnüş")}{" "}
              {view === "rail" ? "▦" : "↔"}
            </button>
          </div>
        </div>
        <div
          ref={galleryRef}
          className={"catalog-products " + view}
          tabIndex={0}
          role="region"
          aria-label={translate(
            "Furniture gallery. Use arrow keys to explore.",
            "Mebel galereýasy. Ok düwmeleri bilen görüň.",
          )}
          onKeyDown={(e) => {
            e.target === e.currentTarget &&
              (e.key === "ArrowRight" || e.key === "ArrowLeft") &&
              (e.preventDefault(),
              scrollGallery(e.key === "ArrowRight" ? 1 : -1));
          }}
          onScroll={() => {
            if (galleryRef.current) {
              let e = galleryRef.current.querySelector("article");
              setGalleryIndex(
                Math.round(
                  galleryRef.current.scrollLeft /
                    ((e?.getBoundingClientRect().width || 400) + 24),
                ),
              );
            }
          }}
        >
          {filteredProducts.map((r, i) => (
            <article key={r.id}>
              <div className="catalog-image">
                <button
                  onClick={() => openProduct(r)}
                  aria-label={translate("View ", "Gör: ") + r.name}
                >
                  <img
                    src={r.images[0]}
                    alt={r.name}
                    loading="lazy"
                    draggable="false"
                  />
                  {r.images[1] && (
                    <img
                      className="alternate"
                      src={r.images[1]}
                      alt=""
                      loading="lazy"
                      draggable="false"
                    />
                  )}
                </button>
                <span className="piece-index">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <button
                  className="heart"
                  aria-pressed={saved.includes(r.name)}
                  aria-label={
                    (saved.includes(r.name)
                      ? translate("Unsave ", "Aýyr: ")
                      : translate("Save ", "Sakla: ")) + r.name
                  }
                  onClick={() => toggleSaved(r.name)}
                >
                  {saved.includes(r.name) ? "♥" : "♡"}
                </button>
              </div>
              <button className="product-title" onClick={() => openProduct(r)}>
                <h3>{r.name}</h3>
                <span>
                  <svg
                    aria-hidden="true"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  >
                    <path d="M5 19 19 5M5 5h14v14" />
                  </svg>
                </span>
              </button>
              <p>
                {isEnglish
                  ? categories.find((e) => e.id === r.category)?.en
                  : categories.find((e) => e.id === r.category)?.tm}
              </p>
            </article>
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <div className="empty-state">
            <h3>{translate("No pieces found.", "Görnüş tapylmady.")}</h3>
            <p>
              {translate(
                "Try another category or clear your search.",
                "Başga görnüşi saýlaň ýa-da gözlegi arassalaň.",
              )}
            </p>
            <button
              onClick={() => {
                (setSearch(""), selectCategory("all"), setOnlySaved(false));
              }}
            >
              {translate("Show all pieces", "Ähli görnüşleri görkez")}{" "}
              <svg
                aria-hidden="true"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              >
                <path d="M5 19 19 5M5 5h14v14" />
              </svg>
            </button>
          </div>
        )}
        <div className="gallery-bottom">
          <span>
            {String(
              Math.min(galleryIndex + 1, filteredProducts.length),
            ).padStart(2, "0")}{" "}
            <i /> {String(filteredProducts.length).padStart(2, "0")}
          </span>
          <p>
            {translate("SWIPE TO EXPLORE", "GÖRMEK ÜÇIN SÜÝŞÜRIŇ")}
            {" ↔"}
          </p>
          {view === "rail" && (
            <div className="gallery-arrows">
              <button
                disabled={galleryIndex === 0}
                onClick={() => scrollGallery(-1)}
                aria-label={translate("Previous furniture", "Öňki mebeller")}
              >
                {"←"}
              </button>
              <button
                disabled={
                  !filteredProducts.length ||
                  galleryIndex >= filteredProducts.length - 1
                }
                onClick={() => scrollGallery(1)}
                aria-label={translate("Next furniture", "Indiki mebeller")}
              >
                {"→"}
              </button>
            </div>
          )}
        </div>
      </section>
      <section className="living-worlds" id="worlds">
        <div className="worlds-heading">
          <p className="eyebrow">
            {translate(
              "ELEVEN WORLDS. ONE VISION.",
              "ON BIR DÜNÝÄ. BIR GARAÝYŞ.",
            )}
          </p>
          <h2>{translate("Spaces, without limits.", "Çäksiz giňişlikler.")}</h2>
          <p>
            {translate("Explore every category", "Ähli görnüşleri öwreniň")}
            {" ↔"}
          </p>
        </div>
        <div
          className="worlds-rail"
          ref={worldsRef}
          onScroll={() => {
            worldsRef.current &&
              setWorldIndex(
                Math.round(
                  worldsRef.current.scrollLeft /
                    (worldsRef.current
                      .querySelector("article")
                      .getBoundingClientRect().width +
                      20),
                ),
              );
          }}
        >
          {categories.map((t, n) => {
            let r = products.find((e) => e.category === t.id);
            return (
              <article key={t.id}>
                <img
                  src={r?.images[1] || r?.images[0]}
                  alt={isEnglish ? t.en : t.tm}
                  loading="lazy"
                />
                <div>
                  <span>
                    {String(n + 1).padStart(2, "0")}
                    {" / 11"}
                  </span>
                  <h3>{isEnglish ? t.en : t.tm}</h3>
                  <button
                    onClick={() => {
                      (selectCategory(t.id),
                        setOnlySaved(false),
                        setSearch(""),
                        document.getElementById("collection")?.scrollIntoView({
                          behavior: "smooth",
                        }));
                    }}
                  >
                    {translate("Discover the collection", "Kolleksiýany aç")}{" "}
                    <svg
                      aria-hidden="true"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    >
                      <path d="M5 19 19 5M5 5h14v14" />
                    </svg>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
        <div className="worlds-controls">
          <span>
            {String(worldIndex + 1).padStart(2, "0")}
            {" — 11"}
          </span>
          <div>
            <button
              aria-label={translate("Previous category", "Öňki görnüş")}
              disabled={worldIndex === 0}
              onClick={() =>
                worldsRef.current?.scrollBy({
                  left: -(
                    worldsRef.current
                      .querySelector("article")
                      .getBoundingClientRect().width + 20
                  ),
                  behavior: "smooth",
                })
              }
            >
              {"←"}
            </button>
            <button
              aria-label={translate("Next category", "Indiki görnüş")}
              disabled={worldIndex >= 10}
              onClick={() =>
                worldsRef.current?.scrollBy({
                  left:
                    worldsRef.current
                      .querySelector("article")
                      .getBoundingClientRect().width + 20,
                  behavior: "smooth",
                })
              }
            >
              {"→"}
            </button>
          </div>
        </div>
      </section>
      {selectedProduct && (
        <div className="catalog-modal" onClick={() => setSelectedProduct(null)}>
          <div
            className="catalog-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={selectedProduct.name}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              className="catalog-close"
              onClick={() => setSelectedProduct(null)}
              aria-label={translate("Close details", "Maglumatlary ýap")}
            >
              {"×"}
            </button>
            <div className="detail-visual">
              <img
                src={selectedProduct.images[imageIndex]}
                alt={selectedProduct.name + " — " + (imageIndex + 1)}
              />
              <div className="photo-controls">
                <button
                  disabled={selectedProduct.images.length < 2}
                  onClick={() =>
                    setImageIndex(
                      (imageIndex + selectedProduct.images.length - 1) %
                        selectedProduct.images.length,
                    )
                  }
                  aria-label={translate("Previous image", "Öňki surat")}
                >
                  {"←"}
                </button>
                <span>
                  {imageIndex + 1}
                  {" / "}
                  {selectedProduct.images.length}
                </span>
                <button
                  disabled={selectedProduct.images.length < 2}
                  onClick={() =>
                    setImageIndex(
                      (imageIndex + 1) % selectedProduct.images.length,
                    )
                  }
                  aria-label={translate("Next image", "Indiki surat")}
                >
                  {"→"}
                </button>
              </div>
            </div>
            <div className="detail-copy">
              <p className="eyebrow">
                {"HENGE / "}
                {isEnglish
                  ? categories.find((e) => e.id === selectedProduct.category)
                      ?.en
                  : categories.find((e) => e.id === selectedProduct.category)
                      ?.tm}
              </p>
              <h2>{selectedProduct.name}</h2>
              <p>
                {translate(
                  "Explore the form, materials and atmosphere through the original collection imagery. Save this piece to your personal selection or use it as the starting point for your room.",
                  "Asyl kolleksiýanyň suratlary arkaly görnüşini, materiallaryny we äheňini öwreniň. Bu mebeli saýlananlaryňyza goşuň ýa-da otagyňyz üçin başlangyç hökmünde ulanyň.",
                )}
              </p>
              <div className="detail-thumbs">
                {selectedProduct.images.map((e, t) => (
                  <button
                    className={t === imageIndex ? "current" : ""}
                    aria-label={translate("Image ", "Surat ") + (t + 1)}
                    onClick={() => setImageIndex(t)}
                    key={e}
                  >
                    <img src={e} alt="" />
                  </button>
                ))}
              </div>
              <button
                className="primary"
                onClick={() => toggleSaved(selectedProduct.name)}
              >
                {saved.includes(selectedProduct.name)
                  ? translate("Remove from selection", "Saýlananlardan aýyr")
                  : translate("Save to my selection", "Saýlananlara goş")}
                {" ♡"}
              </button>
              <a href="#atelier" onClick={() => setSelectedProduct(null)}>
                {translate("Plan your room", "Otagyňyzy meýilleşdiriň")}{" "}
                <svg
                  aria-hidden="true"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                >
                  <path d="M5 19 19 5M5 5h14v14" />
                </svg>
              </a>
              <a
                className="source-link"
                href={selectedProduct.source}
                target="_blank"
                rel="noreferrer"
              >
                {translate(
                  "Original product details at Henge",
                  "Henge sahypasynda asyl maglumatlar",
                )}{" "}
                <svg
                  aria-hidden="true"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                >
                  <path d="M5 19 19 5M5 5h14v14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
