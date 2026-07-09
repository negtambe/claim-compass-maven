import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Check,
  Upload,
  Copy,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  XCircle,
  PartyPopper,
} from "lucide-react";
import {
  getClaim,
  CLAIM_STEPS,
  STATUS_META,
  type Claim,
} from "@/lib/claims-data";

export const Route = createFileRoute("/claims/$id")({
  loader: ({ params }) => {
    const claim = getClaim(params.id);
    if (!claim) throw notFound();
    return { claim };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Claim not found — Claim Compass" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    return {
      meta: [
        {
          title: `${loaderData.claim.provider} — Claim Compass`,
        },
        {
          name: "description",
          content: `Track your ${loaderData.claim.service} claim from ${loaderData.claim.provider}.`,
        },
      ],
    };
  },
  component: ClaimDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <h1 className="text-xl font-semibold">Claim not found</h1>
      <Link to="/" className="mt-4 inline-block text-sm text-primary hover:underline">
        Back to your claims
      </Link>
    </div>
  ),
});

function currency(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function ClaimDetail() {
  const { claim } = Route.useLoaderData();
  const meta = STATUS_META[claim.status];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-card/60 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-6 py-4">
          <Link
            to="/"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Back to claims"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="text-sm text-muted-foreground">Claim details</div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        {/* Summary */}
        <section className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                {claim.service}
              </div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                {claim.provider}
              </h1>
              <div className="mt-1 text-sm text-muted-foreground">
                Submitted {claim.date} · Claim #{claim.id.toUpperCase()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold tabular-nums text-foreground">
                {currency(claim.amount)}
              </div>
              <span
                className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${meta.pill}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                {meta.label}
              </span>
            </div>
          </div>
        </section>

        <div className="mt-6">
          {claim.status === "in_review" && <InReviewView claim={claim} />}
          {claim.status === "needs_action" && <NeedsActionView claim={claim} />}
          {claim.status === "denied" && <DeniedView claim={claim} />}
          {claim.status === "approved" && <ApprovedView claim={claim} />}
        </div>
      </main>
    </div>
  );
}

/* ---------------- In Review ---------------- */

