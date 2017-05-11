import * as THREE from 'three';
import CONFIG from './checkers.config';
import { CheckerColors } from './checkers-colors.enume';

const MATERIAL_TEMPLATE = {
  emissive: 0,
  specular: new THREE.Color(1, 1, 1),
  shading: THREE.SmoothShading,
  vertexColors: THREE.NoColors,
  transparent: true,
  opacity: CONFIG.board.square.opacity,
  depthTest: true,
  depthWrite: true,
  visible: true,
  side: THREE.FrontSide
};

const SQUARE_MATERIALS = {
  [CheckerColors.Light]:
    new THREE.MeshPhongMaterial(Object.assign({}, MATERIAL_TEMPLATE, { color: CONFIG.board.square.light })),
  [CheckerColors.Dark]:
    new THREE.MeshPhongMaterial(Object.assign({}, MATERIAL_TEMPLATE, { color: CONFIG.board.square.dark }))
};

export class Board {
  mesh: THREE.Group;

  private static isDark(x: number, y: number): boolean {
    return (x + y) % 2 !== 0;
  }

  constructor() {
    this.mesh = new THREE.Group();
    this.createBox();
    this.createSquares();
  }

  private createBox(): void {
    const boxMaterial = new THREE.MeshPhongMaterial(Object.assign(
      {},
      MATERIAL_TEMPLATE,
      {
        color: CONFIG.board.box.color,
        opacity: CONFIG.board.box.opacity
      }));
    const boxLength = CONFIG.board.size * CONFIG.board.square.size + 2 * CONFIG.board.box.margin;
    const box = new THREE.Mesh(new THREE.CubeGeometry(boxLength, CONFIG.board.square.height, boxLength), boxMaterial);
    box.name = 'Checkers\' box';
    const correction = boxLength / 2 - CONFIG.board.square.size / 2 - CONFIG.board.box.margin;
    box.position.set(correction, - CONFIG.board.square.height / 20, correction);
    this.mesh.add(box);
  }

  private createSquares(): void {
    let square: THREE.Mesh;
    let isDark: boolean;
    for (let y = 0; y < CONFIG.board.size; y += 1) {
      for (let x = 0; x < CONFIG.board.size; x += 1) {
        isDark = Board.isDark(x, y);
        square = new THREE.Mesh(
          new THREE.CubeGeometry(CONFIG.board.square.size, CONFIG.board.square.height, CONFIG.board.square.size),
          isDark ? SQUARE_MATERIALS[CheckerColors.Dark] : SQUARE_MATERIALS[CheckerColors.Light]);
        square.castShadow = true;
        square.receiveShadow = true;
        square.position.set(x * CONFIG.board.square.size, 0, y * CONFIG.board.square.size);
        square.name = `Square_${isDark ? 'dark' : 'light'}_${x}_${y}`;
        this.mesh.add(square);
      }
    }
  }
}
