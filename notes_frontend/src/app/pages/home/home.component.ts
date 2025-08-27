import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { NoteListComponent } from '../../components/note-list/note-list.component';
import { NoteEditorComponent } from '../../components/note-editor/note-editor.component';
import { NotesService } from '../../services/notes.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Note, NoteInput } from '../../models/note';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent, NoteListComponent, NoteEditorComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  notes: Note[] = [];
  filteredNotes: Note[] = [];
  allTags: string[] = [];
  loading = false;
  editorOpen = false;
  editingNote: Note | null = null;

  constructor(private notesService: NotesService, private auth: AuthService, private router: Router) {}

  async ngOnInit() {
    const user = await this.auth.user$.toPromise();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    this.refresh();
  }

  async refresh(search?: string) {
    try {
      this.loading = true;
      this.notes = await this.notesService.list(search);
      this.filteredNotes = this.notes;
      this.allTags = Array.from(new Set(this.notes.flatMap(n => n.tags || []))).sort();
    } finally {
      this.loading = false;
    }
  }

  onSearch(term: string) {
    this.refresh(term);
  }

  onCreate() {
    this.editingNote = null;
    this.editorOpen = true;
  }

  onSelect(note: Note) {
    this.editingNote = note;
    this.editorOpen = true;
  }

  onDelete(note: Note) {
    const shouldDelete = (typeof (globalThis as any).confirm === 'function')
      ? (globalThis as any).confirm('Delete this note?')
      : true;
    if (shouldDelete) {
      this.notesService.remove(note.id).then(() => this.refresh());
    }
  }

  onCancelEditor() {
    this.editorOpen = false;
    this.editingNote = null;
  }

  async onSaveEditor(input: NoteInput) {
    if (this.editingNote) {
      await this.notesService.update(this.editingNote.id, input);
    } else {
      await this.notesService.create(input);
    }
    this.onCancelEditor();
    this.refresh();
  }

  async onLogout() {
    await this.auth.signOut();
    this.router.navigate(['/login']);
  }
}
