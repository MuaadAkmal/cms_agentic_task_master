import { z } from "zod";

// LSA options
export const LSAOptions = [
  "AP",
  "GJ",
  "KA",
  "KR",
  "MP",
  "MH",
  "MB",
  "OR",
  "TN",
] as const;

// Deduplicated TSP options
export const TSPOptions = [
  "Airtel",
  "BSNL",
  "MTNL",
  "Reliance",
  "Reliance Jio",
  "Tata",
  "Vodafone",
  "Citicom ILD",
  "P3 Tech ILD",
  "Reliance ILD/IPLC",
  "Sify ILD/IPLC",
  "Vodafone ILD/IPLC",
  "Airtel IPLC",
  "AT & T IPLC",
  "British Telecom IPLC",
  "Lightstorm IPLC",
  "Orange IPLC",
  "Singtel IPLC",
  "Sprint IPLC",
  "Telstra IPLC",
  "Verizon IPLC",
  "Ring Central VOIP",
  "None",
  "GCXG-IPLC",
] as const;

// DOT & LEA options
export const DotLeaOptions = [
  "DoT & LEA",
  "Dot",
  "CBDT",
  "CBI",
  "DOW/ED",
  "DRI",
  "NCB",
  "Police",
  "Police - CG",
  "IB",
  "RAW",
  "None",
] as const;

// Status options
export const StatusOptions = [
  "pending",
  "in progress",
  "resolved"
] as const;

// Zod schema
export const taskFormSchema = z.object({
  lsa: z.enum(LSAOptions),
  tsp: z.enum(TSPOptions),
  dotAndLea: z.enum(DotLeaOptions),
  problemDescription: z.string().min(10, {
    message: "Problem description must be at least 10 characters",
  }),
  status: z.enum(StatusOptions).default("pending"),
});

// TypeScript types
export type LSA = z.infer<typeof taskFormSchema>["lsa"];
export type TSP = z.infer<typeof taskFormSchema>["tsp"];
export type DotLea = z.infer<typeof taskFormSchema>["dotAndLea"];
export type Status = z.infer<typeof taskFormSchema>["status"];
export type TaskFormValues = z.infer<typeof taskFormSchema>;