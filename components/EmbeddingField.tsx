"use client";

import { useEffect, useRef } from "react";

/**
 * The page's signature element: a live 2D projection of an "embedding space."
 * Points drift slowly and draw faint edges to their nearest neighbors — the
 * same nearest-neighbor retrieval that sits at the heart of a RAG system.
 * One roaming "query" point lights up the neighbors it currently retrieves.
 *
 * Rendered honestly (actual distance-based kNN), not as decorative confetti.
 * Respects prefers-reduced-motion by drawing a single static frame.
 */
export default function EmbeddingField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const AMBER = "232, 130, 60";
    const BONE = "154, 163, 156";

    let width = 0;
    let height = 0;
    let dpr = 1;

    type Node = { x: number; y: number; vx: number; vy: number; r: number };
    let nodes: Node[] = [];
    let query = { x: 0, y: 0, vx: 0, vy: 0 };

    const seed = () => {
      // Density scales with area but stays modest for performance.
      const count = Math.min(90, Math.max(38, Math.floor((width * height) / 22000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.3 + 0.7,
      }));
      query = {
        x: width * 0.5,
        y: height * 0.5,
        vx: 0.35,
        vy: 0.28,
      };
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const NEIGH_DIST = 132; // max edge length between drifting nodes
    const QUERY_K = 6; // how many neighbors the query retrieves

    const step = () => {
      ctx.clearRect(0, 0, width, height);

      // Move nodes; wrap softly at the edges.
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = width + 20;
        if (n.x > width + 20) n.x = -20;
        if (n.y < -20) n.y = height + 20;
        if (n.y > height + 20) n.y = -20;
      }

      // Ambient edges between near neighbors (the "space" structure).
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.hypot(dx, dy);
          if (d < NEIGH_DIST) {
            const a = (1 - d / NEIGH_DIST) * 0.16;
            ctx.strokeStyle = `rgba(${BONE}, ${a})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Move the query point; bounce inside the frame.
      query.x += query.vx;
      query.y += query.vy;
      if (query.x < 40 || query.x > width - 40) query.vx *= -1;
      if (query.y < 40 || query.y > height - 40) query.vy *= -1;

      // Retrieve: the k nearest nodes to the query.
      const ranked = nodes
        .map((n) => ({ n, d: Math.hypot(n.x - query.x, n.y - query.y) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, QUERY_K);

      for (const { n, d } of ranked) {
        const a = Math.max(0.12, 1 - d / 260);
        ctx.strokeStyle = `rgba(${AMBER}, ${a})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(query.x, query.y);
        ctx.lineTo(n.x, n.y);
        ctx.stroke();

        // Highlight the retrieved node.
        ctx.fillStyle = `rgba(${AMBER}, 0.9)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + 1.1, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw all nodes.
      for (const n of nodes) {
        ctx.fillStyle = `rgba(${BONE}, 0.5)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw the query point with a soft halo.
      const grad = ctx.createRadialGradient(
        query.x,
        query.y,
        0,
        query.x,
        query.y,
        26
      );
      grad.addColorStop(0, `rgba(${AMBER}, 0.35)`);
      grad.addColorStop(1, `rgba(${AMBER}, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(query.x, query.y, 26, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(${AMBER}, 1)`;
      ctx.beginPath();
      ctx.arc(query.x, query.y, 3.2, 0, Math.PI * 2);
      ctx.fill();
    };

    let raf = 0;
    const loop = () => {
      step();
      raf = requestAnimationFrame(loop);
    };

    resize();

    if (prefersReduced) {
      step(); // one static frame, no animation loop
    } else {
      loop();
    }

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
