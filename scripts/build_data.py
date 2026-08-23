#!/usr/bin/env python3
"""Build /data/repos.json from GitHub and render radar visualisations.

Pipeline:
  gh repo list <owner> --json ...  ->  per-repo scoring against axes.json
                                     ->  repos.json
                                     ->  radar.png        (matplotlib, static)
                                     ->  radar-by-lang.png (matplotlib, static)
                                     ->  radar-animated.svg (self-animating,
                                       no JS — embeds directly in a README
                                       like Platane/snk does)

The script is idempotent: running it twice with the same GitHub state
produces the same files. It is intentionally dependency-light:
- matplotlib only for the static fallback PNG
- everything else is stdlib
"""
from __future__ import annotations

import json
import math
import os
import re
import subprocess
import sys
from collections import Counter
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np


ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
AXES_FILE = DATA_DIR / "axes.json"
CONFIG_FILE = DATA_DIR / "config.json"
REPOS_FILE = DATA_DIR / "repos.json"
RADAR_PNG = DATA_DIR / "radar.png"
LANGS_PNG = DATA_DIR / "radar-by-lang.png"
RADAR_SVG = DATA_DIR / "radar-animated.svg"


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def gh_list_repos(owner: str) -> list[dict]:
    """List public repos for `owner` via gh CLI."""
    cmd = [
        "gh", "repo", "list", owner,
        "--limit", "200",
        "--visibility", "public",
        "--json",
        "name,description,primaryLanguage,languages,repositoryTopics,"
        "stargazerCount,pushedAt,updatedAt,url,isArchived,isFork,diskUsage",
    ]
    proc = subprocess.run(cmd, check=True, capture_output=True, text=True)
    return json.loads(proc.stdout)


def variants(text: str) -> set[str]:
    """Return all variants of a string for keyword matching.

    A topic like "machine-learning" contributes both the hyphenated form
    AND its split parts {"machine-learning", "machine", "learning"}, so a
    keyword written either way matches.
    """
    if not text:
        return set()
    out: set[str] = set()
    for piece in re.split(r"[^a-z0-9-]+", text.lower()):
        if not piece:
            continue
        out.add(piece)
        for token in re.split(r"[^a-z0-9]+", piece):
            if token:
                out.add(token)
    return out


def axis_variants(axis: dict) -> set[str]:
    out: set[str] = set()
    for kw in axis["keywords"]:
        out.update(variants(kw))
    return out


def score_repo(repo: dict, axes: list[dict], weights: dict) -> dict[str, float]:
    """Return per-axis 0..10 score for one repo."""
    signals = {
        "topic": Counter(),
        "description": Counter(),
        "name": Counter(),
    }
    for topic in repo.get("repositoryTopics") or []:
        for v in variants(topic.get("name", "")):
            signals["topic"][v] += 1
    for v in variants(repo.get("description") or ""):
        signals["description"][v] += 1
    for v in variants(repo.get("name", "")):
        signals["name"][v] += 1

    score_max = float(weights.get("score_max", 10))
    per_axis_cap = (
        weights["topic"] + weights["description"] + weights["name"]
    ) * 3  # generous cap; final clamp keeps us in 0..score_max
    scores: dict[str, float] = {}
    for axis in axes:
        kw_vars = axis_variants(axis)
        total = 0
        for kind, counter in signals.items():
            for var, count in counter.items():
                if var in kw_vars:
                    total += weights[kind] * count
        normalized = min(1.0, total / per_axis_cap) if per_axis_cap else 0.0
        scores[axis["id"]] = round(normalized * score_max, 2)
    return scores


def build_repos_data(
    repos: list[dict], axes: list[dict], config: dict
) -> list[dict]:
    weights = config["weights"]
    excluded = set(config.get("exclude_repos") or [])
    out = []
    for r in repos:
        if r["name"] in excluded:
            continue
        scores = score_repo(r, axes, weights)
        out.append({
            "name": r["name"],
            "url": r["url"],
            "description": r.get("description") or "",
            "language": (r.get("primaryLanguage") or {}).get("name"),
            "languages": [
                {"name": l.get("name"), "size": l.get("size", 0)}
                for l in (r.get("languages") or {}).get("edges", [])
            ] if isinstance(r.get("languages"), dict) else [],
            "topics": [t.get("name") for t in (r.get("repositoryTopics") or [])],
            "stars": r.get("stargazerCount", 0),
            "pushedAt": r.get("pushedAt"),
            "isArchived": r.get("isArchived", False),
            "scores": scores,
        })
    out.sort(key=lambda x: (-sum(x["scores"].values()), x["name"].lower()))
    return out


