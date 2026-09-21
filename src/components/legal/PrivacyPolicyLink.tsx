"use client";

import { useId, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { LegalProse } from "@/components/legal/LegalProse";
import { PrivacyPolicyContent, PRIVACY_POLICY_EFFECTIVE_DATE } from "@/components/legal/PrivacyPolicyContent";

export function PrivacyPolicyLink({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`font-medium text-primary underline underline-offset-2 cursor-pointer ${className}`}
      >
        Privacy Policy
      </button>

      <Modal open={open} onClose={() => setOpen(false)} labelledBy={titleId}>
        <div className="p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent">Legal</p>
          <h2 id={titleId} className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
            Privacy Policy
          </h2>
          <p className="mt-2 text-sm text-foreground/60">
            Effective date: {PRIVACY_POLICY_EFFECTIVE_DATE}
          </p>

          <div className="mt-8">
            <LegalProse>
              <PrivacyPolicyContent />
            </LegalProse>
          </div>
        </div>
      </Modal>
    </>
  );
}
