import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Note } from '../../models/note';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css']
})
export class NoteListComponent {
  @Input() notes: Note[] = [];
  @Output() select = new EventEmitter<Note>();
  @Output() delete = new EventEmitter<Note>();

  onSelect(n: Note): void { this.select.emit(n); }
  onDelete(n: Note, e: any): void { if (e?.stopPropagation) e.stopPropagation(); this.delete.emit(n); }
}
