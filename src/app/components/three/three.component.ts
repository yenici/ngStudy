import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { Chess } from './chess';
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
  // private chess: Chess;

  constructor() {}

  ngOnInit() {
    this.threeRenderer = new ThreeRenderer(this.wrapperElement.nativeElement, {renderer: {backgroundColor: '#10a9c4'}});
    const group = new THREE.Group();

    // const boardMaterial = new Array(6)
    //   .fill(new THREE.MeshBasicMaterial({ color: 0xc0c0c0, transparent: false, opacity: 0 }));
    // const board  = new THREE.Mesh(new THREE.CubeGeometry(boardSize + 1, 0.1, boardSize + 1), new THREE.MeshFaceMaterial(boardMaterial));
    // board.position.set(0, -0.01, 0);
    // group.add(board);

    // const board = new Board();
    group.add(new Board().mesh);

    // group.add(new Piece({ x: 0, y: 0 }, CheckerColors.Dark).mesh);
    // group.add(new Piece({ x: 1, y: 1 }, CheckerColors.Light).mesh);
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

    // console.log(group);
    this.threeRenderer.addObject(group);
    window.setTimeout(() => {
      b[12].move({ x: 0, y: 4 });
      // group.add(new Piece({ x: 4, y: 4 }, CheckerColors.Dark).mesh);
    }, 3000);
    // this.chess = new Chess(this.wrapperElement.nativeElement);
  }

}
