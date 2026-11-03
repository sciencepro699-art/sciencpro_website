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
        id: "lenses",
        title: "Lenses",
        tag: "Chapter 2",
        desc: "Move an object in front of a lens and see where the image forms, how big it is and whether it is real or virtual.",
        status: "live",
        page: "lenses.html",
      },
      {
        id: "colours-vision",
        title: "The World of Colours and Vision",
        tag: "Chapter 3",
        desc: "Mix red, green and blue lights, see objects in coloured light, split white light with a prism and fix eye defects with lenses.",
        status: "live",
        page: "colours-vision.html",
      },
      {
        id: "magnetic-effect",
        title: "Magnetic Effect of Electric Current",
        tag: "Chapter 4",
        desc: "See compass needles turn around a wire, build a solenoid and use Fleming's left-hand rule to find the force on a wire.",
        status: "live",
        page: "magnetic-effect.html",
      },
      {
        id: "electric-energy",
        title: "Electric Energy: Consumption and Conservation",
        tag: "Chapter 5",
        desc: "Heat a coil with Joule's law and work out a real Kerala electricity bill for your home appliances.",
        status: "live",
        page: "electric-energy.html",
      },
      {
        id: "electromagnetic-induction",
        title: "Electromagnetic Induction in Daily Life",
        tag: "Chapter 6",
        desc: "Move a magnet through a coil, use a transformer and see why power is sent at high voltage.",
        status: "live",
        page: "electromagnetic-induction.html",
      },
      {
        id: "mechanical-advantage",
        title: "Mechanical Advantage in Action",
        tag: "Chapter 7",
        desc: "Balance levers, count pulley ropes and roll loads up inclined planes to find the mechanical advantage.",
        status: "live",
        page: "mechanical-advantage.html",
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
      {
        id: "organic-reactions",
        title: "Reactions of Organic Compounds",
        tag: "Chapter 2",
        desc: "Watch substitution, addition, combustion and cracking happen, build polymers and make fruity esters.",
        status: "live",
        page: "organic-reactions.html",
      },
      {
        id: "periodic-table",
        title: "Periodic Table and Electronic Configuration",
        tag: "Chapter 3",
        desc: "Fill electrons into subshells for elements 1 to 36, see why chromium and copper break the rule, and read block, period and group from the configuration.",
        status: "live",
        page: "periodic-table.html",
      },
      {
        id: "gas-laws",
        title: "Gas Laws and Mole Concept",
        tag: "Chapter 4",
        desc: "Squeeze a gas with Boyle's piston, heat a balloon with Charles's law and convert mass, moles, molecules and STP volume.",
        status: "live",
        page: "gas-laws.html",
      },
      {
        id: "electrochemistry",
        title: "Electrochemistry",
        tag: "Chapter 5",
        desc: "Build a galvanic cell from different metals, test displacement reactions and watch electrolysis and electroplating.",
        status: "live",
        page: "electrochemistry.html",
      },
      {
        id: "metals",
        title: "Metals",
        tag: "Chapter 6",
        desc: "Concentrate ores, see how reactivity decides extraction and go inside a blast furnace.",
        status: "live",
        page: "metals.html",
      },
      {
        id: "industrial-compounds",
        title: "Compounds of Industrial Importance",
        tag: "Chapter 7",
        desc: "Push the ammonia equilibrium, see sulphuric acid dehydrate and test salts with sodium hydroxide.",
        status: "live",
        page: "industrial-compounds.html",
      },
    ],
    maths: [
            { id: "arithmetic", title: "Arithmetic Sequences", tag: "Chapter 1", desc: "Build a sequence, find any term, pairs, and the sum of n terms.", status: "live", page: "arithmetic.html" },
     { id: "circles", title: "Circles and Angles", tag: "Chapter 2", desc: "Drag points on a circle and discover the angle and chord rules.", status: "live", page: "circles.html" },
     // Add this inside topics.maths in js/data.js:
{
  id: "chance",
  title: "Mathematics of Chance",
  tag: "Chapter 3",
  desc: "Pick beads, draw cards, roll a die, throw dots at shapes and see probability as favourable over possible outcomes.",
  status: "live",
  page: "chance.html",
}, 
{
  id: "arithmetic-algebra",
  title: "Arithmetic Sequences and Algebra",
  tag: "Chapter 4",
  desc: "Find the rule of a sequence, find it from two terms, and add up the terms quickly.",
  status: "live",
  page: "arithmetic-algebra.html",
},
     {
        id: "second-degree-equations",
        title: "Second Degree Equations",
        tag: "Chapter 5",
        desc: "Watch a square get completed tile by tile and solve the equation.",
        status: "live",
        page: "seconddegree.html",
      },
      {
        id: "trigonometry",
        title: "Trigonometry",
        tag: "Chapter 6",
        desc: "Use the two special right triangles and sin, cos and tan to find the sides of a right triangle.",
        status: "live",
        page: "trigonometry.html",
      },

      {
        id: "coordinates",
        title: "Coordinates",
        tag: "Chapter 7",
        desc: "Mark points on the axes and learn distance, midpoint and ratio formulas.",
        status: "live",
        page: "coordinates.html"
      },
      {
  id: "tangents",
  title: "Tangents",
  tag: "Chapter 8",
  desc: "Drag points and see why a tangent meets the radius at 90°, why two tangents from a point are equal, and how PA × PB = PC².",
  status: "live",
  page: "tangents.html",
},
      {
        id: "polynomials",
        title: "Polynomials and Equations",
        tag: "Chapter 9",
        desc: "Type in a second degree equation and see its solutions and graph.",
        status: "live",
        page: "polynomials.html",
      },
      // Add this inside topics.maths in js/data.js:
{
  id: "circles-lines",
  title: "Circles and Lines",
  tag: "Chapter 10",
  desc: "Move a point and turn chords, secants and a tangent. See PA × PB = PC × PD and PT² = PA × PB stay true.",
  status: "live",
  page: "circles-lines.html",
},
{
  id: "geometry-algebra",
  title: "Geometry and Algebra",
  tag: "Chapter 11",
  desc: "Tap points on a grid to find midpoints, dividing points, slope, line and circle equations, and the fourth vertex of a parallelogram.",
  status: "live",
  page: "geometry-algebra.html",
},
      // Add this inside topics.maths in js/data.js:
{
  id: "solids",
  title: "Solids",
  tag: "Chapter 12",
  desc: "Turn pyramids, cones, spheres, hemispheres and cylinders in 3D. Light up each surface and see its area and volume change.",
  status: "live",
  page: "solids.html",
},
       {
        id: "statistics",
        title: "Statistics",
        tag: "Chapter 13",
        desc: "See why the mean can mislead, then find the median from a table.",
        status: "live",
        page: "statistics.html",
      },
    ],
       biology: [
  { id: "genetics", title: "Genetics of Life", tag: "Chapter 1", desc: "DNA, RNA, protein synthesis, Mendel's laws and sex determination.", status: "live", page: "genetics.html" },
  { id: "paths-of-evolution", title: "Paths of Evolution", tag: "Chapter 2", desc: "Theories of evolution, human evolution and the nervous system.", status: "live", page: "paths-of-evolution.html" },
  { id: "behind-sensations", title: "Behind Sensations", tag: "Chapter 3", desc: "Eye, ear, taste, smell and how the brain forms a sensation.", status: "live", page: "behind-sensations.html" },
  { id: "chemoreception", title: "Chemoreception in Organisms", tag: "Chapter 4", desc: "Plant and animal hormones, glands, glucose, calcium and pheromones.", status: "live", page: "chemoreception.html" },
  { id: "immunity-healthcare", title: "Immunity and Healthcare", tag: "Chapter 5", desc: "Defence of the body, vaccines, blood groups, diseases and medicines.", status: "live", page: "immunity-healthcare.html" },
  { id: "biology-technology", title: "Biology and Technology", tag: "Chapter 6", desc: "Genetic engineering, CRISPR, DNA fingerprinting, AI and the environment.", status: "live", page: "biology-technology.html" }
],
  },
};
