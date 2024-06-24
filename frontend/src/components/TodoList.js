import React, { useState } from 'react';
import { List, Button } from 'antd';
import { updateTodo } from '../api/todoApi';
import { useMutation, useQueryClient } from 'react-query';
import UpdateModal from './UpdateModal';
import moment from 'moment';

const TodoList = ({ todos, onDelete }) => {
  const queryClient = useQueryClient();
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [hoveredTodo, setHoveredTodo] = useState(null);

  const handleToggleComplete = async (id, currentIsCompleted) => {
    try {
      const updatedTodo = { ...todos.find(todo => todo._id === id), completed: !currentIsCompleted };
      await updateTodo(id, updatedTodo);
      queryClient.invalidateQueries('todos');
    } catch (error) {
      console.error('Error toggling todo completion:', error);
    }
  };

  const handleOpenUpdateModal = (todo) => {
    setSelectedTodo(todo);
    setUpdateModalVisible(true);
  };

  const handleCloseUpdateModal = () => {
    setSelectedTodo(null);
    setUpdateModalVisible(false);
  };

  const handleUpdateTodo = async (values) => {
    try {
      const updatedTodo = { ...selectedTodo, ...values };
      await updateTodo(selectedTodo._id, updatedTodo);
      queryClient.invalidateQueries('todos');
      setUpdateModalVisible(false);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const renderDueDate = (dueDate) => {
    const formattedDueDate = moment(dueDate).format('YY-MM-DD');
    const formattedCurrentDate = moment().format('YY-MM-DD');
    
    // Check if the due date is today or in the past
    if (moment(formattedDueDate, 'YY-MM-DD').isSameOrBefore(moment(formattedCurrentDate, 'YY-MM-DD'), 'day')) {
      return <span style={{ color: 'red' }}>{formattedDueDate}</span>;
    } else {
      return <span>{formattedDueDate}</span>;
    }
  };

  return (
    <>
      <List
        bordered
        dataSource={todos}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button onClick={() => handleOpenUpdateModal(item)}>Update</Button>,
              <Button onClick={() => onDelete(item._id)}>Delete</Button>,
            ]}
            onMouseEnter={() => setHoveredTodo(item)}
            onMouseLeave={() => setHoveredTodo(null)}
            style={{ backgroundColor: hoveredTodo === item ? '#f0f0f0' : 'inherit' }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span
                style={{
                  marginRight: '10px',
                  display: 'inline-block',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: item.completed ? 'green' : 'red',
                  cursor: 'pointer',
                }}
                onClick={() => handleToggleComplete(item._id, item.completed)}
              ></span>
              <div style={{ flex: 1 }}>
                <div><strong>Name: </strong>{item.title}</div>
                {item.dueDate && (
                  <div style={{ marginTop: '5px' }}>
                    <strong>Due Date:</strong> {renderDueDate(item.dueDate)}
                  </div>
                )}
                {item.priority && (
                  <div style={{ marginTop: '5px' }}>
                    <strong>Priority:</strong> {item.priority}
                  </div>
                )}
              </div>
            </div>
          </List.Item>
        )}
      />
      
      {/* Update Modal */}
      <UpdateModal
        visible={updateModalVisible}
        todo={selectedTodo}
        onUpdate={handleUpdateTodo}
        onCancel={handleCloseUpdateModal}
      />
    </>
  );
};

export default TodoList;
