# Image sources

The cake photography and atelier scene currently displayed in the website were created with the built-in `image_gen` tool on 3 November 2026 at the user's request. They are illustrative AI-generated design inspiration, rather than photographs of cakes made or sold by Cream on Top. The hero, collection introduction, gallery, lightbox, and social section identify this distinction. Captions and alt text describe the generated designs without claiming actual customer orders.

## Generated assets

Web-ready files are in `public/images/generated/`. Full-resolution originals are retained in `output/imagegen/`, along with the exact generation prompts and original tool output paths. Generation used one separate request per asset. There are twelve cake designs and one atelier scene; all cake originals are 1024 × 1536 pixels, and the atelier is 1254 × 1254 pixels. WebP conversion preserves those dimensions and uses quality 90–92 without upscaling.

| Filename | Subject | Placement |
| --- | --- | --- |
| `hero-bow.webp` | Ivory and blush two-tier cake with roses, pearl piping and a cascading bow | Hero, anniversary collection and gallery, sharing metadata |
| `golden-birthday.webp` | Ivory cake with a petite gold crown | Birthday gallery |
| `pearl-wedding.webp` | Three-tier ivory cake with pearls and restrained gold leaf | Wedding collection and gallery |
| `floral-wedding.webp` | Ivory tiers with blush sugar roses | Wedding gallery and social inspiration |
| `jungle-party.webp` | Sage and ivory cake with fondant jungle animals | Kids gallery and social inspiration |
| `couture-dress.webp` | Sculpted blush dress cake with fondant ruffles | Designer collection and gallery |
| `midnight-celebration.webp` | Chocolate cake with gold arcs and shards | Custom gallery |
| `construction-party.webp` | Two-tier cream and yellow cake with an edible excavator | Birthday gallery |
| `princess-castle.webp` | Ivory and blush castle with refined turrets | Kids collection, gallery and social inspiration |
| `badminton-party.webp` | Ivory and sage badminton cake with matching cupcakes | Custom collection and gallery |
| `chocolate-tasting.webp` | Nine chocolate pastries with ganache, raspberries, curls and gold leaf | Custom gallery and social inspiration |
| `rosette-heart.webp` | Pink heart cake covered in buttercream rosettes | Birthday collection, gallery, social inspiration and final call to action |
| `atelier-table.webp` | Ivory cake, sugar roses and decorating tools on a limestone table | Brand introduction; illustrative atelier, not the bakery's actual premises |

Exact prompt manifests:

- [Editorial images](output/imagegen/editorial-prompts.json)
- [Classic cakes](output/imagegen/classic-prompts.json)
- [Themed cakes](output/imagegen/themed-prompts.json)

The complete generated set is previewed in [generated-collection.jpg](output/imagegen/generated-collection.jpg).

The hero uses `hero-cover.webp`, an identical copy of `hero-bow.webp` with a dedicated URL. It loads eagerly at high priority, independently of the lazy-loaded gallery and collection copies.

## Real founder portrait

Neha's founder portrait remains the actual user-supplied photograph, exported as `public/images/founder/neha-portrait.webp` from `reference-assets/new_assets/WhatsApp Image 2026-11-03 at 12.53.38 AM (1).jpeg`, at 812 × 832 pixels. Her identity has not been generated or replaced. The historical eight-year milestone and supplied customer reviews remain based on the original brief and reference screenshots; generated cake images do not establish those facts.

## Original references

All user-supplied photos remain intact in `reference-assets/`. Earlier crop coordinates, filenames and image preparation details are retained in [ASSET_SOURCES_ORIGINALS.md](ASSET_SOURCES_ORIGINALS.md). The old preparation script reproduces those earlier photographs; it does not recreate the generated images. To revise a generated design, use the saved prompt with the image generation tool.
