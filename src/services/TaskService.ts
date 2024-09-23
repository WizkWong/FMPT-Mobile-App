import axios, { AxiosResponse } from "axios";
import { setAuthorizationHeader } from "../utils/header";
import { EmployeeTask, Task, TaskDetails, TaskPage } from "../types/task";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

export const getTaskByFilter = async (page: number, search: string, department: string): Promise<AxiosResponse<TaskPage, any>> => {
  return api.get(`/tasks?page=${page}&search=${search}&department=${department}`, await setAuthorizationHeader());
}

export const getTaskById = async (id: number): Promise<AxiosResponse<TaskDetails, any>> => {
  return api.get(`/tasks/${id}`, await setAuthorizationHeader());
}

export const getEmployeeTaskByFilter = async (page: number, search: string): Promise<AxiosResponse<TaskPage, any>> => {
  return api.get(`/tasks/employees?page=${page}&search=${search}`, await setAuthorizationHeader());
}

export const createEmployeeTask = async (id: number, employeeIdList: EmployeeTask[]): Promise<AxiosResponse<any, any>> => {
  return api.post(`/tasks/${id}/employees`, employeeIdList, await setAuthorizationHeader());
}

export const patchTask = async (id: number, task: Task): Promise<AxiosResponse<any, any>> => {
  return api.patch(`/tasks/${id}/employees`, task, await setAuthorizationHeader());
}