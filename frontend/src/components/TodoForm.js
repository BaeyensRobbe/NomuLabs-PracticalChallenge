import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, Select } from 'antd';
import moment from 'moment';


const { Option } = Select;

export const validateDueDate = async (rule, value) => {
  if (!value) {
    return Promise.resolve();
  }
  if (value < moment().startOf('day')) {
    return Promise.reject('Due date cannot be in the past');
  }
  return Promise.resolve();
};

const TodoForm = ({ onAdd }) => {
  const [form] = Form.useForm();

  

  const onFinish = async (values) => {
    onAdd(values);
    form.resetFields();
  };

  return (
    <Form form={form} layout="inline" onFinish={onFinish}>
      <Form.Item name="todo" rules={[{ required: true, message: 'Please input your todo!' }]}>
        <Input placeholder="Todo title" />
      </Form.Item>
      <Form.Item name="dueDate" rules={[{validator: validateDueDate}]}>
        <DatePicker placeholder="Select due date" />
      </Form.Item>
      <Form.Item name="priority">
        <Select placeholder="Select priority">
          <Option value="Low">Low</Option>
          <Option value="Medium">Medium</Option>
          <Option value="High">High</Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">Add</Button>
      </Form.Item>
    </Form>
  );
};

export default TodoForm;
