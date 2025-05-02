export default interface TasksInterface {
  task_id: number | undefined;
  user_id: number | undefined;
  task_body: string | null;
  task_deadline: Date | string | null;
  is_task_done: boolean;
}