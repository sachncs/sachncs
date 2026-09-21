---
title: Designing reliable AI agents starts at the tool boundary
description: Identity, authorization, durable state, and recovery determine what an agent can safely do after it chooses an action.
date: '2026-09-21'
tags: [Agents, Security, Architecture]
featured: true
draft: false
canonical: https://sachncs.github.io/writing/designing-reliable-ai-agents
repositories: [agent-guard, agent-passport, alfred]
---
An agent that chooses a sensible action can still be an unreliable system. It can execute the action twice, use an identity with too much authority, lose the result before saving its state, or continue after the user has withdrawn permission. None of those failures require the model to misunderstand the task.

I find it more useful to start the design at the point where a proposed action becomes an external effect. That boundary connects model behavior to familiar distributed-systems concerns: authorization, state transitions, idempotency, timeouts, and recovery. A stronger prompt can help with action selection. It cannot replace those mechanisms.

## A proposal is not permission

Consider an agent that helps resolve a customer request. It reads a record, drafts a response, and proposes sending an email. Those are different capabilities with different consequences. Access to the record does not automatically grant permission to send a message, and permission to draft a response should not imply permission to execute it.

The runtime should construct an authorization request from trusted application state. It needs a principal, an action, a resource, and relevant context. The model’s tool arguments are input to that process, not proof of identity or authority. A claimed user identifier in generated JSON must not become the authenticated principal.

A useful execution path looks like this:

```text
model proposes action
        ↓
validate arguments and resolve resource
        ↓
resolve authenticated identity and scope
        ↓
authorize this action on this resource
        ↓
execute with a stable operation identifier
        ↓
persist result and next state
```

Each step can fail in a different way. Invalid arguments are different from denied access; a denied action is different from an unavailable policy service. Preserve those distinctions in logs and evaluation results, even if the user-facing explanation is simpler.

The [agent-guard project](/agent-guard) makes per-tool-call authorization an explicit component. Its public design uses Cedar policies and a shared evaluation core behind several interfaces. That is one implementation of the boundary; the architectural requirement is independent of a particular policy engine.

## Give retries a meaning

Suppose the mail service accepts a send request, but the connection drops before the agent receives a response. Retrying may send a second message. Stopping may leave the agent reporting failure even though the customer received the first one.

A stable operation identifier can help when the downstream service supports idempotency. The identifier should represent the intended action, remain stable across retries, and be bound to the relevant arguments. Generating a new identifier on every attempt defeats its purpose. Reusing one for a different action can be equally wrong.

If the tool does not support idempotency, the runtime needs a reconciliation path. It may query a status endpoint, inspect a durable external reference, or hand the ambiguous state to a person. “Retry three times” is a policy about repetition; it is not a solution to uncertainty about external effects.

I distinguish at least four states: proposed, authorized, attempted, and confirmed. A timeout after an attempt should not silently turn into a confirmed failure. Keeping that ambiguity visible prevents the next model turn from reasoning from a false premise.

## Persist enough to resume honestly

Conversation history is not a transaction log. A message saying “I sent the email” is not sufficient evidence that the external system accepted it. Durable execution state should retain the operation identifier, the relevant tool arguments or safe references to them, the authorization decision, the attempt, and the result.

That record must be designed around privacy and retention requirements. Saving every raw tool response forever creates its own risks. Store what recovery and audit actually require, apply access controls, and define deletion behavior. The useful unit is a recoverable state transition, not an unrestricted transcript.

A crash test is a practical design tool. Interrupt the runtime immediately before execution, immediately after execution, and immediately before persisting confirmation. At each point, ask what a restarted process knows and what it can safely do next. If the answer depends on the model guessing what happened, the recovery design is incomplete.

The [Alfred runtime](/alfred) provides a public example of separating an agent turn loop from persistence. Its documented SQLite and JSONL storage is useful context for this discussion; persistence alone does not establish exactly-once behavior for arbitrary tools.

## Delegation should reduce authority

A parent agent may need help from another agent, but delegation should not default to sharing all of the parent’s permissions. Scope the delegated action set, resources, lifetime, and intended recipient. Decide how revocation propagates and what happens to work already in flight.

Identity and authorization answer related but different questions. A signed identity can establish who issued a token without proving that a particular action is allowed. The [agent-passport repository](/agent-passport) explores identity, delegation, and trust. It should be considered alongside the actual enforcement boundary rather than as a substitute for it.

Human approval also needs precise semantics. Approval should refer to the action that will execute, including the important arguments and destination. If the agent changes those arguments after approval, the earlier decision may no longer apply. A review interface should show the consequence clearly enough for the reviewer to make a meaningful choice.

## Evaluate the trajectory

A final answer can look correct even when the agent used an unauthorized source or retried an unsafe operation. An evaluation suite should inspect the trajectory as well as the result.

Useful cases include an expired identity, denied resource, malformed tool result, cancelled task, repeated callback, tool timeout, and restart during an ambiguous operation. These are controlled test scenarios, not a claim that every failure can be anticipated. The important question is whether the runtime preserves its invariants when the happy path breaks.

I separate task quality from execution safety. One score can describe whether the user’s problem was solved. Independent checks can establish whether permissions were respected, the operation budget held, and external effects were reconciled. Combining everything into one average makes critical failures easy to hide.

## Make the boundary inspectable

The operational trace should connect a user request to a proposed action, identity, policy decision, attempt, and result. Operators need to distinguish model mistakes from integration failures and policy denials. Correlation identifiers help only if they survive the path through the tool and back into persisted state.

This leads to a practical design principle: let the model propose work, and make the runtime accountable for execution. It creates a place to test, enforce, observe, and recover. The [authorization case study](/work#agent-guard) explores that separation in a concrete public project. [Evaluation as infrastructure](/writing/evaluation-as-infrastructure) extends the same reasoning to the release process.
