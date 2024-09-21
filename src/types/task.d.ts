import { Product, Part, PartProcedure } from "./productPart";
import { Status } from "./enum";
import { User } from "./user";

export interface Task {
  id: number;
  orderId: number;
  product: Product;
  part: Part;
  partProcedure: PartProcedure;
  targetQuantity: number;
  status: Status;
  department: string;
  startDateTime: string;
  completeDateTime: string;
  createdDateTime: string;
}

export interface TaskPage {
  taskList: Task[];
  hasNext: boolean;
}

export interface EmployeeTask {
  assignByManager: User;
  employeeList: User[];
}

export interface TaskDetails {
  task: Task;
  employeeTask: EmployeeTask;
}
