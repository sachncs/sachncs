---
title: Evaluation is infrastructure, not a release-day checklist
description: A useful evaluation system connects versioned evidence, explicit failure categories, and release decisions across the life of an AI application.
date: '2026-09-21'
tags: [Evaluation, Production AI, Engineering]
featured: true
draft: false
canonical: https://sachncs.github.io/writing/evaluation-as-infrastructure
repositories: [promptsheon, delta-search, trivium]
---
An evaluation result is useful only if someone can explain what was evaluated, against which evidence, under which conditions, and what decision follows. A score without that context is difficult to reproduce and easy to misuse.

I treat evaluation as part of the application’s infrastructure. It needs stable interfaces, versioned inputs, failure handling, and ownership. It should help a team choose between designs during development, detect regressions before release, and investigate quality changes after deployment. A final test run cannot carry all of those responsibilities on its own.

## Define the decision before the score

Start with the decision the evaluation will support. Are we deciding whether a new retriever preserves access rules? Whether a model change reduces unsupported claims? Whether an agent can recover after a tool timeout? Those questions require different evidence.

Write down failure categories before choosing a metric. For a retrieval-assisted answer, I might separate missing evidence, incorrect evidence selection, unsupported synthesis, stale information, and unauthorized disclosure. An aggregate answer-quality score can hide the fact that a candidate improved fluency while losing a critical source.

Acceptance criteria should distinguish ordinary quality trade-offs from invariants. A small change in style preference may be tolerable. Accessing a document the user cannot read should not disappear inside an average. Keep such checks visible and independently actionable.

## Version the whole experiment

The behavior of an AI application depends on more than a model name. Prompts, retrieval settings, source snapshots, tool schemas, policy versions, and evaluation code can all affect a result. Record the inputs needed to interpret the run, using immutable identifiers where practical.

A minimal manifest might look like this. It is an illustrative schema, not a specific library API:

```json
{
  "candidate": "release-content-hash",
  "dataset": "support-cases-v4",
  "source_snapshot": "knowledge-snapshot-id",
  "retrieval_config": "hybrid-config-hash",
  "scorer_version": "rubric-v3",
  "baseline_run": "previous-run-id",
  "results": "artifact-location"
}
```

Secrets and sensitive source material do not belong in a casually shared manifest. A reference to a governed artifact may be more appropriate than copying its contents. Reproducibility and privacy need to be designed together.

In [Promptsheon](/promptsheon), content-addressed manifests, evaluation suites, and release controls bring these concepts into the same platform. The architectural benefit is the relationship between the artifact being evaluated and the artifact being activated. The [case study](/work#promptsheon) discusses that design without inferring adoption or measured production impact.

## Build datasets that expose boundaries

A golden dataset should represent important tasks and failure conditions, not just examples that are easy to score. Include routine cases, difficult cases, ambiguous requests, and situations where the correct action is to abstain or ask for clarification.

Keep a meaningful separation between development examples and held-out evaluation cases. Otherwise repeated tuning can turn the benchmark into an indirect training set. Record why each case exists, what it tests, and when its expected behavior should change. A stale expected answer can penalize a correct response after the underlying policy or source changes.

Segments matter. A change that improves the overall score may make a particular language, document type, tool, or access pattern worse. Report results at the level where a team can take action. Small segments also need careful interpretation: one changed case can produce a large percentage swing without strong evidence of a general effect.

## Use the simplest adequate scorer

Deterministic checks are valuable when the requirement is precise. Schema validity, required fields, forbidden tool calls, resource permissions, and termination budgets do not need a language model to judge them. Such checks are easier to audit and usually cheaper to run.

Open-ended answers may require a rubric and human judgment. A model judge can help scale that review, but it introduces another source of variation. Calibrate it against human-reviewed examples, inspect disagreements, and version the rubric and judge configuration. A persuasive explanation from a judge is not proof that its score is correct.

Separate scoring failure from application failure. If the judge request times out, mark the case as unscored and make coverage visible. Treating missing scores as successes inflates quality; treating all of them as application failures obscures the actual problem.

## Compare under a shared budget

Candidate and baseline should run on comparable inputs and conditions. For nondeterministic systems, repeated runs can reveal variability that a single pass misses. Report the amount of evidence behind the comparison, rather than presenting a small numerical difference as certainty.

Quality also interacts with latency and cost. A larger context, extra reranker, or more agent steps may improve the answer while exceeding the workflow’s budget. Capture those operational measures alongside quality so that a release decision reflects the whole system.

The same principle applies to algorithm research. The [delta-search implementation](/delta-search) exposes solver variants and budget controls. Comparing their objective values without comparable iteration or time budgets can reward additional computation rather than a better strategy. Feasibility, runtime, and repeatability belong in the comparison.

## Connect release controls to evidence

A useful release path ties a candidate artifact to its evaluation results, review, activation, and rollback target:

```text
versioned candidate + versioned cases
                 ↓
          reproducible run
                 ↓
     quality + invariants + budget
                 ↓
       review release evidence
                 ↓
       staged activation → observe
                 ↓
           retain / roll back
```

A passing offline suite is evidence for a release, not proof of all future behavior. Staged activation limits exposure while collecting production signals. Define rollback ownership and the conditions that trigger it before the rollout. Ensure rollback restores a compatible combination of configuration, data contracts, and tool behavior.

Avoid an approval that only records someone clicking a button. The reviewer should be able to identify the candidate, inspect changes, understand coverage gaps, and see the relevant regressions. Approval becomes meaningful when it refers to a concrete artifact and an explicit decision.

## Close the production loop

Online signals can include user corrections, abandoned workflows, escalations, retrieval misses, latency, and tool failures. Each is incomplete on its own. A low complaint rate may reflect low usage, and a completed workflow may still contain an incorrect answer.

Use production incidents to add or revise evaluation cases, with privacy review where needed. Keep a link between the observed failure, its reproduction, and the change intended to address it. This makes the suite a record of what the team has learned rather than a fixed collection assembled at launch.

Evaluation infrastructure should make uncertainty visible. It should show which cases passed, which failed, which were not scored, and which important behaviors are not yet covered. That is a stronger basis for an engineering decision than a single green number. For agent workflows, [evaluating the execution trajectory](/writing/designing-reliable-ai-agents) is one concrete place to start.
