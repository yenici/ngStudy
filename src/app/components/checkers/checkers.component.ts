import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CheckersGame } from './checkers-game/checkers-game';

@Component({
  selector: 'app-checkers',
  templateUrl: './checkers.component.html',
  styleUrls: ['./checkers.component.css']
})
export class CheckersComponent implements OnInit, OnDestroy {
  @ViewChild('chess') wrapperElement: ElementRef;
  private checkersGame: CheckersGame;

  constructor(private ngZone: NgZone) { }

  ngOnInit() {
    this.checkersGame = new CheckersGame(
      this.ngZone,
      this.wrapperElement.nativeElement,
      { renderer: { backgroundColor: '#10a9c4' } });
  }

  ngOnDestroy() {
    this.checkersGame.destryoy();
  }

}
