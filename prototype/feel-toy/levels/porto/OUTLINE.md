# Porto Alto: the original outline

The brief this map started from (as pasted). The districts, gates and heights in base.js are the version we built; this is the mood and the spot list to draw from.

A natural layout that creates massive vertical variety—without feeling like an artificial skatepark—is a coastal, tiered city layout (think San Francisco mixed with Barcelona). Gravity acts as the natural guide: you spawn up high, carve down through natural street terrain, hit iconic landmarks, and finish at high-speed drainage or waterfront ditches.
Here is a map layout designed specifically for street tricks, grinds, and continuous flow.
Macro Map Layout: "Porto Alto"
[ Tier 3: The Heights / Observatory ]  (Highest Peak: Long rails, hill bombs, switchbacks)
                 ↓
[ Tier 2: University & Financial District ] (Plazas, marble ledges, stair sets, "The Shark"-style monument)
        ↙                                 ↘
[ Industrial Ditch / Spillway ]     [ Old Town & Residential ] (Tight alleyways, curbs, gap hops)
        ↘                                 ↙
[ Tier 1: Harbor / Boardwalk & The Bowl Complex ] (Flatground, pier ledges, container gaps)

The 4 Major Zones & Skate Spots
1. Upper Tier: Ridgeview & The Radio Tower (The Hill Bomb Zone)
 * The Vibe: Winding asphalt roads, steep pavement, scenic lookouts, and modern luxury homes.
 * Key Street Spots:
   * Switchback Overlook: Triple-curved descent lined with continuous yellow painted curbs and kinked metal guardrails perfect for 100-meter grinds.
   * The Drainage Culvert: A steep concrete runoff cutting straight down the hillside, bypassing the road curves. Dropping in builds top speed to clear a gap over a lower access road.
 * The Hidden Park — "The Water Tank": An abandoned municipal reservoir drained dry. The rounded brick foundation acts as a massive wallride/curved ledge arena.
2. Mid Tier (East): Metro Plaza & Financial Core (Technical Street)
 * The Vibe: Modern urban glass and polished granite. Pristine architecture that looks intended for corporate business, but is secretly a street skater’s paradise.
 * Key Street Spots:
   * The City Hall Hubba & 12-Set: A massive set of stairs flanked by wide, descending concrete hubbas and a center handrail with a flat-out kink at the bottom.
   * Bank to Planter Alley: A series of angled brick flower planters you can ollie up, grind across, and drop down into banking wall transitions.
 * The Monument Spot — "The Golden Nautilus":
   * The Concept (Your "Shark" equivalent): A giant, spiraling polished-metal sea shell sculpture situated right in the central plaza.
   * The Line: A wide fountain spillway provides a run-up ramp directly into the mouth of the shell. You can clear the shell gap into a smooth marble bank, or lock into a 50-50 on the spiral outer rim all the way around.
3. Mid Tier (West): The Concrete Arroyo (The High-Speed Ditch)
 * The Vibe: A brutalist concrete storm basin cutting between the downtown core and the industrial train yards.
 * Key Street Spots:
   * The Canal Spillway: Steep, angled concrete banks running for half a mile. Skaters can carve up the angled walls, pop flip tricks off sewer grates, and grind maintenance catwalk rails.
   * The Pipe Crossing Gap: A pair of massive utility pipes cross the canal overhead. Coming in hot down the spillway gives enough speed to hit an angled storm door ramp and clear the water canal below, flying directly over or onto the pipes.
 * The Hidden Park — "The D.I.Y. Underpass": Tucked under the central highway bridge inside the dry section of the ditch. Makeshift cinderblock ledges, slappy curbs, plywood ramps, and metal parking barriers bolted into the flat concrete.
4. Lower Tier: The Shipping Yards & Boardwalk
 * The Vibe: Ocean-level docks, cargo shipping crates, and wooden boardwalk piers.
 * Key Street Spots:
   * Loading Bay Ledges: Semi-truck loading docks set at varying heights, offering flat-to-drop drop lines, manual pads, and gap-to-grind opportunities.
   * Boardwalk Slappy Strip: A long run of low wooden curbs and metal mooring bollards that invite creative trick-chaining without requiring massive air.
 * The Hidden Park — "The Drydock": An old boat-repair drydock made of rough sea-weathered concrete. Features natural stepped platforms, massive transitions along the perimeter walls, and mooring chains you can hop over or grind.
Level Design Principles for Flip Tricks & Grinds
 * Elevation Over Flat: Mobile controls feel sluggish when pushing across flat plains. Keep the map sloping downward toward the coast at a subtle 3–5° angle across streets so players maintain rolling momentum naturally.
 * Double-Sided Curb Geometry: Avoid building standard 90° sidewalks. Chamfer curbs and add slight lips so players can pop on and off easily at phone-screen angles without snapping or getting stuck on edge collisions.
 * Natural Sightline Framing: At the top of every major hill or drop, use background landmarks (like the Nautilus sculpture or the Harbor cranes) as visual breadcrumbs so the player instinctively knows which way downhill leads to high-speed features.
Immediate Implementation Checklist
 * Graybox the Spine: Block out a continuous descent path from Ridgeview to the Harbor using simple primitive cubes and wedges to dial in downhill speed before modeling assets.
 * Tune Spline Snapping: Ensure grind detection for flip-to-grind lines has a slightly forgiving radius (e.g., sticky angle window) suited for virtual stick inputs on touchscreens.
 * Place the "Nautilus" Landmark: Position the central monument early to serve as the map's visual anchor and test your high-speed approach angles.
