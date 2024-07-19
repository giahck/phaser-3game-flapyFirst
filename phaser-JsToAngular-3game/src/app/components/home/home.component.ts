import { Component } from '@angular/core';
import { PhaserGameComponent } from "../phaser-game/phaser-game.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PhaserGameComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
