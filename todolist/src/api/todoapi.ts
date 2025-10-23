import axios, { AxiosRequestConfig } from "axios";

export interface Todo {
  id: number;
  text: string;
}

const getAxiosConfig = (): AxiosRequestConfig => {
  const token = sessionStorage.getItem("jwt");
  return {
    headers: {
      Authorization: token,
      "Content-Type": "application/json"
    }
  };
};

export const getTodo = async (): Promise<Todo[]> => {
  const response = await axios.get(`http://localhost:8080/api/todos`, getAxiosConfig());
  return response.data;
};

export const addTodo = async (text: string): Promise<Todo> => {
  const response = await axios.post(`http://localhost:8080/api/todos`, { text }, getAxiosConfig());
  return response.data;
};

export const deleteTodo = async (id: number): Promise<Todo> => {
  const response = await axios.delete(`http://localhost:8080/api/todos/${id}`, getAxiosConfig());
  return response.data;
};