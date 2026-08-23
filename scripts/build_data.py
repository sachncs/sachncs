#!/usr/bin/env python3
"""Build /data/repos.json from GitHub and render /data/radar.png fallback.

Pipeline:
  gh repo list <owner> --json ...  ->  per-repo scoring against axes.json
                                     ->  repos.json
                                     ->  radar.png (matplotlib, static fallback)

The script is idempotent: running it twice with the same GitHub state
produces the same files. It is intentionally dependency-light:
- matplotlib only for the static fallback PNG
- everything else is stdlib
"""
from __future__ import annotations

import json
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


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def gh_list_repos(owner: str) -> list[dict]:
    """List public repos for `owner` via gh CLI."""
    cmd = [
        "gh", "repo", "list", owner,
        "--limit", "200",
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


def render_static_radar(
    repos: list[dict], axes: list[dict], out_path: Path
) -> None:
    """Render a static radar PNG that summarises the whole portfolio.

    Two visual layers:
      - the per-language average (bold polygons)
      - the per-repo polygons (low-alpha, behind)

    Falls back to a single "no data" radar if repos is empty.
    """
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
    legend = ax.legend(
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

    return 0


if __name__ == "__main__":
    raise SystemExit(main())