import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Output() create = new EventEmitter<void>();
  @Output() searchChange = new EventEmitter<string>();

  onCreate(): void {
    this.create.emit();
  }

  onSearch(e: any): void {
    const value = (e?.target as any)?.value ?? '';
    this.searchChange.emit(value);
  }
}
