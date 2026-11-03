# Photography sources

The site uses the actual business photographs supplied by the user. The latest set in `reference-assets/new_assets/` replaces the earlier screenshot crops wherever a corresponding photograph is available. There are no stock or generated cake photographs.

Original profile: https://www.instagram.com/cream_on_top_by_neha_gupta/

All 14 new source JPEGs remain intact. `scripts/prepare-images.py` reproduces 27 optimized WebP outputs from them. Processing is limited to EXIF orientation, documented crops, optional downscaling and WebP encoding at quality 88. Cake colours, decorations and appearances have not been altered. No source has been enlarged artificially. The prepared assets total approximately 2.6 MB, including alternate and duplicate variants.

Replacement photographs have descriptive new filenames, such as `hero/hero-princess.webp`, `founder/neha-portrait.webp` and `cakes/golden-crown.webp`. This gives the Next.js optimizer and returning browsers a new image URL instead of reusing a cached version of an earlier screenshot crop. Existing unused legacy asset files are retained for compatibility; the live page references the new filenames.

## New photographs

All filenames in this table start with `WhatsApp Image 2026-11-03 at `. Paths are relative to `public/images/`. The preparation script records exact pixel crop coordinates for every detail variant.

| Source filename suffix | Prepared asset(s) | Subject / placement |
|---|---|---|
| `12.53.34 AM (1).jpeg` | `founder/studio-collection.webp` | Neha with a collection of bespoke birthday cakes; alternate studio photograph |
| `12.53.34 AM (2).jpeg` | `founder/fairy-studio.webp` | Neha with a floral fairy cake and translucent wings; Instagram header and caption cropped out |
| `12.53.34 AM.jpeg` | `founder/eight-year-milestone.webp`, `cakes/eighth-anniversary.webp`, `hero/milestone-cake-detail.webp` | Actual historical eight-year brand milestone and pink crown / heart / bow cake; gallery and anniversary collection |
| `12.53.35 AM (1).jpeg` | `cakes/princess-castle.webp` | Pink and ivory princess castle with turrets; Kids collection, gallery and Instagram |
| `12.53.35 AM (2).jpeg` | `cakes/chocolate-celebration.webp`, `cakes/chocolate-squares.webp` | Chocolate-topped celebration squares with biscuit and strawberry decorations; gallery and Instagram |
| `12.53.35 AM.jpeg` | `cakes/badminton-celebration.webp` | Personalised badminton cake and matching blue racket cupcakes; Custom collection, gallery and Instagram |
| `12.53.36 AM (1).jpeg` | `hero/hero-princess.webp`, `cakes/floral-princess.webp` | Pastel princess figure with a fondant skirt and pink / ivory flowers; 1080 × 1294 hero photograph and Instagram |
| `12.53.36 AM.jpeg` | `cakes/rosette-heart.webp` | Heart-shaped birthday cake with pink buttercream petals and pearls; Birthday collection, gallery, Instagram and final CTA |
| `12.53.37 AM (1).jpeg` | `cakes/floral-celebration.webp` | Neha finishing a teddy-bear cake above floral, tiger and car-themed cakes; alternate studio photograph |
| `12.53.37 AM (2).jpeg` | `kids/jungle-celebration.webp`, `kids/jungle-tiers.webp` | Neha with a three-tier jungle animal celebration cake; close crop used in gallery |
| `12.53.37 AM.jpeg` | `cakes/studio-selection.webp` | Collection of pastel celebration cakes with different themes; alternate studio photograph |
| `12.53.38 AM (1).jpeg` | `founder/neha-portrait.webp`, `founder/neha-portrait-alt.webp` | Actual clean portrait of Neha in red holding a strawberry cake; 812 × 832 founder photograph |
| `12.53.38 AM (2).jpeg` | `founder/studio-celebrations.webp`, `hero/studio-celebrations.webp`, `cakes/golden-crown.webp`, `cakes/barbie-dress.webp`, `cakes/film-fiftieth.webp`, `cakes/construction-truck.webp`, `cakes/dinosaur-party.webp`, `cakes/racing-car.webp` | Original 1080 × 1300 cake collection photograph; introduction section and sharper crops of the gold crown, Barbie, film-themed, construction, dinosaur and racing cakes |
| `12.53.38 AM.jpeg` | `founder/celebration-studio.webp` | Neha with an extensive collection of custom celebration cakes; alternate studio photograph |

The sports design is identified as badminton because its decorations include shuttlecocks. Gallery captions describe visible designs rather than making unverified ingredient or flavour claims.

## Retained wedding photographs

The new set has no clean originals of the wedding designs already shown. These two genuine business photographs therefore remain cropped from the earlier supplied screenshots. A child's birthday design has not been relabelled as a wedding cake.

| Web asset | Original screenshot in `reference-assets/` | Crop coordinates | Subject |
|---|---|---|---|
| `weddings/wedding.webp` | `WhatsApp Image 2026-11-02 at 1.40.29 PM (1).jpeg` | 1,352,175,624 | White multi-tier cake with glittering gold tiers |
| `cakes/floral.webp` | `WhatsApp Image 2026-11-02 at 1.40.29 PM.jpeg` | 320,1310,478,1555 | White tiered cake with ivory ruffles and burgundy flowers |

These remaining wedding crops are only 174 × 272 and 158 × 245 pixels. Obtain the original photographs before launch for sharper full-screen presentation. The retained, unused `cakes/cupcake-bouquet.webp` is an earlier 196 × 317 crop of the floral cupcake bouquet in `WhatsApp Image 2026-11-02 at 1.40.29 PM.jpeg`, coordinates 242,613,438,930.

The pink heart/crown cake represents a historical eight-year milestone; it does not establish the current founding anniversary. The three supplied testimonial screenshots visibly include five-star graphics, supporting the site's five-star presentation of those reviews.
