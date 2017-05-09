import * as THREE from 'three';

export class Chess {
  private scene = new THREE.Scene();
  private camera: THREE.Camera;
  private renderer: THREE.Rendere;
  private size: { width: number, height: number };

  constructor(htmlElement: HTMLDivElement) {
    console.log(htmlElement);
    this.size = {
      width: htmlElement.clientWidth,
      height: htmlElement.clientHeight
    };

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.size.width, this.size.height);
    htmlElement.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(45, this.size.width / this.size.height, 0.1, 20000);
    this.camera.position.set(0, 6, 0);
    this.scene.add(this.camera);
  }
}
