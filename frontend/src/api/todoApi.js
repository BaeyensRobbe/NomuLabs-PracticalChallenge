import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/todos',  
});

export const getTodos = async () => {
  const { data } = await api.get('/');
  return data;
};

export const addTodo = async (todo) => {
  const title = todo.todo;
  const dueDate = todo.dueDate;
  const priority = todo.priority;

  const { data } = await api.post('/', { title, completed: false, dueDate, priority });
  return data;
};

export const deleteTodo = async (id) => {
  const { data } = await api.delete(`/${id}`);
  return data;
};

export const updateTodo = async (id, updates) => {
  const { data } = await api.put(`/${id}`, updates);
  return data;
};
