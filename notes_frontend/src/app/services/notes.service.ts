import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Note, NoteInput } from '../models/note';

// PUBLIC_INTERFACE
@Injectable({ providedIn: 'root' })
export class NotesService {
  /** This is a public function. Lists notes for current user with optional search term. */
  async list(search?: string): Promise<Note[]> {
    const client: any = this.supabase.client as any;
    let query = client.from('notes').select('*').order('updated_at', { ascending: false });
    if (search && search.trim().length > 0) {
      const s = `%${search.trim()}%`;
      query = query.ilike('title', s).or(`content.ilike.${s}`);
    }
    const { data, error } = await query;
    if (error) throw error;
    return (data as Note[]) || [];
  }

  // PUBLIC_INTERFACE
  async get(id: string): Promise<Note | null> {
    /** This is a public function. Fetch single note by id. */
    const client: any = this.supabase.client as any;
    const { data, error } = await client.from('notes').select('*').eq('id', id).single();
    if (error) throw error;
    return data as Note;
  }

  // PUBLIC_INTERFACE
  async create(input: NoteInput): Promise<Note> {
    /** This is a public function. Create a new note for the current user. */
    const client: any = this.supabase.client as any;
    const { data: userData } = await client.auth.getUser();
    const user_id = userData?.user?.id;
    const payload = {
      user_id,
      title: input.title,
      content: input.content,
      tags: input.tags ?? [],
    };
    const { data, error } = await client.from('notes').insert(payload).select('*').single();
    if (error) throw error;
    return data as Note;
  }

  // PUBLIC_INTERFACE
  async update(id: string, input: NoteInput): Promise<Note> {
    /** This is a public function. Update note by id. */
    const client: any = this.supabase.client as any;
    const { data, error } = await client
      .from('notes')
      .update({ title: input.title, content: input.content, tags: input.tags ?? [] })
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return data as Note;
  }

  // PUBLIC_INTERFACE
  async remove(id: string): Promise<void> {
    /** This is a public function. Delete note by id. */
    const client: any = this.supabase.client as any;
    const { error } = await client.from('notes').delete().eq('id', id);
    if (error) throw error;
  }

  constructor(private supabase: SupabaseService) {}
}
