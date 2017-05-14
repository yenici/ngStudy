import { NgZone } from '@angular/core';
import * as THREE from 'three';
import { ThreeRenderer } from '../three-renderer/three-renderer';
import CONFIG from './checkers.config';
import { CheckerColors } from './checkers-colors.enume';
import { Board } from './board';
import { Piece } from './piece';

export class CheckersGame {
  private threeRenderer: ThreeRenderer;
  private pieces: Piece[] = [];
  private hoveredPiece: Piece;
  private selectedPiece: Piece;

  constructor(ngZone: NgZone, private containerElement: HTMLDivElement, config?) {
    this.threeRenderer = new ThreeRenderer(ngZone, this.containerElement, config);

    const group = new THREE.Group();
    group.add(new Board().mesh);

    for (let y = 0; y < CONFIG.board.size; y += 1) {
      for (let x = 0; x < CONFIG.board.size; x += 1) {
        if (y < CONFIG.board.lines || y >= CONFIG.board.size - CONFIG.board.lines) {
          if ((x + y) % 2 !== 0) {
            this.pieces.push(new Piece({ x, y }, (y > CONFIG.board.size / 2) ? CheckerColors.Dark : CheckerColors.Light));
            group.add(this.pieces[this.pieces.length - 1].mesh);
          }
        }
      }
    }

    this.threeRenderer.hoveredMesh.subscribe((mesh: THREE.Mesh | null) => {
      if (this.hoveredPiece) {
        if (this.hoveredPiece === this.selectedPiece) {
          return;
        }
      }

      if (this.hoveredPiece) {
        this.hoveredPiece.deactivate();
        this.hoveredPiece = null;
      }

      const activePiece = this.pieces.find(piece => piece.mesh === mesh);
      if (activePiece) {
        this.hoveredPiece = activePiece;
        activePiece.activate();
      }
    });

    this.threeRenderer.selectedMesh.subscribe((mesh: THREE.Mesh) => {
      if (this.selectedPiece && this.selectedPiece.mesh === mesh) {
        this.selectedPiece.unselect();
        this.selectedPiece = null;
        return;
      }

      this.selectedPiece = this.pieces.find(piece => piece.mesh === mesh);
      if (this.selectedPiece) {
        this.selectedPiece.select();
      }
    });

    this.threeRenderer.addObject(group);

    // this.pieces[8].activate();
    // window.setTimeout(() => {
    //   this.pieces[8].move({ x: 0, y: 3 });
    //   this.pieces[8].deactivate();
    // }, 3000);
  }

  destryoy() {
    this.threeRenderer.destroy();
  }
}
