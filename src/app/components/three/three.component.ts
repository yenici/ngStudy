import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chess } from './chess';

@Component({
  selector: 'app-three',
  templateUrl: './three.component.html',
  styleUrls: ['./three.component.css']
})
export class ThreeComponent implements OnInit {
  @ViewChild('chess') wrapperElement: ElementRef;
  private chess: Chess;

  constructor() { }

  ngOnInit() {
    // console.log(this.wrapperElement);
    // const e = this.wrapperElement.nativeElement as HTMLElement;
    // console.log(e);
    this.chess = new Chess(this.wrapperElement.nativeElement);
  }

}
