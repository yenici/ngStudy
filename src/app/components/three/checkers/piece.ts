import * as THREE from 'three';
import CONFIG from './checkers.config';
import { CheckerColors } from './checker.colors';

const MATERIAL_TEMPLATE = {
  emissive: 0,
  specular: new THREE.Color(1, 1, 1),
  shiness: CONFIG.piece.colors.shiness,
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

  constructor(private position = { x: 0, y: 0 }, private color: CheckerColors) {
    this.mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(
        CONFIG.piece.shape.radius,
        CONFIG.piece.shape.radius,
        CONFIG.piece.shape.height,
        CONFIG.piece.shape.segments),
      PIECE_MATERIALS[this.color]
    );
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.position.set(this.position.x, CONFIG.piece.shape.z, this.position.y);
  }

  move(position: { x: number, y: number }) {
    if (position) {
      this.mesh.position.set(position.x, CONFIG.piece.shape.z, position.y);
    }
  }
}
