import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { TokenStorage } from "../storage/TokenStorage";

export class ApiClient {
  private static instance: AxiosInstance | null = null;
  private static tokenStorage: TokenStorage;

  static initialize() {
    if (!ApiClient.instance) {
      if (!ApiClient.tokenStorage) {
        ApiClient.tokenStorage = new TokenStorage();
      }

      ApiClient.instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3333",
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Interceptador de requisição - adiciona token
      ApiClient.instance.interceptors.request.use(
        (config) => {
          // Sempre pega o token atualizado do localStorage
          const token = ApiClient.tokenStorage.getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );

      // Interceptador de resposta - trata erros
      ApiClient.instance.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response?.status === 401) {
            // Token expirado ou inválido
            ApiClient.tokenStorage.removeToken();
            // Aqui você pode redirecionar para login
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
          }
          return Promise.reject(error);
        }
      );
    }
    return ApiClient.instance;
  }

  static get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return ApiClient.initialize().get<T>(url, config);
  }

  static post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return ApiClient.initialize().post<T>(url, data, config);
  }

  static put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return ApiClient.initialize().put<T>(url, data, config);
  }

  static delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return ApiClient.initialize().delete<T>(url, config);
  }

  static setToken(token: string) {
    if (!ApiClient.tokenStorage) {
      ApiClient.tokenStorage = new TokenStorage();
    }
    ApiClient.tokenStorage.setToken(token);
  }

  static getToken(): string | null {
    if (!ApiClient.tokenStorage) {
      ApiClient.tokenStorage = new TokenStorage();
    }
    return ApiClient.tokenStorage.getToken();
  }

  static removeToken() {
    if (!ApiClient.tokenStorage) {
      ApiClient.tokenStorage = new TokenStorage();
    }
    ApiClient.tokenStorage.removeToken();
  }
}
