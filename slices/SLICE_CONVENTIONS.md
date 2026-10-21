# Prismic Slice Conventions

## Use variations for similar section types

**Do not create separate slice files for similar section types.** Use a single slice with multiple **variations** instead.

### Examples in this project

| Slice | Variations | Use case |
|-------|------------|----------|
| **hero_section** | `default`, `secondary`, `form` | Main hero vs page heading vs hero with checklist + form (e.g. Team) |
| **cta_section** | `default`, `form`, `form2` | Buttons CTA vs form CTA vs form with background image |
| **features_section** | `default`, `image` | Icon list vs image cards with number/title/details |
| **testimonial_section** | `default`, `video`, `slider` | Text testimonials vs video-style vs slider (avatar, quote, rating) |
| **team_section** | `default`, `details` | Teams grid (cards) vs single member detail (profile, bio, accordion) |
| **services_section** | `default`, `conditions` | Hand-picked service cards vs hand-picked condition cards (same heading + linked list, different link type) |

### For new sections

- If a new section is **similar** to an existing one (same purpose, different layout or subset of fields), add a **variation** to the existing slice.
- Only create a **new slice file** when the section is conceptually different (e.g. FAQ, Gallery, Services).

### Naming

- Repeatable group in slice `primary`: use the common name **`items`**.
- Variation `id`: lowercase, e.g. `default`, `secondary`, `form`, `image`, `video`.

## Page custom types

Slice zones per page (use only the slices needed for that page):

- **home_page** – hero, about, cta, features, process, testimonial, faq, gallery, location, services, blogs
- **about_page** – hero, about, testimonial, features, cta
- **services_page** – hero, services
- **team_page** – hero (use form variation), team
- **testimonials_page** – hero, testimonial
- **blog_page** – hero, blogs
- **contact_page** – hero, contact
- **gallery_page** – hero, gallery
- **conditions_page** – hero, services (`conditions` variation), grid cards built from the tree
- **condition_page** – any slice, services (`conditions` variation) for hand-picked links
