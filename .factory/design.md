# Touch Canvas Drills — visual thesis

## Direction: cassette-era zine

Touch Canvas Drills feels like a folded practice booklet found beside a stack of
well-used cassette tapes. It is deliberately tactile and a little imperfect:
cream paper, ink-black type, electric blue guide lines, and a hot coral action
color. The visual language makes short practice feel finite and physical rather
than like a desktop art editor.

### Tokens

| role | token | value |
| --- | --- | --- |
| paper background | `--paper` | `#f4eedc` |
| ink text | `--ink` | `#18212b` |
| muted ink | `--muted` | `#4d5660` |
| tape blue | `--blue` | `#075d8c` |
| coral record | `--coral` | `#bd3d35` |
| yellow cue | `--yellow` | `#e8b830` |
| dark surface | `--night` | `#16202b` |

The product is intentionally single-mode: a bright paper drill pad improves
line visibility outdoors and gives the canvas a fixed, familiar ground.

### Type, spacing, shape

The display face is a self-hosted system monospace stack (`ui-monospace`) for
cue labels and counts; the body is an unfussy system sans stack. This avoids a
font download and keeps labels sharp. Spacing uses an 8px scale. Rules, tape
tabs, offset shadows and square-ish 4px corners form the shape language.

### Interaction and motion

The current drill slides into the tape deck by 160ms transform/opacity. The
timer uses color and text, never a flashing effect. With reduced motion,
transitions stop and the active state changes instantly. Canvas ink always
follows the finger without smoothing animation.

### Art plan and provenance

One original hero illustration depicts a cassette case that becomes a drawing
practice board. It is decoration and has a descriptive alt. Prompt sheet:
editorial risograph illustration, weathered cream paper, ink black, electric
blue and coral, halftone grains, top-down studio scene, no people, no brands,
no text/no logos/no watermark. It was generated on 2026-08-28 with the factory
`factory-image` deployment, inspected, converted to WebP, and stored locally.
The generated artwork is original to this product and ships under this
repository's MIT license. Its exact prompt and generation settings are recorded
beside the source asset.
