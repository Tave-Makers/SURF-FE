import { axiosInstance } from '@/shared/lib/axiosInstance';

export async function deletePostSchedule(postId: number, scheduleId: number): Promise<void> {
  try {
    await axiosInstance.delete(`/v1/admin/posts/${postId}/schedules/${scheduleId}`);
  } catch (error) {
    console.error('Error deleting post-schedule :', error);
    throw error;
  }
}
