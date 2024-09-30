import { Part } from "./productPart";

export interface Dashboard {
  orderCompletionList: OrderCompletion[];
  departmentScoreList: DepartmentScore[];
  totalActiveTask: TotalActiveTask;
}

export interface OrderCompletion {
  orderId: number;
  productName: string;
  quantity: number;
  percentage: number;
  deadlineDate: string;
}

export interface DepartmentScore {
  department: string;
  meanScore: number;
  medianScore: number;
}

export interface TotalActiveTask {
  notStarted: number;
  inProgress: number;
  pending: number;
}

export interface EmployeeProductionRecord {
  part: Part;
  productionTaskScoreList: ProductionTaskScore[];
}

export interface ProductionTaskScore {
  quantity: number;
  startDateTime: string;
  completeDateTime: string;
  score: number;
}