function InReviewView({ claim }: { claim: Claim }) {
  const current = claim.currentStepIndex ?? 0;
  return (
    <section className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4 text-review" />
        <span>
          Estimated completion:{" "}
          <span className="font-medium text-foreground">
            {claim.etaBusinessDays} business days
          </span>{" "}
          — based on similar past claims
        </span>
      </div>

      <ol className="relative">
        {CLAIM_STEPS.map((step, i) => {
          const state =
            i < current ? "done" : i === current ? "current" : "future";
          const isLast = i === CLAIM_STEPS.length - 1;
          return (
            <li key={step.key} className="relative flex gap-4 pb-6 last:pb-0">
              {!isLast && (
                <span
                  aria-hidden
                  className={`absolute left-[15px] top-8 h-[calc(100%-1rem)] w-px ${
                    i < current ? "bg-review" : "bg-border"
                  }`}
                />
              )}
              <div
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                  state === "done"
                    ? "border-review bg-review text-review-foreground"
                    : state === "current"
                    ? "border-review bg-review-soft text-review"
                    : "border-border bg-card text-muted-foreground"
                }`}
              >
                {state === "done" ? (
                  <Check className="h-4 w-4" />
                ) : state === "current" ? (
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-review opacity-60" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-review" />
                  </span>
                ) : (
                  <Circle className="h-2.5 w-2.5" />
                )}
              </div>
              <div className="pt-1">
                <div
                  className={`text-sm font-medium ${
                    state === "future"
                      ? "text-muted-foreground"
                      : "text-foreground"
                  }`}
                >
                  {step.label}
                </div>
                {state === "current" && (
                  <div className="mt-1 text-xs text-review">In progress now</div>
                )}
                {state === "done" && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    Completed
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* ---------------- Needs Action ---------------- */

function NeedsActionView({ claim }: { claim: Claim }) {
  const [items, setItems] = useState(claim.checklist ?? []);
  const remaining = items.filter((i) => !i.done).length;

  return (
    <section className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-action-soft text-action-foreground">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            We need a few things from you
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Once we have these, your claim goes back into review right away.
          </p>
        </div>
      </div>

      <ul className="mt-6 space-y-3">
        {items.map((item, idx) => (
          <li
            key={item.label}
            className={`flex items-center justify-between rounded-xl border p-4 ${
              item.done
                ? "border-approved/30 bg-approved-soft/40"
                : "border-border bg-background"
            }`}
          >
            <div className="flex items-center gap-3">
              {item.done ? (
                <CheckCircle2 className="h-5 w-5 text-approved" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
              <span
                className={`text-sm ${
                  item.done
                    ? "text-muted-foreground line-through"
                    : "font-medium text-foreground"
                }`}
              >
                {item.label}
              </span>
            </div>
            {!item.done && (
              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition hover:opacity-90">
                <Upload className="h-3.5 w-3.5" />
                Upload
                <input
                  type="file"
                  className="hidden"
                  onChange={() => {
                    setItems((prev) =>
                      prev.map((p, i) =>
                        i === idx ? { ...p, done: true } : p,
                      ),
                    );
                  }}
                />
              </label>
            )}
          </li>
        ))}
      </ul>

      {remaining > 0 ? (
        <div className="mt-6 flex items-center gap-2 rounded-xl bg-action-soft px-4 py-3 text-sm text-action-foreground">
          <Clock className="h-4 w-4" />
          Estimated delay if not resolved:{" "}
          <span className="font-semibold">
            {claim.delayIfUnresolvedDays} days
          </span>
        </div>
      ) : (
        <div className="mt-6 flex items-center gap-2 rounded-xl bg-approved-soft px-4 py-3 text-sm text-approved">
          <CheckCircle2 className="h-4 w-4" />
          All set — we'll pick this back up within one business day.
        </div>
      )}
    </section>
  );
}

/* ---------------- Denied ---------------- */

function DeniedView({ claim }: { claim: Claim }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(claim.emailTemplate ?? "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* noop */
    }
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-denied/20 bg-denied-soft/50 p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-denied/15 text-denied">
            <XCircle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Why this claim was denied
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground/80">
              {claim.denialReason}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
        <h3 className="text-base font-semibold text-foreground">
          What to do next
        </h3>
        <ol className="mt-4 space-y-3">
          {claim.nextSteps?.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {i + 1}
              </span>
              <span className="pt-0.5 text-sm leading-relaxed text-foreground/90">
                {s}
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Email template for your provider
            </div>
            <button
              onClick={copy}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition hover:opacity-90"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" /> Copy request template
                </>
              )}
            </button>
          </div>
          <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground/85">
{claim.emailTemplate}
          </pre>
        </div>
      </section>
    </div>
  );
}

/* ---------------- Approved ---------------- */

function ApprovedView({ claim }: { claim: Claim }) {
  return (
    <section className="rounded-2xl border border-approved/20 bg-approved-soft/40 p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-approved text-approved-foreground">
          <PartyPopper className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            You're all set — reimbursement approved
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Here are the details.
          </p>
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-card p-4">
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Amount
          </dt>
          <dd className="mt-1 text-lg font-semibold tabular-nums text-foreground">
            {currency(claim.amount)}
          </dd>
        </div>
        <div className="rounded-xl bg-card p-4">
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Payment method
          </dt>
          <dd className="mt-1 text-sm font-medium text-foreground">
            {claim.paymentMethod}
          </dd>
        </div>
        <div className="rounded-xl bg-card p-4">
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Deposit date
          </dt>
          <dd className="mt-1 text-sm font-medium text-foreground">
            {claim.depositDate}
          </dd>
        </div>
      </dl>
    </section>
  );
}
