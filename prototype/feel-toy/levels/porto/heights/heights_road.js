/* The Heights: Quarry Lane, the demo of P.road (base.js), on the empty hillside east of the observatory (x 320..480,
   z -470..-260): along the slope, a hairpin down, a sweeper west, an S-bend and a last straight drop. Laid first, before
   anything reads K.terrainH, so the ground everything else stands on already has the road in it. */
function heights_road(K, P) {
  return P.road({ name: 'Quarry Lane', hw: 4, sw: 2.5, blend: 14,
    pts: [[330, -466], [462, -456, 18], [462, -410, 18], [345, -385, 24], [345, -345, 30], [405, -315, 30], [405, -266]] });
}
