import axios, { AxiosResponse } from "axios";
import { setAuthorizationHeader } from "../utils/header";
import { Order, OrderPage } from "../types/order";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

export const getOrderByFilter = async (page: number, search: string): Promise<AxiosResponse<OrderPage, any>> => {
  return api.get(`/orders?page=${page}&search=${search}`, await setAuthorizationHeader());
}

export const getOrderById = async (id: number): Promise<AxiosResponse<Order, any>> => {
  return api.get(`/orders/${id}`, await setAuthorizationHeader());
}

export const createOrder = async (order: Order): Promise<AxiosResponse<any, any>> => {
  return api.post('/orders', order, await setAuthorizationHeader());
}