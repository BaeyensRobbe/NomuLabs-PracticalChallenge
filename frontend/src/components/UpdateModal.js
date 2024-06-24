import React from 'react';
import { Modal, Form, Input, Button, DatePicker, Select } from 'antd';
import moment from 'moment'; 
import {validateDueDate} from './TodoForm'

const { Option } = Select;

const UpdateModal = ({ visible, todo, onUpdate, onCancel }) => {
  const [form] = Form.useForm();

  if (!todo) {
    return null; 
  } 

  form.setFieldsValue({
    title: todo.title,
    dueDate: todo.dueDate ? moment(todo.dueDate) : null,
    priority: todo.priority,
  });

  

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onUpdate(values);
      })
      .catch((errorInfo) => {
        console.log('Validation failed:', errorInfo);
      });
  };

  const validateDueDate = async (rule, value) => {
    if (!value) {
      return Promise.resolve();
    }
    if (value < moment()) {
      return Promise.reject('Due date cannot be in the past');
    }
    return Promise.resolve();
  };

  return (
    <Modal
      title="Update Todo"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Update
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please enter a title' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item 
          name="dueDate"
          label="Due Date"
          rules= {[{validator: validateDueDate}]} >
          <DatePicker />
        </Form.Item>
        <Form.Item name="priority" label="Priority">
          <Select>
            <Option value="Low">Low</Option>
            <Option value="Medium">Medium</Option>
            <Option value="High">High</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateModal;
