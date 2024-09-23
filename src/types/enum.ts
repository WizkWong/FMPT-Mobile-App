export enum UserRole {
  EMPLOYEE = "EMPLOYEE",
  MANAGER = "MANAGER",
  ADMIN = "ADMIN",
}

export enum Status {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export namespace Status {
  export function toString(status: Status): string {
    return status === Status.NOT_STARTED
      ? "Not Started"
      : status === Status.IN_PROGRESS
      ? "In Progress"
      : status === Status.COMPLETED
      ? "Completed"
      : status === Status.CANCELLED
      ? "Cancelled"
      : "";
  }
}
