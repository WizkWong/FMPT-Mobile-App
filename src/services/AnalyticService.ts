import axios, { AxiosResponse } from "axios";
import { setAuthorizationHeader } from "../utils/header";
import { Dashboard, EmployeeProductionRecord } from "../types/analytic";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 15000,
});

export const getDashboard = async (): Promise<AxiosResponse<Dashboard, any>> => {
  return api.get("/analytics", await setAuthorizationHeader());
}

export const getEmployeeProductionRecord = async (employeeId: number): Promise<AxiosResponse<EmployeeProductionRecord[], any>> => {
  return api.get(`/analytics/employees/${employeeId}`, await setAuthorizationHeader());
}
