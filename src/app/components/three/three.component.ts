import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { ThreeRenderer } from './three-renderer/three-renderer';

import CONFIG from './checkers/checkers.config';
import { CheckerColors } from './checkers/checker.colors';
import { Board } from './checkers/board';
import { Piece } from './checkers/piece';

@Component({
  selector: 'app-three',
  templateUrl: './three.component.html',
  styleUrls: ['./three.component.css']
})
export class ThreeComponent implements OnInit {
  @ViewChild('chess') wrapperElement: ElementRef;
  private threeRenderer: ThreeRenderer;

  constructor() {}

  ngOnInit() {
    this.threeRenderer = new ThreeRenderer(this.wrapperElement.nativeElement, {renderer: {backgroundColor: '#10a9c4'}});
    const group = new THREE.Group();

    group.add(new Board().mesh);

    const b: Piece[] = [];
    for (let y = 0; y < CONFIG.board.size; y += 1) {
      for (let x = 0; x < CONFIG.board.size; x += 1) {
        if (y < CONFIG.board.lines || y >= CONFIG.board.size - CONFIG.board.lines) {
          if ((x + y) % 2 !== 0) {
            b.push(new Piece({ x, y }, (y > CONFIG.board.size / 2) ? CheckerColors.Dark : CheckerColors.Light));
            group.add(b[b.length - 1].mesh);
          }
        }
      }
    }
    // console.log(b[b.length - 1]);

    this.threeRenderer.addObject(group);
    window.setTimeout(() => {
      b[1].move({ x: 2, y: 1 });
    }, 3000);
  }

}
