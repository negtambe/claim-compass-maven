export type ClaimStatus = "in_review" | "needs_action" | "denied" | "approved";

export type Step = {
  key: string;
  label: string;
};

export const CLAIM_STEPS: Step[] = [
  { key: "scan", label: "Scan Received" },
  { key: "verify", label: "Document Verification Complete" },
  { key: "financial", label: "Financial Review" },
  { key: "employer", label: "Employer Approval" },
  { key: "payment", label: "Payment Scheduled" },
];

export type ChecklistItem = {
  label: string;
  done: boolean;
};

export type Claim = {
  id: string;
  provider: string;
  service: string;
  date: string;
  amount: number;
  status: ClaimStatus;
  // in_review
  currentStepIndex?: number;
  etaBusinessDays?: number;
  // needs_action
  checklist?: ChecklistItem[];
  delayIfUnresolvedDays?: number;
  // denied
  denialReason?: string;
  nextSteps?: string[];
  emailTemplate?: string;
  // approved
  paymentMethod?: string;
  depositDate?: string;
};

export const CLAIMS: Claim[] = [
  {
    id: "cc-1042",
    provider: "Bay Area Family Medicine",
    service: "Annual physical",
    date: "Mar 12, 2026",
    amount: 284.5,
    status: "in_review",
    currentStepIndex: 2,
    etaBusinessDays: 4,
  },
  {
    id: "cc-1041",
    provider: "Northgate Imaging Center",
    service: "MRI — left knee",
    date: "Mar 8, 2026",
    amount: 1240.0,
    status: "needs_action",
    checklist: [
      { label: "Physician NPI", done: true },
      { label: "CPT code", done: false },
      { label: "Itemized receipt", done: false },
    ],
    delayIfUnresolvedDays: 8,
  },
  {
    id: "cc-1039",
    provider: "Sunset Orthopedics",
    service: "Follow-up consultation",
    date: "Feb 28, 2026",
    amount: 410.0,
    status: "denied",
    denialReason:
      "This claim was denied because the invoice reflected a bundled service, and your plan requires itemized CPT-level billing.",
    nextSteps: [
      "Ask your provider for an itemized receipt with individual CPT codes for each service performed.",
      "Once you have the itemized receipt, resubmit this claim — no new form needed, just upload the updated document.",
      "If your provider isn't sure what's needed, forward them the email template below.",
    ],
    emailTemplate:
      "Hi,\n\nCould you please send me an itemized receipt for my recent visit that lists each service with its individual CPT code and cost? My health plan requires CPT-level billing to process reimbursement.\n\nThank you!",
  },
  {
    id: "cc-1035",
    provider: "Clearwater Dermatology",
    service: "Skin screening",
    date: "Feb 14, 2026",
    amount: 195.0,
    status: "approved",
    paymentMethod: "Direct deposit — Chase ••4821",
    depositDate: "Feb 22, 2026",
  },
];

export function getClaim(id: string): Claim | undefined {
  return CLAIMS.find((c) => c.id === id);
}

export const STATUS_META: Record<
  ClaimStatus,
  { label: string; pill: string; dot: string }
> = {
  in_review: {
    label: "In Review",
    pill: "bg-review-soft text-review",
    dot: "bg-review",
  },
  needs_action: {
    label: "Needs Action",
    pill: "bg-action-soft text-action-foreground",
    dot: "bg-action",
  },
  denied: {
    label: "Denied",
    pill: "bg-denied-soft text-denied",
    dot: "bg-denied",
  },
  approved: {
    label: "Approved",
    pill: "bg-approved-soft text-approved",
    dot: "bg-approved",
  },
};
