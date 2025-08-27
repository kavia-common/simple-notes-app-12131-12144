import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Note, NoteInput } from '../../models/note';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-note-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './note-editor.component.html',
  styleUrls: ['./note-editor.component.css']
})
export class NoteEditorComponent {
  @Input() open = false;
  @Input() note: Note | null = null;
  @Output() cancel = new EventEmitter<void>();
  @Output() save = new EventEmitter<NoteInput>();

  title = '';
  content = '';
  tags = '';

  ngOnChanges(): void {
    if (this.note) {
      this.title = this.note.title;
      this.content = this.note.content;
      this.tags = this.note.tags?.join(', ') || '';
    } else {
      this.title = '';
      this.content = '';
      this.tags = '';
    }
  }

  onCancel(): void { this.cancel.emit(); }

  onSave(): void {
    const payload: NoteInput = {
      title: this.title.trim(),
      content: this.content.trim(),
      tags: this.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    this.save.emit(payload);
  }
}
