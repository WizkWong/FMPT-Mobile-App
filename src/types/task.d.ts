import { Product, Part, PartProcedure } from "./productPart";
import { Status } from "./enum";
import { User } from "./user";

export interface Task {
  id?: number;
  orderId?: number;
  product?: Product;
  part?: Part;
  partProcedure?: PartProcedure;
  targetQuantity?: number;
  status?: Status;
  department?: string;
  startDateTime?: string;
  completeDateTime?: string;
  createdDateTime?: string;
}

export interface TaskPage {
  taskList: Task[];
  hasNext: boolean;
}

export interface TaskSchedule {
  id: number;
  partId: number;
  partName: string;
  stepNo: number;
  status: Status;
  department: string;
  startDateTime: string;
  completeDateTime: string;
}

export interface EmployeeTask {
  assignByManager?: User;
  employee: User;
}

export interface TaskDetail {
  task: Task;
  employeeTask: EmployeeTask[];
}
