import type { FaqItem } from "@/lib/types";

// Homepage FAQ. Answers marked TODO are policy details Arnold must confirm;
// don't fill them in from guesses.
export const HOME_FAQ: FaqItem[] = [
  {
    id: "property-types",
    question: "What types of properties do you offer?",
    answer:
      "House & lot, condominiums, townhouses, single attached homes, lots & land, and commercial spaces across the Philippines.",
  },
  {
    id: "reservation-refund",
    question: "Is the reservation fee refundable?",
    answer: "[TODO: Arnold to confirm]",
  },
  {
    id: "downpayment",
    question: "How much do I need to prepare for the downpayment?",
    answer: "[TODO: Arnold to confirm]",
  },
  {
    id: "ofw-pagibig",
    question: "Can I use Pag-IBIG if I'm an OFW?",
    answer: "[TODO: Arnold to confirm]",
  },
  {
    id: "move-in",
    question: "How long before I can move in (RFO vs pre-selling)?",
    answer: "[TODO: Arnold to confirm]",
  },
  {
    id: "tripping",
    question: "Is the site viewing (tripping) free?",
    answer: "[TODO: Arnold to confirm]",
  },
];