# ----------------------------------------------------------------------------
# matplotlib statics
# ----------------------------------------------------------------------------

def render_static_radar(
    repos: list[dict], axes: list[dict], out_path: Path
) -> None:
    """Render a static radar PNG (per-repo backdrop + per-language polygons)."""
    n_axes = len(axes)
    angles = np.linspace(0, 2 * np.pi, n_axes, endpoint=False).tolist()
    angles += angles[:1]

    fig = plt.figure(figsize=(10, 10), facecolor="#0d1117")
    ax = fig.add_subplot(111, projection="polar")
    ax.set_facecolor("#0d1117")
    ax.set_theta_offset(np.pi / 2)
    ax.set_theta_direction(-1)

    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(
        [a["label"] for a in axes],
        color="#c9d1d9",
        fontsize=11,
    )
    ax.set_ylim(0, 10)
    ax.set_yticks([2, 4, 6, 8, 10])
    ax.set_yticklabels(["2", "4", "6", "8", "10"], color="#6e7681", fontsize=8)
    ax.spines["polar"].set_color("#30363d")
    ax.grid(color="#21262d", linewidth=0.8)

    if not repos:
        ax.set_title("No repos yet", color="#c9d1d9", pad=24)
        fig.tight_layout()
        fig.savefig(out_path, dpi=160, facecolor=fig.get_facecolor())
        plt.close(fig)
        return

    for repo in repos:
        vals = [repo["scores"][a["id"]] for a in axes]
        vals += vals[:1]
        ax.plot(angles, vals, color="#58a6ff", linewidth=0.6, alpha=0.18)
        ax.fill(angles, vals, color="#58a6ff", alpha=0.04)

    by_lang: dict[str, list[dict]] = {}
    for r in repos:
        lang = r.get("language") or "Other"
        by_lang.setdefault(lang, []).append(r)

    lang_palette = [
        "#7c3aed", "#f59e0b", "#06b6d4", "#10b981",
        "#3b82f6", "#ef4444", "#ec4899", "#f97316",
    ]
    sorted_langs = sorted(by_lang.items(), key=lambda kv: -len(kv[1]))
    for (lang, group), color in zip(sorted_langs, lang_palette):
        if len(group) < 2:
            continue
        avg = {
            a["id"]: round(
                sum(r["scores"][a["id"]] for r in group) / len(group), 2
            )
            for a in axes
        }
        vals = [avg[a["id"]] for a in axes]
        vals += vals[:1]
        ax.plot(angles, vals, color=color, linewidth=2.4, label=f"{lang} (n={len(group)})")
        ax.fill(angles, vals, color=color, alpha=0.12)

    ax.set_title(
        f"sachncs · {len(repos)} repos · capability radar",
        color="#f0f6fc",
        fontsize=15,
        pad=28,
    )
    ax.legend(
        loc="upper right",
        bbox_to_anchor=(1.32, 1.10),
        labelcolor="#c9d1d9",
        fontsize=9,
        frameon=False,
    )
    fig.tight_layout()
    fig.savefig(out_path, dpi=160, facecolor=fig.get_facecolor(), bbox_inches="tight")
    plt.close(fig)


def render_lang_radar(
    repos: list[dict], axes: list[dict], out_path: Path
) -> None:
    """Render a single language-summary radar (one polygon per language)."""
    n_axes = len(axes)
    angles = np.linspace(0, 2 * np.pi, n_axes, endpoint=False).tolist()
    angles += angles[:1]

    by_lang: dict[str, list[dict]] = {}
    for r in repos:
        by_lang.setdefault(r.get("language") or "Other", []).append(r)

    fig = plt.figure(figsize=(10, 10), facecolor="#0d1117")
    ax = fig.add_subplot(111, projection="polar")
    ax.set_facecolor("#0d1117")
    ax.set_theta_offset(np.pi / 2)
    ax.set_theta_direction(-1)
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels([a["label"] for a in axes], color="#c9d1d9", fontsize=11)
    ax.set_ylim(0, 10)
    ax.set_yticks([2, 4, 6, 8, 10])
    ax.set_yticklabels(["2", "4", "6", "8", "10"], color="#6e7681", fontsize=8)
    ax.spines["polar"].set_color("#30363d")
    ax.grid(color="#21262d", linewidth=0.8)

    palette = [
        "#7c3aed", "#f59e0b", "#06b6d4", "#10b981",
        "#3b82f6", "#ef4444", "#ec4899", "#f97316", "#a855f7", "#22d3ee",
    ]
    for (lang, group), color in zip(
        sorted(by_lang.items(), key=lambda kv: -len(kv[1])),
        palette,
    ):
        avg = {
            a["id"]: round(
                sum(r["scores"][a["id"]] for r in group) / len(group), 2
            )
            for a in axes
        }
        vals = [avg[a["id"]] for a in axes]
        vals += vals[:1]
        ax.plot(angles, vals, color=color, linewidth=2.4, label=f"{lang} (n={len(group)})")
        ax.fill(angles, vals, color=color, alpha=0.18)

    ax.set_title(
        "sachncs · capability radar by language",
        color="#f0f6fc",
        fontsize=15,
        pad=28,
    )
    ax.legend(
        loc="upper right",
        bbox_to_anchor=(1.32, 1.10),
        labelcolor="#c9d1d9",
        fontsize=9,
        frameon=False,
    )
    fig.tight_layout()
    fig.savefig(out_path, dpi=160, facecolor=fig.get_facecolor(), bbox_inches="tight")
    plt.close(fig)


