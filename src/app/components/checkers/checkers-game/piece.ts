import * as THREE from 'three';
import CONFIG from './checkers.config';
import { CheckerColors } from './checkers-colors.enume';
import { CheckersPosition } from './checkers-position.interface';

const MATERIAL_TEMPLATE = {
  emissive: 0,
  specular: new THREE.Color(1, 1, 1),
  shading: THREE.SmoothShading,
  vertexColors: THREE.NoColors,
  transparent: true,
  opacity: CONFIG.piece.colors.opacity,
  depthTest: true,
  depthWrite: true,
  visible: true,
  side: THREE.FrontSide
};

const PIECE_MATERIALS = {
  [CheckerColors.Light]: new THREE.MeshPhongMaterial(Object
    .assign({}, MATERIAL_TEMPLATE, { color: CONFIG.piece.colors.light })),
  [CheckerColors.Dark]: new THREE.MeshPhongMaterial(Object
    .assign({}, MATERIAL_TEMPLATE, { color: CONFIG.piece.colors.dark })),
};

export class Piece {
  mesh: THREE.Mesh;

  constructor(public position: CheckersPosition = { x: 0, y: 0 }, public readonly color: CheckerColors) {
    this.mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(
        CONFIG.piece.shape.radius,
        CONFIG.piece.shape.radius,
        CONFIG.piece.shape.height,
        CONFIG.piece.shape.segments),
      PIECE_MATERIALS[this.color].clone()
    );
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.position.set(this.position.x * CONFIG.board.square.size, CONFIG.piece.shape.z,
      this.position.y * CONFIG.board.square.size);
    this.mesh.name =
      `Piece_${this.color === CheckerColors.Light ? 'light' : 'dark'}_${this.position.x}_${this.position.y}`;
  }

  move(position: CheckersPosition) {
    if (position) {
      this.position = position;
      this.mesh.position.set(position.x * CONFIG.board.square.size, CONFIG.piece.shape.z,
        position.y * CONFIG.board.square.size);
    }
  }

  activate(): void {
    this.mesh.material.color.setHex(CONFIG.piece.colors.active);
  }

  deactivate(): void {
    const color = this.color === CheckerColors.Light ? CONFIG.piece.colors.light : CONFIG.piece.colors.dark;
    this.mesh.material.color.setHex(color);
  }

  select(): void {
    this.mesh.material.color.setHex(CONFIG.piece.colors.selected);
  }

  unselect(): void {
    this.activate();
  }
}
