import { products, categories } from "./data/catalog.js";
import Catalog from "./components/Catalog.jsx";
import * as React from "react";
import { readStored, writeStored } from "./storage.js";
import { createPlan } from "./planner.js";
function App() {
  let [language, setLanguage] = React.useState(() =>
      readStored("forma-lang", "tm") === "en" ? "en" : "tm",
    ),
    [menuOpen, setMenuOpen] = React.useState(false),
    [saved, setSaved] = React.useState(() => {
      const stored = readStored("forma-saved", []);
      return Array.isArray(stored)
        ? stored.filter((name) =>
            products.some((product) => product.name === name),
          )
        : [];
    }),
    [onlySaved, setOnlySaved] = React.useState(false),
    [room, setRoom] = React.useState("living"),
    [style, setStyle] = React.useState("warm"),
    [area, setArea] = React.useState("25"),
    [brief, setBrief] = React.useState(""),
    [plan, setPlan] = React.useState(""),
    [planning, setPlanning] = React.useState(false),
    [planError, setPlanError] = React.useState(""),
    [step, setStep] = React.useState(1),
    [heroIndex, setHeroIndex] = React.useState(0),
    heroImages = ["hero", "interior", "project"],
    isEnglish = language === "en",
    translate = (e, t) => (isEnglish ? e : t);
  React.useEffect(() => {
    document.documentElement.lang = language;
    writeStored("forma-lang", language);
  }, [language]);
  React.useEffect(() => {
    writeStored("forma-saved", saved);
  }, [saved]);
  function toggleSaved(name) {
    setSaved((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name],
    );
  }
  const validArea =
    Number.isFinite(Number(area)) && Number(area) >= 5 && Number(area) <= 500;
  React.useEffect(() => {
    setPlan("");
    setPlanError("");
    setStep((current) => (current === 3 ? 1 : current));
  }, [room, style, area, brief, language]);
  React.useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        document.querySelector(".menu")?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);
  function generatePlan() {
    setPlanning(true);
    setPlanError("");
    setPlan("");
    try {
      setPlan(
        createPlan({
          room: room,
          style: style,
          size: area,
          brief: brief,
          lang: language,
        }),
      );
      setStep(3);
    } catch (error) {
      setPlanError(error.message);
      setStep(1);
    } finally {
      setPlanning(false);
    }
  }
  return (
    <>
      <header>
        <a className="logo" href="#">
          {"FORMA"}
          <span>{translate("DESIGN & LIVING", "DIZAÝN WE ÝAŞAÝYŞ")}</span>
        </a>
        <nav>
          <a href="#collection">{translate("Collections", "Kolleksiýalar")}</a>
          <a href="#philosophy">{translate("Our world", "Biziň dünýämiz")}</a>
          <a href="#worlds">{translate("Furniture worlds", "Mebel dünýäsi")}</a>
          <a href="#spaces">{translate("Spaces", "Giňişlikler")}</a>
        </nav>
        <div className="tools">
          <button
            className="language"
            onClick={() => setLanguage(isEnglish ? "tm" : "en")}
          >
            {isEnglish ? "EN" : "TM"} <span>{"⌄"}</span>
          </button>
          <button
            className="save-count"
            aria-label={translate(
              "View saved furniture",
              "Saýlanan mebelleri gör",
            )}
            aria-pressed={onlySaved}
            onClick={() => {
              (window.dispatchEvent(
                new CustomEvent("forma-category", { detail: "all" }),
              ),
                setOnlySaved(!onlySaved),
                document.getElementById("collection")?.scrollIntoView({
                  behavior: "smooth",
                }));
            }}
          >
            {"♡ "}
            <small>{saved.length}</small>
          </button>
          <button
            className="menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={translate("Open menu", "Menýuny aç")}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </header>
      {menuOpen && (
        <div className="menu-panel" id="mobile-menu">
          {[
            ["collection", translate("Collections", "Kolleksiýalar")],
            ["philosophy", translate("Our world", "Biziň dünýämiz")],
            ["worlds", translate("Furniture worlds", "Mebel dünýäsi")],
            ["spaces", translate("Spaces", "Giňişlikler")],
            ["atelier", translate("Interior atelier", "Interýer atelýesi")],
          ].map(([e, t]) => (
            <a href={"#" + e} onClick={() => setMenuOpen(false)} key={e}>
              {t}{" "}
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
          ))}
        </div>
      )}
      <main>
        <section className="hero">
          <img
            src={"/images/" + heroImages[heroIndex] + ".jpg"}
            alt={translate(
              "Sculptural furniture in a dramatic architectural interior",
              "Binagärlik giňişligindäki özboluşly mebeller",
            )}
          />
          <div className="shade" />
          <div className="hero-top">
            <span>{translate("THE ART OF LIVING", "ÝAŞAÝYŞ SUNGATY")}</span>
            <span>
              {translate("COLLECTION", "KOLLEKSIÝA")}
              {" / 01"}
            </span>
          </div>
          <div className="hero-copy">
            <p>
              {translate(
                "MATERIAL. FORM. EMOTION.",
                "MATERIAL. GÖRNÜŞ. DUÝGY.",
              )}
            </p>
            <h1>
              {translate("Beyond", "Adaty çäklerden")}
              <br />
              <em>{translate("the ordinary.", "daşarda.")}</em>
            </h1>
            <a className="line-link" href="#collection">
              {translate("Explore the collection", "Kolleksiýany öwreniň")}{" "}
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
            </a>
          </div>
          <div className="hero-bottom">
            <div className="hero-pagination">
              {heroImages.map((e, t) => (
                <button
                  className={heroIndex === t ? "current" : ""}
                  aria-label={
                    translate("Show interior ", "Interýeri görkez: ") + (t + 1)
                  }
                  onClick={() => setHeroIndex(t)}
                  key={e}
                >
                  {String(t + 1).padStart(2, "0")}
                </button>
              ))}
            </div>
            <a href="#philosophy">
              {translate("SCROLL TO DISCOVER", "AŞAK GEÇIP TANYŞYŇ")}
              {" ↓"}
            </a>
            <span>{"FORMA / EST. 2026"}</span>
          </div>
        </section>
        <section className="intro" id="philosophy">
          <p className="eyebrow">
            {"01 / "}
            {translate("OUR PHILOSOPHY", "BIZIŇ PELSEPÄMIZ")}
          </p>
          <div>
            <h2>
              {translate("Not just furniture.", "Diňe mebel däl.")}
              <br />
              <span>
                {translate("A way of feeling.", "Duýgularyň beýany.")}
              </span>
            </h2>
            <div className="intro-bottom">
              <p>
                {translate(
                  "A meeting of natural materials, expressive forms and thoughtful spaces. Explore a quieter approach to living, where every object has room to belong.",
                  "Tebigy materiallaryň, täsirli görnüşleriň we oýlanyşykly giňişlikleriň duşuşygy. Her bir zadyň öz ornuny tapýan asuda ýaşaýyş dünýäsini öwreniň.",
                )}
              </p>
              <a
                href="#materials"
                className="circle-link"
                aria-label={translate(
                  "Explore materials",
                  "Materiallary öwreniň",
                )}
              >
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
        </section>
        <Catalog
          en={isEnglish}
          saved={saved}
          save={toggleSaved}
          only={onlySaved}
          onOnly={setOnlySaved}
        />
        <section className="feature" id="spaces">
          <img
            src="/images/project.jpg"
            alt={translate(
              "A carefully composed living space",
              "Sazlaşykly ýaşaýyş giňişligi",
            )}
            loading="lazy"
          />
          <div className="feature-overlay">
            <p className="eyebrow">
              {"03 / "}
              {translate("SPACES TO INHABIT", "ÝAŞAÝYŞ GIŇIŞLIKLERI")}
            </p>
            <h2>
              {translate("A sense", "Öz öýüňiziň")}
              <br />
              <em>{translate("of belonging.", "ýylylygy.")}</em>
            </h2>
            <a className="line-link" href="#atelier">
              {translate(
                "Imagine your space",
                "Giňişligiňizi göz öňüne getiriň",
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
        </section>
        <section className="editorial-pair">
          <article>
            <img
              src={
                products.find((e) => e.category === "tables")?.images[1] ||
                "/images/collection.jpg"
              }
              alt={translate(
                "Sculptural dining table",
                "Özboluşly nahar stoly",
              )}
              loading="lazy"
            />
            <p className="eyebrow">
              {translate("THE DINING EDIT", "NAHARHANA KOLLEKSIÝASY")}
            </p>
            <h2>{translate("Around the table.", "Bir stoluň başynda.")}</h2>
            <p>
              {translate(
                "Monumental shapes, expressive materials and the simple pleasure of gathering. Discover tables that give a room its centre.",
                "Täsirli görnüşler, özboluşly materiallar we bilelikde geçirilen pursatlar. Otagyň merkezine öwrülýän stollary öwreniň.",
              )}
            </p>
            <a href="#collection">
              {translate("Explore the pieces", "Görnüşleri öwreniň")}{" "}
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
          </article>
          <article>
            <img
              src={
                products.find((e) => e.category === "lighting")?.images[1] ||
                "/images/interior.jpg"
              }
              alt={translate("Sculptural lighting", "Özboluşly çyralar")}
              loading="lazy"
            />
            <p className="eyebrow">
              {translate("LIGHT AS AN OBJECT", "ÝAGTYLYK SUNGATY")}
            </p>
            <h2>
              {translate("An atmosphere of light.", "Ýagtylygyň täsiri.")}
            </h2>
            <p>
              {translate(
                "Suspended lines and warm reflections. Lighting becomes a sculptural element, bringing depth and rhythm to an interior.",
                "Asma çyzyklar we ýyly öwüşginler. Yşyklandyryş interýere çuňluk we sazlaşyk berýän çeper bölege öwrülýär.",
              )}
            </p>
            <a href="#worlds">
              {translate("Discover the worlds", "Mebel dünýäsini açyň")}{" "}
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
          </article>
        </section>
        <section className="materials" id="materials">
          <div>
            <p className="eyebrow">
              {"04 / "}
              {translate("MATERIAL LIBRARY", "MATERIALLAR DÜNÝÄSI")}
            </p>
            <h2>
              {translate("Nature sets", "Tebigat")}
              <br />
              {translate("the tone.", "äheň berýär.")}
            </h2>
            <p>
              {translate(
                "Stone, wood and metal. Explore tactile contrasts, warm tones and the beauty of imperfect surfaces.",
                "Daş, agaç we metal. Dürli gurluşlary, ýyly öwüşginleri we tebigy ýüzleriň gözelligini öwreniň.",
              )}
            </p>
            <div className="swatches">
              <span
                style={{
                  background: "#8b8170",
                }}
              />
              <span
                style={{
                  background: "#4a3529",
                }}
              />
              <span
                style={{
                  background: "#b4a590",
                }}
              />
              <span
                style={{
                  background: "#474845",
                }}
              />
            </div>
          </div>
          <img
            src="/images/interior.jpg"
            alt={translate(
              "Stone and bronze material inspiration",
              "Daş we bürünç materiallarynyň sazlaşygy",
            )}
            loading="lazy"
          />
        </section>
        <section className="index-section">
          <p className="eyebrow">
            {translate("THE COMPLETE COLLECTION", "DOLY KOLLEKSIÝA")}
          </p>
          <h2>
            {translate("Find your perspective.", "Öz garaýşyňyzy tapyň.")}
          </h2>
          <div className="category-index">
            {categories.map((e, t) => (
              <a
                href="#collection"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("forma-category", {
                      detail: e.id,
                    }),
                  )
                }
                key={e.id}
              >
                <small>{String(t + 1).padStart(2, "0")}</small>
                {isEnglish ? e.en : e.tm}
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
              </a>
            ))}
          </div>
        </section>
        <section className="atelier" id="atelier">
          <div className="atelier-intro">
            <p className="eyebrow">
              {"05 / "}
              {translate("INTERIOR ATELIER", "INTERÝER ATELÝESI")}
            </p>
            <h2>
              {translate("Your space.", "Siziň giňişligiňiz.")}
              <br />
              <em>{translate("New possibilities.", "Täze mümkinçilikler.")}</em>
            </h2>
            <p>
              {translate(
                "Start with an idea. Shape a personal interior brief, step by step.",
                "Bir pikirden başlaň. Şahsy interýer meýilnamaňyzy ädimme-ädim dörediň.",
              )}
            </p>
            <span className="ai-note">
              {"✧ "}
              {translate(
                "Personal room planning · Based on your preferences",
                "Şahsy otag meýilnamasy · Islegleriňize görä",
              )}
            </span>
          </div>
          <div className="planner">
            {planError && <p role="alert">{planError}</p>}
            <div className="steps">
              {[
                translate("Your room", "Otagyňyz"),
                translate("Your style", "Stiliňiz"),
                translate("Your direction", "Meýilnamaňyz"),
              ].map((e, t) => (
                <button
                  disabled={(t === 1 && !validArea) || (t === 2 && !plan)}
                  className={step === t + 1 ? "selected" : ""}
                  onClick={() => setStep(t + 1)}
                  key={e}
                >
                  <b>
                    {"0"}
                    {t + 1}
                  </b>
                  {e}
                </button>
              ))}
            </div>
            {step === 1 ? (
              <>
                <h3>
                  {translate(
                    "Make room for possibility.",
                    "Täze mümkinçiliklere ýer açyň.",
                  )}
                </h3>
                <label>
                  {translate("Room type", "Otagyň görnüşi")}
                  <select
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                  >
                    <option value="living">
                      {translate("Living room", "Myhman otagy")}
                    </option>
                    <option value="dining">
                      {translate("Dining room", "Naharhana")}
                    </option>
                    <option value="bedroom">
                      {translate("Bedroom", "Ýatylýan otag")}
                    </option>
                  </select>
                </label>
                <label>
                  {translate("Room area (m²)", "Otagyň meýdany (m²)")}
                  <input
                    type="number"
                    min="5"
                    max="500"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                  />
                </label>
                <button
                  className="primary"
                  disabled={!validArea}
                  onClick={() => setStep(2)}
                >
                  {translate("Continue", "Dowam et")}
                  {" →"}
                </button>
              </>
            ) : step === 2 ? (
              <>
                <h3>
                  {translate("What feels like you?", "Haýsy stil size ýakyn?")}
                </h3>
                <label>
                  {translate("Preferred atmosphere", "Isleýän äheňiňiz")}
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                  >
                    <option value="warm">
                      {translate("Warm & natural", "Ýyly we tebigy")}
                    </option>
                    <option value="bold">
                      {translate("Bold & sculptural", "Täsirli we özboluşly")}
                    </option>
                  </select>
                </label>
                <label>
                  {translate("Tell us more (optional)", "Goşmaça islegleriňiz")}
                  <textarea
                    value={brief}
                    maxLength={1500}
                    onChange={(e) => setBrief(e.target.value)}
                    placeholder={translate(
                      "Favourite materials, colours, needs…",
                      "Halaýan materiallaryňyz, reňkleriňiz, islegleriňiz…",
                    )}
                  />
                </label>
                <button
                  className="primary"
                  onClick={generatePlan}
                  disabled={planning}
                >
                  {planning
                    ? translate("Preparing…", "Taýýarlanýar…")
                    : translate("Create my direction", "Meýilnamamy taýýarla")}
                  {" ✧"}
                </button>
              </>
            ) : (
              <>
                <h3>
                  {translate(
                    "A starting point for your space.",
                    "Giňişligiňiz üçin başlangyç.",
                  )}
                </h3>
                <p className="result" aria-live="polite">
                  {plan}
                </p>
                <button
                  className="primary"
                  onClick={() => {
                    let e = document.createElement("a");
                    ((e.href = URL.createObjectURL(
                      new Blob([plan], {
                        type: "text/plain;charset=utf-8",
                      }),
                    )),
                      (e.download = "FORMA-interior-brief.txt"),
                      e.click(),
                      setTimeout(() => URL.revokeObjectURL(e.href), 1000));
                  }}
                >
                  {translate("Download brief", "Meýilnamany ýükle")}
                  {" ↓"}
                </button>
              </>
            )}
          </div>
        </section>
      </main>
      <footer>
        <div className="footer-top">
          <a className="footer-logo" href="#">
            {"FORMA"}
          </a>
          <p>
            {translate("Considered objects.", "Oýlanyşykly görnüşler.")}
            <br />
            {translate("Meaningful spaces.", "Manyly giňişlikler.")}
          </p>
          <a href="#atelier">
            {translate("Create your interior", "Interýeriňizi dörediň")}{" "}
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
        <div className="footer-bottom">
          <span>{"© 2026 FORMA"}</span>
          <button onClick={() => setLanguage(isEnglish ? "tm" : "en")}>
            {isEnglish ? "Türkmençe" : "English"}{" "}
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
      </footer>
    </>
  );
}
export { App as default };
