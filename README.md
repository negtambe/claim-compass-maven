# Claim Compass

A claims transparency feature concept built for Maven Clinic's Claims & Payments team — taking a real member pain point (not knowing where a claim actually stands) from research through a clickable prototype.

**Prototype:** [claim-compass-maven.lovable.app](https://claim-compass-maven.lovable.app/)
**Full concept doc (personas, JTBD, prioritization):** [Notion](https://roomy-cathedral-688.notion.site/Neg-Tambe-Maven-Claim-Compass-398ab063e65980a88e2de733eec319d3)

## The problem

Claim status pages typically show one of three flat states — submitted, processing, denied — which tells a member almost nothing about what's actually happening or what to do next. Claim Compass replaces that with **sub-status tracking**: a claim in "processing" can surface *why* (e.g., pending provider documentation, pending coordination of benefits) so members and support teams both know the real next step.

## What's in the concept

- **Personas & JTBD framing** — grounding the feature in the specific jobs members are trying to get done when they check a claim
- **Sub-status tracking model** — the expanded claim-state structure and what triggers each transition
- **ICE prioritization** (Impact / Confidence / Ease) — how the feature set was scoped and sequenced against other roadmap candidates
- **User stories & success metrics** — written the way they'd need to be handed to an engineering team, with metrics tied to real support-ticket and NPS impact rather than vanity numbers

## Prototype

The clickable prototype was built with [Lovable](https://lovable.dev/) from a structured prompt derived from the concept doc, running on React + TypeScript (TanStack Start).

## Why this exists

Built as part of an application for an Associate PM, Claims & Payments role at Maven Clinic — an exercise in taking a concept the whole way from a member pain point to something a stakeholder can actually click through.
