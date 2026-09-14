import type { LucideIcon } from 'lucide-react';
import {
  Boxes,
  Compass,
  Gauge,
  GitBranch,
  ShieldCheck,
  Sparkles,
  Workflow,
  Layers,
} from 'lucide-react';

export const profile = {
  name: 'Sachin',
  role: 'Applied AI Architect & Engineer',
  tagline: 'Shipping frontier AI from prototype to production.',
  summary:
    'Production-grade AI systems — agents, retrieval, evaluation, and the integrations that make them stick.',
  status: 'Selectively open to advisory through next quarter',
  email: 'sachncs@gmail.com',
  links: {
    github: 'https://github.com/sachncs',
    linkedin: 'https://www.linkedin.com/in/sachncs',
    repositories: 'https://github.com/sachncs?tab=repositories',
  },
};

export type Stat = {
  value: string;
  label: string;
  detail?: string;
};

export const stats: Stat[] = [
  { value: '50k', label: 'QPS sustained', detail: 'Retrieval index · 2025' },
  { value: '< 800ms', label: 'p99 latency', detail: 'Production RAG' },
  { value: '~70%', label: 'Incident reduction', detail: 'Agent guardrail pilots' },
  { value: '< 1 day', label: 'Eval cycles', detail: 'From 3-week baseline' },
];

export type Capability = {
  title: string;
  description: string;
  icon: LucideIcon;
  tags: string[];
};

export const capabilities: Capability[] = [
  {
    title: 'Eval harnesses for LLM systems',
    description:
      'Frameworks used across three production agent rollouts. Cut eval-suite iteration time from days to minutes with deterministic, reproducible runs.',
    icon: Gauge,
    tags: ['Evaluation', 'LLM ops', 'CI'],
  },
  {
    title: 'Production RAG at scale',
    description:
      'Retrieval, re-ranking, and freshness pipelines operating at 50k QPS with p99 under 800ms. Designed to stay sharp as corpora change.',
    icon: Layers,
    tags: ['Retrieval', 'Ranking', 'Indexing'],
  },
  {
    title: 'Agent reliability',
    description:
      'Identity, guardrails, and provenance for long-running agent workflows. Reduced runaway-action incidents by ~70% in pilots.',
    icon: ShieldCheck,
    tags: ['Guardrails', 'Identity', 'Provenance'],
  },
  {
    title: 'Applied architecture',
    description:
      'Translating business outcomes into tractable AI system designs — from PoC scope to multi-region rollout plans.',
    icon: Compass,
    tags: ['System design', 'Strategy'],
  },
];

export type Project = {
  name: string;
  description: string;
  stack: string;
  status: 'active' | 'maintained';
  href: string;
  highlight?: string;
};

export const projects: Project[] = [
  {
    name: 'promptsheon',
    description:
      'Git-native, versioned infrastructure for agent configurations. Reproducibility and governance across five internal teams.',
    stack: 'TypeScript',
    status: 'active',
    href: 'https://github.com/sachncs/promptsheon',
    highlight: 'Reproducible configs',
  },
  {
    name: 'agent-passport',
    description:
      'Identity and provenance for production AI agents. Adopted by two enterprise rollouts in 2025.',
    stack: 'Python',
    status: 'active',
    href: 'https://github.com/sachncs/agent-passport',
    highlight: 'Enterprise ready',
  },
  {
    name: 'agent-guard',
    description:
      'Reliability and safety controls for deployed agents. Reduced runaway-action incidents by ~70% in pilots.',
    stack: 'Rust',
    status: 'active',
    href: 'https://github.com/sachncs/agent-guard',
    highlight: '~70% fewer incidents',
  },
  {
    name: 'delta-search',
    description:
      'Retrieval over changing corpora. Operates a 50k QPS index with p99 under 800ms.',
    stack: 'Go',
    status: 'active',
    href: 'https://github.com/sachncs/delta-search',
    highlight: '50k QPS · p99 < 800ms',
  },
  {
    name: 'underwrite',
    description:
      'Decision systems on production data pipelines. Turns three-week eval cycles into less than a day.',
    stack: 'Python',
    status: 'active',
    href: 'https://github.com/sachncs/underwrite',
    highlight: 'Faster eval cycles',
  },
  {
    name: 'fleetpilot',
    description:
      'Distributed event-driven backends. Resilience and scale patterns for cloud-native platforms.',
    stack: 'Go',
    status: 'maintained',
    href: 'https://github.com/sachncs/fleetpilot',
    highlight: 'Distributed patterns',
  },
];

export type ProcessStep = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const processSteps: ProcessStep[] = [
  {
    title: 'Outcome framing',
    description:
      'Pressure-test the business problem before picking a model. Define success in measurable terms, with a clear path from PoC to production.',
    icon: Sparkles,
  },
  {
    title: 'Reference architecture',
    description:
      'A tractable design — data contracts, retrieval shape, agent boundaries, evaluation surface. Built for the team that has to operate it.',
    icon: Workflow,
  },
  {
    title: 'Hands-on implementation',
    description:
      'Working code, not decks. Eval harness, retrieval pipeline, agent loop, observability, guardrails — shipped end-to-end with the team.',
    icon: Boxes,
  },
  {
    title: 'Operational readiness',
    description:
      'Identity, governance, on-call, freshness, rollback. Designed to live inside enterprise security and data-governance constraints.',
    icon: GitBranch,
  },
];

export type Engagement = {
  name: string;
  description: string;
  cadence: string;
  bestFor: string;
  featured?: boolean;
};

export const engagements: Engagement[] = [
  {
    name: 'Fractional advisory',
    description:
      'Strategic reviews, architecture sign-off, and unblocking on a recurring cadence. Highest leverage for teams already shipping.',
    cadence: 'Monthly',
    bestFor: 'Teams already building',
  },
  {
    name: 'Paid pilot',
    description:
      'A focused 4–8 week engagement that lands a concrete artifact: an eval harness, a retrieval pipeline, an agent reliability layer.',
    cadence: '4–8 weeks',
    bestFor: 'Production-bound work',
    featured: true,
  },
  {
    name: 'Full-time consulting',
    description:
      'Embedded alongside the team for the duration of a critical rollout. Limited slots, high commitment.',
    cadence: 'Project-based',
    bestFor: 'Enterprise rollouts',
  },
];

export type Tool = {
  name: string;
  group: 'daily' | 'weekly' | 'occasional';
};

export const tools: Tool[] = [
  { name: 'Python', group: 'daily' },
  { name: 'TypeScript', group: 'daily' },
  { name: 'FastAPI', group: 'daily' },
  { name: 'Postgres', group: 'daily' },
  { name: 'OpenAI API', group: 'daily' },
  { name: 'Evals tooling', group: 'daily' },
  { name: 'Rust', group: 'weekly' },
  { name: 'Go', group: 'weekly' },
  { name: 'Kubernetes', group: 'weekly' },
  { name: 'Retrieval infra', group: 'weekly' },
  { name: 'OpenTelemetry', group: 'weekly' },
  { name: 'PyTorch', group: 'occasional' },
  { name: 'vLLM', group: 'occasional' },
  { name: 'Hugging Face', group: 'occasional' },
  { name: 'CUDA', group: 'occasional' },
];