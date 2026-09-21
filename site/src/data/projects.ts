export type CaseStudy = {
  slug: string; title: string; kind: string; summary: string; focus: string;
  problem: string; constraints: string; architecture: string; flow: string[];
  decisions: string; tradeoffs: string; implementation: string; reliability: string;
  security: string; evaluation: string; operations: string; outcome: string;
  lessons: string; article: string; usage: string;
};
// Architectural summaries grounded in the public READMEs, reviewed 2026-09-21.
// No customer adoption, performance, or production-impact claims are inferred.
export const projects: CaseStudy[] = [
  {
    slug: 'agent-guard', title: 'Making every tool call an authorization decision.', kind: 'Public open-source project',
    summary: 'A policy boundary between what an agent proposes and what it is permitted to execute.',
    focus: 'Agent security · Policy · Auditability',
    problem: 'An agent can generate a valid tool request without having authority to perform it. A prompt instruction cannot establish that authority. The decision needs an explicit principal, action, resource, and context at the point of execution.',
    constraints: 'Different runtimes need the same policy semantics. Delegated agents need bounded permissions, and operators need a traceable record of decisions without tying application logic to a single interface.',
    architecture: 'A Rust core wraps the Cedar policy engine. SDK, CLI, console, and AuthZEN HTTP interfaces converge on policy evaluation and a hash-chained audit log. Versioned policy bundles separate policy changes from application releases.',
    flow: ['Tool request', 'Identity + context', 'Cedar policy', 'Allow / deny', 'Audit record'],
    decisions: 'Keep authorization outside model reasoning. Share one evaluation core across integration surfaces. Represent delegation explicitly, with scoped and time-bounded tokens, instead of passing an unrestricted parent identity.',
    tradeoffs: 'A local engine avoids a network hop but distributes policy rollout across hosts. An HTTP decision point centralizes the boundary but adds availability and latency dependencies. Decision caching also creates a freshness window that must be part of revocation design.',
    implementation: 'The repository separates core policy evaluation, authentication, telemetry, bundle management, CLI, and server crates. A TypeScript SDK and an administration console expose the same underlying decision path.',
    reliability: 'The documented design includes policy validation, simulation, hot reload, and rollback. Treat denial, unavailable identity, and unavailable policy evaluation as explicit integration outcomes.',
    security: 'Scoped delegation, token validation, sender constraints, and tamper-evident audit records address different parts of the trust boundary. The console requires OIDC configuration and fails closed when authentication is missing.',
    evaluation: 'The public repository includes Rust and SDK tests, policy simulation, and an audit-chain verification command. An adopter still needs tests for their own principals, resources, revocation expectations, and failure modes.',
    operations: 'Policy versions, authorization spans, cache lifetime, audit rotation, and signing-key management all require ownership. A tamper-evident log is useful only when retention and verification are operated deliberately.',
    outcome: 'A public implementation of per-tool-call authorization with multiple integration surfaces. The repository demonstrates the mechanism; it does not establish customer adoption or a measured incident reduction.',
    lessons: 'The useful security boundary is where an action takes effect. Keeping that boundary explicit makes policy review, testing, and operational accountability easier to reason about.',
    article: 'designing-reliable-ai-agents', usage: 'agentguard init --name example\nagentguard validate\nagentguard authorize request.json',
  },
  {
    slug: 'promptsheon', title: 'Treating agent configuration as a release artifact.', kind: 'Public open-source project',
    summary: 'Versioned configuration, evaluation, and approval belong in the same path to release.',
    focus: 'Evaluation · Release engineering · Agent workflows',
    problem: 'Changing a prompt or agent graph can change application behavior without changing application code. Teams need to identify exactly what ran, evaluate a candidate, control activation, and restore a known release.',
    constraints: 'The platform is self-hosted and supports multiple model providers. Authoring, execution, evaluation, and approval need a shared identity for the configuration under review.',
    architecture: 'A Fastify backend and Next.js interface use SQLite and a content-addressed store. Strands-based graph execution runs capability nodes; evaluation suites and maker-checker approvals govern releases.',
    flow: ['Author graph', 'Compile + hash', 'Evaluate', 'Approve', 'Canary / rollback'],
    decisions: 'Store compiled manifests by content rather than mutable names. Separate release creation from approval. Make activation an explicit operation and retain the version needed for rollback.',
    tradeoffs: 'SQLite and local content storage keep the self-hosted deployment understandable, while making backup, concurrent access, and storage ownership explicit concerns. Automated scoring supports repeatability but cannot replace judgment about the right evaluation dataset.',
    implementation: 'The platform provides a DAG editor, per-node configuration, provider integration, dataset-based scorers, environment activation, weighted canary releases, and an append-only audit chain.',
    reliability: 'Release identifiers and persisted evaluation results support diagnosis and rollback. The documented self-evolution loop adds a separate control concern: automatically proposed changes still need bounded rollout and monitoring.',
    security: 'Maker-checker rules prevent a release creator from approving their own release. Signed incoming webhooks and replay protection address the release integration boundary; deployment-specific access and secrets still need review.',
    evaluation: 'Exact-match, regex, and model-judge scorers support different failure classes. Compare candidate and baseline on the same cases, and retain enough configuration to interpret a score later.',
    operations: 'Back up the SQLite database and content store together. Track active releases, provider failures, evaluation coverage, and rollback behavior. A successful health endpoint does not prove output quality.',
    outcome: 'A public platform that brings agent authoring, execution, evaluation, and release controls into one system. No claims about internal-team adoption or production improvement are made here.',
    lessons: 'Configuration is executable behavior. A release process becomes more useful when the evaluation result, approval, and deployed content refer to the same immutable artifact.',
    article: 'evaluation-as-infrastructure', usage: 'git clone https://github.com/sachncs/promptsheon.git\ncd promptsheon\npnpm install\n# Configure .env using the repository guide.\npnpm dev',
  },
  {
    slug: 'delta-search', title: 'Separating a search strategy from the graph problem.', kind: 'Public research implementation',
    summary: 'A reusable reward–penalty framework for heuristic subgraph extraction in Python.',
    focus: 'Graph algorithms · Incremental computation · Research engineering',
    problem: 'NP-hard subgraph problems require practical search strategies, but reimplementing the solver for each problem obscures what is shared. Recomputing the entire objective for every candidate also wastes work.',
    constraints: 'The implementation supports multiple problem definitions with a standard-library core. It is an independent implementation of the ΔSearch work by Arasu and Gupta, not a claim of authorship of the underlying algorithm.',
    architecture: 'A problem interface defines reward, penalty, feasibility, and candidate actions. The solver evaluates incremental deltas, applies mutations with undo support, and reports progress through an observer protocol.',
    flow: ['Graph + problem', 'Candidate action', 'Reward / penalty Δ', 'Apply / undo', 'Best state'],
    decisions: 'Separate problem semantics from the optimization loop. Use reversible mutations so search strategies can explore candidates without recreating the full state. Expose stopping conditions and progress as part of the API.',
    tradeoffs: 'Heuristic search trades an optimality guarantee for practical exploration. Incremental bookkeeping reduces repeated work but creates consistency invariants between the cached objective and the current graph state.',
    implementation: 'The public Python package includes concrete subgraph problems, a greedy solver, multi-start and beam variants, JSON input/output, a CLI, and optional NetworkX interoperability.',
    reliability: 'Correct apply/undo behavior is central: every reversal must restore graph structure and objective state. Deterministic seeds and explicit termination reasons help make comparisons reproducible.',
    security: 'This is a local algorithm library, not an authorization service. Applications that accept untrusted graph inputs need their own input validation, graph-size limits, time budgets, and isolation.',
    evaluation: 'Compare feasibility and objective quality as well as runtime. The repository supplies tests and benchmark utilities; benchmark conclusions require stated datasets, solver settings, seeds, and compute budgets.',
    operations: 'Iteration budgets, memory growth, and termination conditions determine how a solver fits into a larger service. The library itself is not evidence of sustained retrieval-service throughput.',
    outcome: 'A public, typed Python framework for exploring several subgraph-extraction problems with shared search machinery. Published source provides inspectable algorithms and examples, not a production service-level claim.',
    lessons: 'A clean problem interface makes research ideas easier to compare. Optimizing the inner loop only helps when feasibility and state consistency remain measurable.',
    article: 'evaluation-as-infrastructure', usage: 'delta-search solve --problem mps --graph input.json --output result.json\ndelta-search validate --graph input.json',
  },
];
