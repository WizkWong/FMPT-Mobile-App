import axios, { AxiosResponse } from "axios";
import { setAuthorizationHeader } from "../utils/header";
import { Part, PartPage, PartProcedure } from "../types/productPart";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

export const getPartByFilter = async (page: number, search: string): Promise<AxiosResponse<PartPage, any>> => {
  return api.get(`/parts?page=${page}&search=${search}`, await setAuthorizationHeader());
}

export const getPartById = async (id: number): Promise<AxiosResponse<Part, any>> => {
  return api.get(`/parts/${id}`, await setAuthorizationHeader());
}

export const createPart = async (part: Part): Promise<AxiosResponse<any, any>> => {
  return api.post('/parts', part, await setAuthorizationHeader());
}

export const deletePart = async (id: number): Promise<AxiosResponse<any, any>> => {
  return api.delete(`/parts/${id}`, await setAuthorizationHeader());
}

export const getPartProcedureById = async (id: number): Promise<AxiosResponse<PartProcedure, any>> => {
  return api.get(`/parts/procedures/${id}`, await setAuthorizationHeader());
}

export const getPartProcedureByPartId = async (partId: number): Promise<AxiosResponse<PartProcedure[], any>> => {
  return api.get(`/parts/${partId}/procedures`, await setAuthorizationHeader());
}

export const createPartProcedure = async (partId: number, partProcedure: PartProcedure): Promise<AxiosResponse<any, any>> => {
  return api.post(`/parts/${partId}/procedures`, partProcedure, await setAuthorizationHeader());
}

export const updatePartProcedure = async (partId: number, partProcedure: PartProcedure): Promise<AxiosResponse<any, any>> => {
  return api.put(`/parts/${partId}/procedures`, partProcedure, await setAuthorizationHeader());
}

export const deletePartProcedure = async (partId: number, id: number): Promise<AxiosResponse<any, any>> => {
  return api.delete(`/parts/${partId}/procedures/${id}`, await setAuthorizationHeader());
}