# ----------------------------------------------------------------------------
# self-animating SVG (for the README — runs natively, no JS)
# ----------------------------------------------------------------------------

LANG_COLORS = {
    "Python": "#7c3aed",
    "TypeScript": "#f59e0b",
    "Rust": "#06b6d4",
    "JavaScript": "#10b981",
    "Go": "#3b82f6",
    "Objective-C": "#ec4899",
    "Other": "#8b949e",
}

def _hex(c: str) -> tuple[int, int, int]:
    h = c.lstrip("#")
    return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)

def _rgba(c: str, a: float) -> str:
    r, g, b = _hex(c)
    return f"rgba({r},{g},{b},{a})"


def render_animated_svg(
    repos: list[dict], axes: list[dict], out_path: Path
) -> None:
    """Emit a self-animating SVG that draws polygons in sequentially and
    sweeps a radar beam across the chart continuously.

    No JavaScript: all motion comes from SVG <animate> / <animateTransform>.
    Embeds directly in a GitHub README via <img> (like Platane/snk).
    """
    def esc(s: str) -> str:
        return (
            s.replace("&", "&amp;")
             .replace("<", "&lt;")
             .replace(">", "&gt;")
        )

    W = 900
    H = 760
    cx, cy = W / 2, H / 2 + 8
    radius = 280
    n = len(axes)

    # axis anchor angles, top → clockwise
    axis_angles_deg = [(-90 + (360 / n) * i) for i in range(n)]
    axis_pos = []
    for ang_deg in axis_angles_deg:
        a = math.radians(ang_deg)
        axis_pos.append((cx + radius * math.cos(a), cy + radius * math.sin(a)))

    parts: list[str] = []
    parts.append(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" '
        f'role="img" aria-label="sachncs capability radar">'
    )
    parts.append("""
      <defs>
        <radialGradient id="bg" cx="50%" cy="50%" r="62%">
          <stop offset="0%" stop-color="#11161d"/>
          <stop offset="70%" stop-color="#0d1117"/>
          <stop offset="100%" stop-color="#0a0d12"/>
        </radialGradient>
        <radialGradient id="sweep" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%"   stop-color="#7c3aed" stop-opacity="0.0"/>
          <stop offset="40%"  stop-color="#7c3aed" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="#7c3aed" stop-opacity="0.0"/>
        </radialGradient>
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stop-color="#7c3aed" stop-opacity="0.55"/>
          <stop offset="100%" stop-color="#7c3aed" stop-opacity="0.0"/>
        </radialGradient>
        <style>
          .axis-label { font: 600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #c9d1d9; letter-spacing: 0.04em; }
          .grid-line  { stroke: #21262d; stroke-width: 1; fill: none; }
          .grid-ring  { stroke: #21262d; stroke-width: 1; fill: none; }
          .axis-line  { stroke: #30363d; stroke-width: 1; fill: none; }
          .ring-label { font: 10px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #6e7681; }
          .title      { font: 700 18px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #f0f6fc; }
          .subtitle   { font: 11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #8b949e; letter-spacing: 0.06em; text-transform: uppercase; }
          .legend-text { font: 11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #c9d1d9; }
        </style>
      </defs>
    """)

    # background
    parts.append(f'<rect x="0" y="0" width="{W}" height="{H}" fill="url(#bg)"/>')

    # grid rings
    for r_frac in (0.25, 0.5, 0.75, 1.0):
        r = radius * r_frac
        parts.append(
            f'<circle class="grid-ring" cx="{cx}" cy="{cy}" r="{r:.2f}"/>'
        )
    # ring labels
    for r_frac, val in ((0.25, 2.5), (0.5, 5), (0.75, 7.5), (1.0, 10)):
        r = radius * r_frac
        parts.append(
            f'<text class="ring-label" x="{cx + 4}" y="{cy - r + 1}">{val}</text>'
        )

    # axis spokes + labels
    for i, (lx, ly) in enumerate(axis_pos):
        axis = axes[i]
        parts.append(
            f'<line class="axis-line" x1="{cx}" y1="{cy}" x2="{lx:.2f}" y2="{ly:.2f}"/>'
        )
        # label position slightly beyond the ring
        deg = axis_angles_deg[i]
        lx2 = cx + (radius + 14) * math.cos(math.radians(deg))
        ly2 = cy + (radius + 14) * math.sin(math.radians(deg))
        anchor = "middle"
        if deg < -160 or deg > 160:
            anchor = "middle"
        elif -160 < deg < -20:
            anchor = "end"
        elif -20 <= deg <= 20:
            anchor = "middle"
        elif 20 < deg < 160:
            anchor = "start"
        parts.append(
            f'<text class="axis-label" x="{lx2:.2f}" y="{ly2 + 4:.2f}" '
            f'text-anchor="{anchor}">{esc(axis["label"])}</text>'
        )

    # polygons: per-language MAX-envelope (the strongest reach in each axis)
    # drawn one after another. A faint per-language AVG envelope sits behind
    # so you can still tell concentration vs. peak.
    by_lang: dict[str, list[dict]] = {}
    for r in repos:
        by_lang.setdefault(r.get("language") or "Other", []).append(r)
    # ascending count: smaller languages draw first so the biggest sits on top
    sorted_langs = sorted(by_lang.items(), key=lambda kv: len(kv[1]))

    draw_duration = 0.9            # how long each polygon takes to draw
    stagger = 0.18                 # delay between successive polygons
    total = draw_duration + stagger * (len(sorted_langs) - 1) + 0.5

    for idx, (lang, group) in enumerate(sorted_langs):
        if len(group) < 2:
            continue
        color = LANG_COLORS.get(lang, "#8b949e")
        # max envelope — what this language has reached at its peak
        mx = [max(r["scores"][axis["id"]] for r in group) for axis in axes]
        # average envelope — what the typical project in this language looks like
        avg = [
            sum(r["scores"][axis["id"]] for r in group) / len(group)
            for axis in axes
        ]
        # faint average envelope first
        avg_pts = []
        for v, ang_deg in zip(avg, axis_angles_deg):
            r = (v / 10.0) * radius
            a = math.radians(ang_deg)
            avg_pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
        parts.append(
            f'<polygon points="{" ".join(f"{x:.2f},{y:.2f}" for x,y in avg_pts)}" '
            f'fill="{_rgba(color, 0.04)}" stroke="{_rgba(color, 0.0)}" '
            f'stroke-width="1" stroke-linejoin="round" opacity="0.6"/>'
        )
        pts = []
        for v, ang_deg in zip(avg, axis_angles_deg):
            r = (v / 10.0) * radius
            a = math.radians(ang_deg)
            pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
        path_d = "M " + " L ".join(f"{x:.2f},{y:.2f}" for x, y in pts) + " Z"
        length = sum(
            math.hypot(pts[i][0] - pts[(i + 1) % len(pts)][0],
                       pts[i][1] - pts[(i + 1) % len(pts)][1])
            for i in range(len(pts))
        )

        begin = idx * stagger
        # use the max envelope as the bold polygon
        pts = []
        for v, ang_deg in zip(mx, axis_angles_deg):
            r = (v / 10.0) * radius
            a = math.radians(ang_deg)
            pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
        path_d = "M " + " L ".join(f"{x:.2f},{y:.2f}" for x, y in pts) + " Z"
        length = sum(
            math.hypot(pts[i][0] - pts[(i + 1) % len(pts)][0],
                       pts[i][1] - pts[(i + 1) % len(pts)][1])
            for i in range(len(pts))
        )

        # bold polygon (max envelope) — fills breathe between two opacities
        parts.append(
            f'<polygon points="{" ".join(f"{x:.2f},{y:.2f}" for x,y in pts)}" '
            f'fill="{_rgba(color, 0.16)}" stroke="{color}" '
            f'stroke-width="2.6" stroke-linejoin="round" opacity="0.95">'
            f'<animate attributeName="fill" values="{_rgba(color, 0.16)};{_rgba(color, 0.28)};{_rgba(color, 0.16)}" '
            f'keyTimes="0;0.5;1" begin="0s" dur="{3 + idx * 0.4:.2f}s" repeatCount="indefinite"/>'
            f'</polygon>'
        )
        # a separate stroke-only path that draws itself in via dasharray,
        # then sits invisibly underneath. This is the "snake" trail.
        parts.append(
            f'<path d="{path_d}" fill="none" stroke="{color}" '
            f'stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round" '
            f'stroke-dasharray="{length:.2f}" stroke-dashoffset="{length:.2f}" '
            f'opacity="0">'
            f'<animate attributeName="opacity" values="0;0.95;0" '
            f'keyTimes="0;0.2;1" begin="{begin:.2f}s" dur="{draw_duration:.2f}s" '
            f'fill="freeze"/>'
            f'<animate attributeName="stroke-dashoffset" from="{length:.2f}" to="0" '
            f'begin="{begin:.2f}s" dur="{draw_duration:.2f}s" '
            f'calcMode="spline" keySplines="0.4 0 0.2 1" fill="freeze"/>'
            f'</path>'
        )

    # core glow at the centre
    parts.append(
        f'<circle cx="{cx}" cy="{cy}" r="60" fill="url(#coreGlow)">'
        f'<animate attributeName="r" values="60;80;60" dur="4s" repeatCount="indefinite"/>'
        f'</circle>'
    )

    # radar sweep beam (rotating angular gradient)
    parts.append(
        f'<g transform="translate({cx} {cy})">'
        f'<g>'
        f'<circle cx="0" cy="0" r="{radius}" fill="url(#sweep)"/>'
        f'<animateTransform attributeName="transform" type="rotate" '
        f'from="0" to="360" dur="6s" repeatCount="indefinite"/>'
        f'</g>'
        f'</g>'
    )

    # title
    parts.append(
        f'<text class="title" x="{cx}" y="36" text-anchor="middle">'
        f'sachncs · capability radar</text>'
    )
    parts.append(
        f'<text class="subtitle" x="{cx}" y="58" text-anchor="middle">'
        f'{len(repos)} public repos · live from github.com/sachncs</text>'
    )

    # legend (static, in the bottom strip)
    legend_y = H - 28
    legend_items = sorted_langs[:6]
    item_width = 110
    total_width = len(legend_items) * item_width
    start_x = (W - total_width) / 2
    for i, (lang, group) in enumerate(legend_items):
        x = start_x + i * item_width
        color = LANG_COLORS.get(lang, "#8b949e")
        parts.append(
            f'<rect x="{x}" y="{legend_y - 9}" width="10" height="10" rx="2" fill="{color}"/>'
        )
        parts.append(
            f'<text class="legend-text" x="{x + 16}" y="{legend_y}">'
            f'{lang} ({len(group)})</text>'
        )

    parts.append("</svg>")

    out_path.write_text("\n".join(parts), encoding="utf-8")


