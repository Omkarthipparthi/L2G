import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  repository = '';
  token = '';

  saveSettings() {
    // TODO: Implement logic to save settings to Chrome storage
    console.log('Saving settings:', this.repository, this.token);
  }
}
