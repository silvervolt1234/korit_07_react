import axios, { AxiosRequestConfig } from "axios";

export interface Todo {
    id: number;
    text: string;
}

export const login = async (username: string, password: string) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { username, password });
    const token = res.headers['authorization']; 
    if (token) {
        sessionStorage.setItem('jwt', token);
    }
    return token;
};

const getAxiosConfig = (): AxiosRequestConfig => {
    let token = sessionStorage.getItem('jwt') || '';
    if (!token.startsWith('Bearer ')) {
        token = `Bearer ${token}`;
    }

    return {
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        }
    };
};

export const getTodo = async (): Promise<Todo[]> => { 
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/todos`, getAxiosConfig());
    console.log("Response:", response.data);
    return response.data;
}

export const deleteTodo = async (id: number): Promise<Todo> => {
    const response = await axios.delete(`${import.meta.env.VITE_API_URL}/todos/${id}`, getAxiosConfig());
    return response.data;
}

export const addTodo = async(text: string): Promise<Todo> => {      
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/todos`, { text }, getAxiosConfig());
    return response.data;
}