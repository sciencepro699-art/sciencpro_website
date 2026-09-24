/* =========================================================
   SCIENCE PRO — Site Data
   -----------------------------------------------------------
   Single source of truth for classes, subjects, and the topic
   (chapter) list per subject. Each topic is a standalone page
   (its own HTML + JS) because a sound-wave simulator and a
   quadratic-equation game need completely different UIs — this
   object only tells subject.html what to list and where to send
   the student. When a backend exists, this object can be
   replaced by an API response with the same shape.
   ========================================================= */

const SITE_DATA = {

  classes: [5, 6, 7, 8, 9, 10, 11, 12].map((n) => ({
    id: n,
    label: `Class ${n}`,
    active: n === 10, // only Class 10 is live for now
  })),

  subjects: [
    {
      id: "physics",
      name: "Physics",
      shortTag: "PHY",
      color: "physics",
      tagline: "Forces, light and circuits — how the physical world moves and shines.",
    },
    {
      id: "chemistry",
      name: "Chemistry",
      shortTag: "CHEM",
      color: "chemistry",
      tagline: "Reactions, acids, metals — the quiet drama of matter changing form.",
    },
    {
      id: "maths",
      name: "Maths",
      shortTag: "MATH",
      color: "maths",
      tagline: "Numbers, equations and shapes — the logic behind every pattern.",
    },
    {
      id: "biology",
      name: "Biology",
      shortTag: "BIO",
      color: "biology",
      tagline: "Cells, systems and life processes — how living things keep going.",
    },
  ],

  /* Every subject → an array of chapters/topics.
     Each LIVE topic is its own standalone page (its own HTML + JS),
     because a sound-wave simulator and a quadratic-equation game need
     completely different UIs. This object just tells subject.html
     what to list and where to link — it does not render the topic
     itself. Topics with status "soon" show as locked cards.        */
  topics: {
    physics: [
      {
        id: "sound-waves",
        title: "Sound Waves",
        tag: "Chapter 1",
        desc: "Simulate a sound wave and see how frequency, time period, wavelength and amplitude relate to each other — then hear it.",
        status: "live",
        page: "soundwaves.html",
      },
      {
        id: "light-reflection",
        title: "Reflection of Light",
        tag: "Chapter 2",
        desc: "Coming soon.",
        status: "soon",
      },
      {
        id: "electricity",
        title: "Electricity",
        tag: "Chapter 3",
        desc: "Coming soon.",
        status: "soon",
      },
    ],
    chemistry: [
      {
        id: "nomenclature",
        title: "Nomenclature of Organic Compounds",
        tag: "Chapter 1",
        desc: "Build simple organic compound names yourself — methane to butanoic acid — and see how the prefix and suffix combine.",
        status: "live",
        page: "nomenclature.html",
      },
    ],
    maths: [],
    biology: [
      {
        id: "genetics",
        title: "Genetics of Life",
        tag: "Chapter 1",
        desc: "Zoom from a whole cell down to a single gene, and see exactly how a DNA double helix is built.",
        status: "live",
        page: "genetics.html",
      },
    ],
  },
};
