import { supabase } from '@/lib/supabaseClient';

export type Attachment = { id: string; url: string; name?: string };

export default class TaskViewModel {
  private task: any = null;

  constructor(initial?: any) {
    this.task = initial ?? null;
  }

  getTaskForEdit() {
    return this.task;
  }

  async uploadAttachment(file: File): Promise<Attachment> {
    // Store in Supabase storage bucket named 'attachments' (create this bucket in your Supabase project)
    const path = `attachments/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from('attachments').upload(path, file as any);
    if (error) throw error;
    const { data: urlData } = supabase.storage.from('attachments').getPublicUrl(data.path);
    return { id: data.path, url: urlData.publicUrl, name: file.name };
  }

  async saveTask(task: any) {
    if (task?.id) {
      const { data, error } = await supabase.from('tasks').update(task).eq('id', task.id).select().single();
      if (error) throw error;
      this.task = data;
      return data;
    }
    const { data, error } = await supabase.from('tasks').insert(task).select().single();
    if (error) throw error;
    this.task = data;
    return data;
  }

  async saveDraft(task: any) {
    localStorage.setItem('task-draft', JSON.stringify(task));
  }

  startVoiceInput?(field: 'title' | 'description') {
    console.log('startVoiceInput', field);
  }

  async getAvailableTags() {
    const { data, error } = await supabase.from('tags').select('*');
    if (error) return [{ id: '1', name: 'Personal' }, { id: '2', name: 'Work' }];
    return data;
  }

  async fetchTaskById(id: string) {
    const { data } = await supabase.from('tasks').select('*').eq('id', id).single();
    return data;
  }

  async getComments(taskId: string) {
    const { data } = await supabase.from('comments').select('*').eq('task_id', taskId).order('created', { ascending: true });
    return data;
  }

  async addComment(taskId: string, text: string) {
    const { data } = await supabase.from('comments').insert({ task_id: taskId, text }).select().single();
    return data;
  }

  async getTaskHistory(taskId: string) {
    const { data } = await supabase.from('task_history').select('*').eq('task_id', taskId).order('date', { ascending: false });
    return data;
  }

  async getRelatedTasks(taskId: string) {
    // naive: fetch the task, then find other tasks sharing tags
    const t = await this.fetchTaskById(taskId);
    if (!t?.tags?.length) return [];
    const { data } = await supabase.from('tasks').select('*').contains('tags', t.tags).neq('id', taskId).limit(10);
    return data || [];
  }

  async shareTask(taskId: string) {
    // generate a simple public URL - in production generate signed URL or create share record
    return `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/tasks/${taskId}`;
  }

  renderMarkdown(md: string) {
    // minimal markdown: convert newlines to <p> and **bold** to <strong>
    if (!md) return '';
    return md.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>');
  }
}
