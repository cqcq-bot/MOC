# MOC / Minus One Coffee Design System

This document records the implemented visual system for the MOC homepage. It is adapted from the supplied reference at `C:\Users\CQCQ\Downloads\DESIGN.md`, while keeping Minus One Coffee's actual product model: small-batch drinks, an Instagram-first menu, and ordering through direct messages.

## Direction

MOC is a living menu poster rather than a generic cafe storefront. The page uses oversized type, a deep chocolate canvas, walnut content surfaces, copper actions, warm ivory type, dotted rules, and a code-native MOC drink scene. The first viewport must make the original MOC mark, Minus One Coffee name, current visual identity, and Instagram ordering path immediately recognizable.

## Color Tokens

| Token | Value | Use |
| --- | --- | --- |
| `--espresso-black` | `#160B07` | Main page canvas and hero backdrop |
| `--dark-cocoa` | `#2B140B` | Navigation, dark sections, and preview surface |
| `--walnut-brown` | `#4A2416` | Image frames, menu panels, and content layers |
| `--aged-copper` | `#A86542` | CTAs, active states, loading progress, and key accents |
| `--warm-ivory` | `#E8DDCC` | Primary headings and important text |
| `--muted-beige` | `#B9A18D` | Supporting copy, captions, and metadata |
| `--soft-olive` | `#7E8A61` | Matcha/drink labels and limited supporting decoration |
| `--coffee-line` | `#5A3625` | Borders and quiet dividers |
| `--deep-black` | `#0C0705` | Final CTA surface and high-contrast control text |

The palette stays intentionally warm and dark. No gradients, cool neutrals, box shadows, or decorative glow effects are used as the primary depth system. Depth comes from espresso-black, dark-cocoa, and walnut-brown surfaces with restrained aged-copper contrast.

## Typography

- `Anton` is the available display substitute for Salmond. It owns the poster-scale headlines, logo wordmark, navigation labels, menu names, and section titles.
- `DM Sans` is used for readable product and process copy.
- `DM Mono` is used for edition labels, metadata, captions, prices, and operational notes.
- Display headings use tight tracking and a compressed line height. Supporting copy stays compact and readable, with a maximum line height around `1.45`.

## Shape and Components

- Buttons, navigation links, filters, and social actions use full pill radii.
- Content panels and visual frames use a restrained `6px` radius.
- Sections are separated with dotted line-token rules rather than shadows or large decorative bands.
- The navigation is a compact floating pill with the MOC chip on the left, anchor links in the center, and the Instagram DM action on the right.
- The hero keeps the original MOC logo intro and the MOC-labelled 3D drink scene. The scene is raw on the canvas, not placed inside a product card.
- Menu filters and menu rows have explicit selected states. The 3D preview always follows the selected menu item.
- Familiar controls use Lucide icons, including Instagram, ArrowUpRight, ArrowDown, Plus, Sparkles, and Check.

## Page Structure

1. `discover`: MOC logo intro, oversized title, 3D drink scene, and DM CTA.
2. `intro`: small-batch positioning and product promise.
3. `menu`: category filters, menu rows, prices, and live 3D preview.
4. `signature`: three signature drink directions.
5. `founder`: honest home-kitchen story without inventing a founder identity or photography.
6. `kitchen`: small-batch process and practical operating notes.
7. `drop`: seasonal Strawberry Matcha feature.
8. `instagram`: visual cue for the Instagram-first ordering path.
9. `faq`: expandable ordering and menu questions.
10. `order`: final DM CTA.

## Motion and Accessibility

- The startup state is a full-screen MOC loading intro: the original person image appears first with a restrained position/opacity/scale-free soft rise, original M/O/C image layers enter in order, the aged-copper loading progress reaches 100%, and the layer fades away after hydration.
- Motion is otherwise limited to smooth anchor navigation, section reveals, small hover/press feedback, the 3D scene, and the existing intro treatment.
- Layout properties are not animated for hover feedback; menu row emphasis uses `transform` and color.
- `prefers-reduced-motion` removes the loading mark's large movement and keeps only short opacity transitions, leaving a readable static composition.
- All interactive controls are semantic buttons or links, have visible focus states, and retain usable touch targets on mobile.
- The 3D scene is additive: the MOC label and product meaning remain available in surrounding text if motion or WebGL is unavailable.

## Product Truth

- The site is a menu and ordering guide, not a checkout flow.
- Instagram is the current ordering path.
- Prices and some menu descriptions remain reference content and require owner confirmation before launch.
- Founder identity, real process media, approved Instagram posts, delivery details, and payment rules must not be presented as confirmed unless supplied by the owner.
