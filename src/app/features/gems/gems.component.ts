import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { GemsStore } from '../../store/gems.store';

@Component({
  selector: 'app-gems',
  standalone: true,
  imports: [NgFor],
  templateUrl: './gems.component.html',
  styleUrl: './gems.component.scss',
})
export class GemsComponent {
  gemsStore = inject(GemsStore);
}
