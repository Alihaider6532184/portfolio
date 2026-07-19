import { ImageResponse } from "next/og";
import { displayFontBase64 } from "./og-font";

// Social share card, generated dynamically so it always matches the site.
// Carries the page's signature: a static frame of the embedding-space field
// (nodes + nearest-neighbor edges) behind the name and role.
//
// Runs on the edge runtime — the font is inlined as base64 (see og-font.ts)
// so there is no filesystem or network dependency at build or request time.

export const runtime = "edge";
export const alt = "Ali Haider — AI & Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Palette (kept in sync with tailwind.config.ts).
const INK = "#0B100E";
const BONE = "#ECE7DB";
const BONE_DIM = "#9AA39C";
const AMBER = "#E8823C";

// Decode the inlined font once at module load.
function base64ToArrayBuffer(b64: string) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}
const displayFont = base64ToArrayBuffer(displayFontBase64);

// Small deterministic PRNG so the field is identical on every render.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Encode a UTF-8 string to base64 on the edge (no Node Buffer available).
function utf8ToBase64(str: string) {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

// Build the embedding field as an SVG data URI used as a full-bleed background.
function buildFieldDataUri(w: number, h: number) {
  const rand = mulberry32(20260719);
  const N = 46;
  const nodes = Array.from({ length: N }, () => ({
    x: rand() * w,
    y: rand() * h,
    r: rand() * 2 + 1.4,
  }));

  const NEIGH = 200;
  let edges = "";
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const d = Math.hypot(dx, dy);
      if (d < NEIGH) {
        const o = (1 - d / NEIGH) * 0.16;
        edges += `<line x1="${nodes[i].x.toFixed(1)}" y1="${nodes[i].y.toFixed(
          1
        )}" x2="${nodes[j].x.toFixed(1)}" y2="${nodes[j].y.toFixed(
          1
        )}" stroke="rgba(154,163,156,${o.toFixed(3)})" stroke-width="1"/>`;
      }
    }
  }

  // A query point that "retrieves" its 6 nearest neighbors in amber.
  const q = { x: w * 0.7, y: h * 0.44 };
  const ranked = nodes
    .map((n) => ({ n, d: Math.hypot(n.x - q.x, n.y - q.y) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 6);

  let amberEdges = "";
  let amberNodes = "";
  for (const { n, d } of ranked) {
    const o = Math.max(0.25, 1 - d / 380);
    amberEdges += `<line x1="${q.x}" y1="${q.y}" x2="${n.x.toFixed(
      1
    )}" y2="${n.y.toFixed(1)}" stroke="${AMBER}" stroke-opacity="${o.toFixed(
      2
    )}" stroke-width="1.4"/>`;
    amberNodes += `<circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(
      1
    )}" r="${(n.r + 1.4).toFixed(1)}" fill="${AMBER}"/>`;
  }

  const baseNodes = nodes
    .map(
      (n) =>
        `<circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${n.r.toFixed(
          1
        )}" fill="rgba(154,163,156,0.5)"/>`
    )
    .join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <rect width="${w}" height="${h}" fill="${INK}"/>
    ${edges}
    ${amberEdges}
    ${baseNodes}
    ${amberNodes}
    <circle cx="${q.x}" cy="${q.y}" r="30" fill="${AMBER}" fill-opacity="0.18"/>
    <circle cx="${q.x}" cy="${q.y}" r="4.5" fill="${AMBER}"/>
  </svg>`;

  return `data:image/svg+xml;base64,${utf8ToBase64(svg)}`;
}

export default async function Image() {
  const field = buildFieldDataUri(size.width, size.height);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: INK,
          position: "relative",
          fontFamily: "Display",
        }}
      >
        {/* Embedding-field background */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={field}
          width={size.width}
          height={size.height}
          style={{ position: "absolute", top: 0, left: 0 }}
          alt=""
        />
        {/* Left-to-right ink gradient for text legibility */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "linear-gradient(90deg, rgba(11,16,14,0.92) 30%, rgba(11,16,14,0.35) 70%, rgba(11,16,14,0.85) 100%)",
          }}
        />

        {/* Top bar: identity + status */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "56px 64px 0",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                backgroundColor: AMBER,
              }}
            />
            <div style={{ color: BONE, fontSize: 24, letterSpacing: 1 }}>
              ali_haider
            </div>
          </div>
          <div
            style={{
              color: BONE_DIM,
              fontSize: 20,
              textTransform: "uppercase",
              letterSpacing: 4,
            }}
          >
            Portfolio
          </div>
        </div>

        {/* Main block: name + role + value */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "0 64px",
            position: "relative",
          }}
        >
          <div
            style={{
              color: AMBER,
              fontSize: 24,
              textTransform: "uppercase",
              letterSpacing: 6,
              marginBottom: 18,
            }}
          >
            AI &amp; Full-Stack Developer
          </div>
          <div
            style={{
              fontFamily: "Display",
              color: BONE,
              fontSize: 132,
              lineHeight: 1,
              letterSpacing: -4,
            }}
          >
            Ali Haider
          </div>
          <div
            style={{
              color: BONE_DIM,
              fontSize: 28,
              marginTop: 26,
              maxWidth: 720,
              lineHeight: 1.35,
            }}
          >
            RAG systems, AI agents, and the full-stack products they live inside.
          </div>
        </div>

        {/* Bottom bar: field legend */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "0 64px 52px",
            position: "relative",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              backgroundColor: AMBER,
            }}
          />
          <div
            style={{
              color: BONE_DIM,
              fontSize: 18,
              textTransform: "uppercase",
              letterSpacing: 3,
            }}
          >
            nearest-neighbor retrieval · live
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Display", data: displayFont, weight: 800, style: "normal" },
      ],
    }
  );
}
