export function createPlan({ room, style, size, brief = "", lang = "en" }) {
  const en = lang === "en";
  const tr = (english, turkmen) => (en ? english : turkmen);
  const area = Number(size);
  if (!Number.isFinite(area) || area < 5 || area > 500) {
    throw new Error(
      tr(
        "Enter a room area between 5 and 500 m².",
        "Otagyň meýdany 5–500 m² aralygynda bolmaly.",
      ),
    );
  }
  const rooms = {
    living: {
      name: tr("Living room", "Myhman otagy"),
      layout: tr(
        "Anchor the seating area with a rug. Position the sofa toward the focal point and keep a clear route between doorways.",
        "Oturylýan ýeri haly bilen birleşdiriň. Diwany esasy nokada tarap ýerleşdiriň we gapylaryň arasynda açyk ýol goýuň.",
      ),
      pieces: "Re-Bond · Pivot · Superb-All Horizontal Evo",
    },
    dining: {
      name: tr("Dining room", "Naharhana"),
      layout: tr(
        "Centre the dining table under the main light. Leave space to pull chairs out and reach the sideboard.",
        "Nahar stoluny esasy çyranyň aşagynda ýerleşdiriň. Oturgyçlary çekmek we komoda barmak üçin ýer goýuň.",
      ),
      pieces: "Shield · Quantum · Cubik",
    },
    bedroom: {
      name: tr("Bedroom", "Ýatylýan otag"),
      layout: tr(
        "Place the bed against the quietest wall. Keep access to both sides and layer bedside lighting with a soft main light.",
        "Krowaty iň asuda diwara ýerleşdiriň. Iki tarapdan hem ýol goýuň we ýumşak esasy yşygy krowat ýanyndaky çyralar bilen utgaşdyryň.",
      ),
      pieces: "Avenue · Obsession · Superb-All Horizontal Evo",
    },
  };
  if (!Object.hasOwn(rooms, room) || !["warm", "bold"].includes(style)) {
    throw new Error(
      tr(
        "Choose a room and one of the available styles.",
        "Otagyň görnüşini we stili saýlaň.",
      ),
    );
  }
  const selected = rooms[room];
  return [
    `${selected.name} · ${area} m²`,
    selected.layout,
    area < 20
      ? tr(
          "For this compact room, choose fewer pieces, favour slim profiles and measure each item before ordering.",
          "Bu ykjam otag üçin az sanly mebel we inçe görnüşleri saýlaň. Sargyt etmezden öň her bir mebeli ölçäň.",
        )
      : tr(
          "Define separate areas with rugs and lighting. Keep the main circulation route clear.",
          "Aýratyn ýerleri haly we yşyk bilen kesgitläň. Esasy geçelgäni açyk saklaň.",
        ),
    style === "warm"
      ? tr(
          "Materials: warm ivory, walnut tones and aged bronze. Add texture through natural fabrics.",
          "Materiallar: ýyly ak, hoz agajynyň reňki we bürünç. Tebigy matalar bilen dürli gurluşlary goşuň.",
        )
      : tr(
          "Materials: charcoal, natural stone and brushed metal. Balance sculptural pieces with quiet surfaces.",
          "Materiallar: goýy çal, tebigy daş we metal. Özboluşly mebelleri sada ýüzler bilen sazlaşdyryň.",
        ),
    tr("Collection to explore: ", "Öwrenmek üçin kolleksiýa: ") +
      selected.pieces,
    brief.trim()
      ? tr("Your brief: ", "Siziň islegleriňiz: ") + brief.trim()
      : "",
    tr(
      "Planning guidance based on your selections. Verify furniture dimensions and room measurements before purchase.",
      "Saýlawlaryňyza esaslanýan meýilleşdiriş maslahaty. Satyn almazdan öň mebelleriň we otagyň ölçeglerini barlaň.",
    ),
  ]
    .filter(Boolean)
    .join("\n\n");
}
