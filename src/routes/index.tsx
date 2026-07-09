import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, ChevronRight } from "lucide-react";
import { CLAIMS, STATUS_META } from "@/lib/claims-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Claim Compass — See exactly where your claim stands" },
      {
        name: "description",
        content:
          "A calm, step-by-step tracker for healthcare reimbursement claims. No more black-box 'Processing'.",
      },
      { property: "og:title", content: "Claim Compass" },
      {
        property: "og:description",
        content: "See exactly where your claim stands, every step of the way.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function currency(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-card/60 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Claim Compass</div>
            <div className="text-base font-semibold text-foreground">Hi, Alex</div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Your claims
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tap any claim to see exactly where it stands.
          </p>
        </div>

        <ul className="space-y-3">
          {CLAIMS.map((c) => {
            const meta = STATUS_META[c.status];
            const needsCount =
              c.status === "needs_action"
                ? c.checklist?.filter((i) => !i.done).length ?? 0
                : 0;
            return (
              <li key={c.id}>
                <Link
                  to="/claims/$id"
                  params={{ id: c.id }}
                  className="group block rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition hover:border-primary/30 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="truncate text-base font-medium text-foreground">
                        {c.provider}
                      </div>
                      <div className="mt-0.5 truncate text-sm text-muted-foreground">
                        {c.service} · {c.date}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-semibold text-foreground tabular-nums">
                        {currency(c.amount)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${meta.pill}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                        {meta.label}
                      </span>
                      {needsCount > 0 && (
                        <span className="rounded-full bg-action/15 px-2 py-0.5 text-xs font-medium text-action-foreground">
                          {needsCount} item{needsCount > 1 ? "s" : ""} needed
                        </span>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