# ----------------------------------------------------------------------------

def main() -> int:
    axes = load_json(AXES_FILE)
    config = load_json(CONFIG_FILE)
    owner = config.get("owner") or "sachncs"
    if len(sys.argv) > 1:
        owner = sys.argv[1]

    print(f"[build_data] listing repos for {owner}", file=sys.stderr)
    raw = gh_list_repos(owner)
    repos = build_repos_data(raw, axes, config)

    payload = {
        "owner": owner,
        "generatedAt": subprocess.check_output(["date", "-u", "+%Y-%m-%dT%H:%M:%SZ"]).decode().strip(),
        "axes": axes,
        "config": {"weights": config["weights"], "scoreMax": config.get("score_max", 10)},
        "repos": repos,
    }
    REPOS_FILE.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(f"[build_data] wrote {REPOS_FILE} ({len(repos)} repos)", file=sys.stderr)

    print("[build_data] rendering static radar.png", file=sys.stderr)
    render_static_radar(repos, axes, RADAR_PNG)
    print(f"[build_data] wrote {RADAR_PNG}", file=sys.stderr)

    print("[build_data] rendering radar-by-lang.png", file=sys.stderr)
    render_lang_radar(repos, axes, LANGS_PNG)
    print(f"[build_data] wrote {LANGS_PNG}", file=sys.stderr)

    print("[build_data] rendering radar-animated.svg", file=sys.stderr)
    render_animated_svg(repos, axes, RADAR_SVG)
    print(f"[build_data] wrote {RADAR_SVG}", file=sys.stderr)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())