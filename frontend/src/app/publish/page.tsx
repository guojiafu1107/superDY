'use client';

import { useState, useEffect } from 'react';
import { Card, Calendar, Badge, Button, List, Tag, Modal, Form, Input, DatePicker, TimePicker, Select, message, Empty } from 'antd';
import {
  PlusOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  VideoCameraOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import Layout from '@/components/Layout';
import { PublishTask } from '@/types';

const { TextArea } = Input;

// Mock publish tasks
const mockTasks: PublishTask[] = [
  {
    id: '1',
    userId: '1',
    accountId: '1',
    title: 'AI工具创作秘籍分享',
    hashtags: ['AI工具', '创作技巧', '效率神器'],
    scheduledAt: dayjs().add(1, 'day').set('hour', 18).set('minute', 30).toISOString(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    userId: '1',
    accountId: '1',
    title: '30天涨粉10万复盘',
    hashtags: ['涨粉攻略', '运营干货', '经验分享'],
    scheduledAt: dayjs().add(3, 'day').set('hour', 12).set('minute', 0).toISOString(),
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    userId: '1',
    accountId: '1',
    title: '短视频剪辑必学技巧',
    hashtags: ['剪辑教程', '新手必看', '技术流'],
    scheduledAt: dayjs().subtract(1, 'day').set('hour', 20).set('minute', 0).toISOString(),
    status: 'published',
    publishedAt: dayjs().subtract(1, 'day').set('hour', 20).set('minute', 0).toISOString(),
    douyinVideoId: '123456',
    createdAt: new Date().toISOString(),
  },
];

// Best time slots recommendation
const bestTimeSlots = [
  { time: '07:30', score: 85, reason: '早高峰通勤时段' },
  { time: '12:00', score: 92, reason: '午休高峰' },
  { time: '18:30', score: 95, reason: '晚高峰黄金时段' },
  { time: '21:00', score: 88, reason: '睡前浏览高峰' },
];

export default function PublishPage() {
  const [tasks, setTasks] = useState<PublishTask[]>(mockTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const handleCreateTask = (values: any) => {
    const scheduledAt = dayjs(values.date)
      .hour(values.time.hour())
      .minute(values.time.minute())
      .toISOString();
    
    const newTask: PublishTask = {
      id: Date.now().toString(),
      userId: '1',
      accountId: '1',
      title: values.title,
      hashtags: values.hashtags || [],
      scheduledAt,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    setTasks([...tasks, newTask]);
    setIsModalOpen(false);
    form.resetFields();
    message.success('发布任务已创建');
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    message.success('任务已删除');
  };

  const dateCellRender = (value: dayjs.Dayjs) => {
    const dateTasks = tasks.filter(
      task => dayjs(task.scheduledAt).format('YYYY-MM-DD') === value.format('YYYY-MM-DD')
    );
    
    return (
      <ul className="text-xs space-y-1">
        {dateTasks.map(task => (
          <li key={task.id}>
            <Badge
              status={task.status === 'published' ? 'success' : 'processing'}
              text={<span className="truncate block max-w-[80px]">{task.title}</span>}
            />
          </li>
        ))}
      </ul>
    );
  };

  const selectedDateTasks = tasks.filter(
    task => dayjs(task.scheduledAt).format('YYYY-MM-DD') === selectedDate.format('YYYY-MM-DD')
  );

  return (
    <Layout>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">智能发布排期</h1>
          <p className="text-gray-500">可视化内容日历，智能推荐最佳发布时间</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-[#fe2c55] to-[#ff6b8a] border-none"
        >
          新建发布任务
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm">
            <Calendar
              mode="month"
              dateCellRender={dateCellRender}
              onSelect={(date) => setSelectedDate(date)}
            />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Best Time Recommendation */}
          <Card
            title={
              <div className="flex items-center gap-2">
                <ThunderboltOutlined className="text-yellow-500" />
                <span>最佳发布时间</span>
              </div>
            }
            className="shadow-sm"
          >
            <div className="space-y-3">
              {bestTimeSlots.map((slot, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fe2c55] to-[#25f4ee] flex items-center justify-center text-white font-bold text-sm">
                      {slot.score}
                    </div>
                    <div>
                      <p className="font-medium">{slot.time}</p>
                      <p className="text-xs text-gray-500">{slot.reason}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Selected Date Tasks */}
          <Card
            title={
              <div className="flex items-center justify-between">
                <span>{selectedDate.format('MM月DD日')} 任务</span>
                <Tag color="blue">{selectedDateTasks.length} 个任务</Tag>
              </div>
            }
            className="shadow-sm"
          >
            {selectedDateTasks.length > 0 ? (
              <List
                dataSource={selectedDateTasks}
                renderItem={task => (
                  <List.Item
                    actions={[
                      <Button key="edit" type="text" icon={<EditOutlined />} />,
                      <Button key="delete" type="text" danger icon={<DeleteOutlined />} onClick={() => handleDeleteTask(task.id)} />,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          task.status === 'published' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          <VideoCameraOutlined />
                        </div>
                      }
                      title={task.title}
                      description={
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <ClockCircleOutlined />
                            {dayjs(task.scheduledAt).format('HH:mm')}
                          </div>
                          <div className="flex gap-1">
                            {task.hashtags.slice(0, 2).map(tag => (
                              <Tag key={tag} size="small">#{tag}</Tag>
                            ))}
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="该日暂无任务" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </div>
      </div>

      {/* Create Task Modal */}
      <Modal
        title="新建发布任务"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateTask}
          className="mt-4"
        >
          <Form.Item
            name="title"
            label="视频标题"
            rules={[{ required: true, message: '请输入视频标题' }]}
          >
            <Input placeholder="输入吸引人的标题..." />
          </Form.Item>

          <Form.Item
            name="hashtags"
            label="话题标签"
          >
            <Select
              mode="tags"
              placeholder="添加话题标签"
              tokenSeparators={[',']}
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="date"
              label="发布日期"
              rules={[{ required: true, message: '请选择日期' }]}
              initialValue={dayjs()}
            >
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item
              name="time"
              label="发布时间"
              rules={[{ required: true, message: '请选择时间' }]}
              initialValue={dayjs().set('hour', 18).set('minute', 30)}
            >
              <TimePicker className="w-full" format="HH:mm" />
            </Form.Item>
          </div>

          <Form.Item className="mb-0 flex justify-end gap-3">
            <Button onClick={() => setIsModalOpen(false)}>取消</Button>
            <Button type="primary" htmlType="submit" className="bg-[#fe2c55]">
              创建任务
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}
