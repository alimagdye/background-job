export type ReportStatus = "pending" | "done" | "failed";

export type Report = {
  id: string;
  topic: string;
  status: ReportStatus;
  result?: string;
};

export const reports = new Map<string, Report>();
