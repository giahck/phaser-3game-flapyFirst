import { Component, OnInit } from '@angular/core';
import { initializeGame } from './js/game';
@Component({
  selector: 'app-phaser-game',
  standalone: true,
  imports: [],
  templateUrl: './phaser-game.component.html',
  styleUrls: ['./phaser-game.component.scss']
})
export class PhaserGameComponent implements OnInit {
  constructor() { }
  ngOnInit(): void {
    initializeGame() ;
  }

}
