import axios, { AxiosResponse } from "axios";
import { setAuthorizationHeader } from "../utils/header";
import { Product, ProductDetails, ProductPage } from "../types/productPart";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

export const getProductByFilter = async (page: number, search: string): Promise<AxiosResponse<ProductPage, any>> => {
  return api.get(`/products?page=${page}&search=${search}`, await setAuthorizationHeader());
}

export const getProductById = async (id: number): Promise<AxiosResponse<ProductDetails, any>> => {
  return api.get(`/products/${id}`, await setAuthorizationHeader());
}

export const createProduct = async (productDetails: ProductDetails): Promise<AxiosResponse<any, any>> => {
  return api.post('/products', productDetails, await setAuthorizationHeader());
}

export const deleteProduct = async (id: number): Promise<AxiosResponse<any, any>> => {
  return api.delete(`/products/${id}`, await setAuthorizationHeader());
}