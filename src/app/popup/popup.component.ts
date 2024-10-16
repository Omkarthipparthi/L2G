import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss'
})
export class PopupComponent {
  status = 'Ready';
  isEnabled = true;

  toggleExtension() {
    this.isEnabled = !this.isEnabled;
    // TODO: Implement logic to enable/disable extension functionality
  }
}
