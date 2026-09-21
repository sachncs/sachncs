# Editorial evidence

Reviewed 21 September 2026.

The professional positioning and About narrative are based on the owner-provided
site brief and profile README. The original site’s 50k QPS, sub-800 ms latency,
incident-reduction, evaluation-cycle, enterprise-adoption, and internal-team claims
are deliberately excluded: no supporting public evidence was identified.

Repository metadata is the public GitHub API snapshot in
`src/data/repositories.json`. The case studies summarize the following sources:

- [agent-guard README](https://github.com/sachncs/agent-guard#readme): Cedar core,
  integration surfaces, delegation, audit, policy lifecycle, and documented tests.
- [promptsheon README](https://github.com/sachncs/promptsheon#readme): Fastify,
  Next.js, SQLite, content-addressed manifests, Strands execution, evaluation,
  maker-checker approval, canary activation, and rollback.
- [delta-search README](https://github.com/sachncs/delta-search#readme): independent
  Python implementation of the Arasu–Gupta subgraph-extraction algorithm,
  incremental deltas, reversible actions, solver variants, and CLI.
- [agent-passport README](https://github.com/sachncs/agent-passport#readme): identity,
  delegation, and trust. Referenced in the agent essay.
- [Alfred README](https://github.com/sachncs/alfred#readme): local runtime, turn loop,
  SQLite/JSONL persistence, and MCP workers. Referenced in the agent essay.

The articles are original technical explanations prepared for the requested
publishing area. Scenarios and the evaluation manifest are explicitly conceptual;
they are not attributed to customer deployments. Operational considerations and
lessons in case studies are analysis of the documented designs, not invented
historical accounts. No historical alternatives-considered claims are made where
the project documentation does not establish them.

The repository index is intentionally broader than the selected work page. A
public repository is evidence that inspectable code exists, not evidence of
production adoption, commercial results, or independently verified performance.
