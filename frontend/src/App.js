import React, {useState} from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getTodos, addTodo, deleteTodo } from './api/todoApi';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import { Layout, Typography, Divider, Select } from 'antd';

const { Header, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const App = () => {
  const queryClient = useQueryClient();
  const [sortCriteria, setSortCriteria] = useState('dueDate');
  const [searchValue, setSearchValue] = useState('');

  const { data: todos, isLoading } = useQuery('todos', getTodos, {
  });

  const addTodoMutation = useMutation(addTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries('todos');
    }
  });

  const deleteTodoMutation = useMutation(deleteTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries('todos');
    }
  });

  const handleAddTodo = (todo) => {
    addTodoMutation.mutate(todo);
  };

  const handleDeleteTodo = (id) => {
    deleteTodoMutation.mutate(id);
  };

  const priorityOrder = { High: 1, Medium: 2, Low: 3, null: 4 };

  const sortedTodos = todos?.slice().sort((a, b) => {
    switch (sortCriteria) {
      case 'date':
        const dateA = a.dueDate ? new Date(a.dueDate) : new Date(9999, 11, 31);
        const dateB = b.dueDate ? new Date(b.dueDate) : new Date(9999, 11, 31);
        return dateA - dateB;
      case 'priority':
        return (priorityOrder[a.priority] ?? 4) - (priorityOrder[b.priority] ?? 4);
      case 'completed':
        return a.completed - b.completed;
      default:
        return 0;
    }
  });

  const handleSortChange = (value) => {
    setSortCriteria(value);
  };


  if (isLoading) return <div>Loading...</div>;

  return (
    <Layout>
      <Header>
        <Title style={{ color: 'white' }}>Todo App</Title>
      </Header>
      <Content style={{ padding: '20px' }}>
        <TodoForm onAdd={handleAddTodo} />
        <Divider />
        <Select
          defaultValue="date"
          style={{ width: 200, marginBottom: 16 }}
          onChange={handleSortChange}
        >
          <Option value="date">Sort by Due date</Option>
          <Option value="priority">Sort by Priority</Option>
          <Option value="completed">Sort by Completion</Option>
        </Select>
        <TodoList todos={sortedTodos} onDelete={handleDeleteTodo} />
      </Content>
    </Layout>
  );
};

export default App;
