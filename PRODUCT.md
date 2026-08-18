# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

People discovering Minus One Coffee through Instagram, usually on a phone, who want to scan the current menu, understand the small-batch offering, and decide whether to start an order.

## Product Purpose

Minus One Coffee is a home-based coffee bar for small-batch coffee, matcha, and chocolate drinks. The website should make the menu easy to browse, communicate the care behind each batch, and move a visitor into an Instagram DM without pretending to be a storefront or checkout system.

## Positioning

The product is intentionally Instagram-first and made at home: new batches and limited flavours are shared through the social channel, while the site acts as a clear, expressive menu and ordering guide.

## Operating Context

Visitors scan quickly between social posts, often on mobile. They need recognizable menu categories, clear prices labelled as reference when not final, practical ordering answers, and a direct path to the Instagram account.

## Capabilities and Constraints

- Next.js 14 app using React, Three.js, React Three Fiber, GSAP, and Lenis.
- Existing interactions include menu category filtering, menu item selection with a live 3D drink preview, FAQ expansion, smooth anchor navigation, and Instagram links.
- The Instagram URL is the current ordering path; there is no native cart, payment, pickup scheduler, or storefront address.
- Current menu prices and some drink descriptions come from a planning reference and need owner confirmation before launch.
- Founder identity, real process media, approved Instagram posts, and final ordering policy are not confirmed and must not be fabricated.
- Preserve the existing MOC logo intro / branded 3D opening experience while replacing the incumbent visual system around it.

## Brand Commitments

- Keep the MOC logo intro recognizable and visually primary at the opening of the site.
- Use the Dark Cocoa Editorial Coffee system for the redesign: espresso-black canvas, dark-cocoa and walnut-brown surfaces, aged-copper accents, warm-ivory type, restrained soft-olive drink details, poster-scale display type, pill controls, flat color-step depth, and dotted dividers.
- Keep the name Minus One Coffee and the Instagram-first ordering model visible and truthful.

## Evidence on Hand

- `app/` contains the current homepage and section composition.
- `components/three/MasterCupScene.tsx` contains the existing code-native MOC-labelled 3D drink scene.
- `lib/content/minus-one.ts` contains menu reference data, FAQ copy, Instagram URL, and explicit placeholder notes.
- `minus-one-coffee-landing-page-design-spec.pdf` is present in the project.
- `C:\Users\CQCQ\Downloads\DESIGN.md` is an external visual reference supplied for this redesign.

## Product Principles

- Make the menu and next action obvious within seconds.
- Treat small-batch making as the product experience, not filler copy.
- Keep every unconfirmed operational fact visibly honest.
- Let MOC feel handmade, expressive, and memorable without obscuring ordering information.

## Accessibility & Inclusion

Use semantic landmarks, one clear heading hierarchy, visible keyboard focus, labelled icon controls, usable touch targets, readable contrast, reduced-motion support, and non-motion fallbacks for the 3D intro and animated reveals.
