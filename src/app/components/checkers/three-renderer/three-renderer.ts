/* globals File */

/**
 * @class
 * @name ThreeRenderer
 * @description Represents a 3D objects viewer
 * @requires lodash
 * @requires three
 * @requires screenfull
 * @requires three-orbit-controls
 * @requires HelperService
 *
 */

import { NgZone } from '@angular/core/src/zone';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { merge } from 'lodash';
import * as THREE from 'three';
import ScreenFull from 'screenfull';
import OrbitControls from 'three-orbit-controls';
import RENDERER_CONFIG from './three-renderer.config';

THREE.OrbitControls = OrbitControls(THREE);
THREE.OrbitControls.prototype.constructor = THREE.OrbitControls;

export class ThreeRenderer {
  public hoveredMesh = new BehaviorSubject<THREE.Mesh>(null);
  public selectedMesh = new Subject<THREE.Mesh>();

  private config = RENDERER_CONFIG;
  private dimensions: { width: number, height: number };
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private cameraControl: THREE.OrbitControls;
  private animationFrameId: any;
  private mesh: THREE.Group;

  private resizeCanvas: () => void | null;

  private raycaster = new THREE.Raycaster();
  private intersectedObject: THREE.Mesh;
  private mouseMoveListener = (event: MouseEvent) => this.onMouseMove(event);
  private mouseClickListener = (event: MouseEvent) => this.onMouseClick(event);

  /**
   * Create a viewer
   * @param {NgZone} ngZone
   * @param {HTMLDivElement} containerElement - container element
   * @param {Object} config - viewer's configuration parameters
   *
   * @constructor
   */
  constructor(private ngZone: NgZone, private containerElement: HTMLDivElement, config?) {
    this.config = merge({}, RENDERER_CONFIG, config);
    this.dimensions = {
      width: this.containerElement.clientWidth || this.config.container.defaultWidth,
      height: this.containerElement.clientHeight || this.config.container.defaultHeight
    };
    this.initRenderer();
    this.initLight();
    this.initCamera();

    this.containerElement.addEventListener('mousemove', this.mouseMoveListener, false);
    this.containerElement.addEventListener('click', this.mouseClickListener, false);
  }

  /**
   * Add a new object to the scene
   * @param {THREE.Group} object - model of the object to view
   */
  addObject (object: THREE.Group) {
    this.cleanupScene();
    if (object instanceof THREE.Group) {
      // Center the object
      const objBox = new THREE.Box3().setFromObject(object);
      objBox.getCenter(object.position);
      object.position.multiplyScalar(-1);

      // The rotate axis of the cube should be the at it's center
      const pivot = new THREE.Group();
      pivot.add(object);

      // Scale the cube
      const coverBox = new THREE.Box3().setFromObject(pivot);
      const size = coverBox.getSize();

      // Add objects to help testing
      this.addHelpers(pivot, size);

      // Scale the object
      const scale = 2 * this.config.renderer.unitVectorSize / size.length();
      pivot.scale.setScalar(scale);
      this.mesh = pivot;
      this.scene.add(this.mesh);
      this.adjustCamera(size, scale);

      this.render();
    }
  }

  /**
   * Remove all objects (except lights and camera) before adding a new object
   */
  cleanupScene () {
    this.scene.children
      .filter(child => child instanceof THREE.Group)
      .map(group => this.scene.remove(group));
  }

  /**
   * Toggle full screen view
   */
  toggleFullScreen(): void {
    if (ScreenFull.enabled) {
      if (!this.resizeCanvas) {
        this.resizeCanvas = () => {
          const isFullscreenMode = ScreenFull.element === this.renderer.domElement;
          const width = isFullscreenMode ? screen.width : this.dimensions.width;
          const height = isFullscreenMode ? screen.height : this.dimensions.height;
          this.renderer.setSize(width, height);
          this.camera.aspect = width / height;
          this.camera.updateProjectionMatrix();
          if (!this.cameraControl) {
            this.render(); // Case: autorotation and camera movement are disabled
          }
        };
        document.addEventListener(ScreenFull.raw.fullscreenchange, this.resizeCanvas);
      }
      ScreenFull.toggle(this.renderer.domElement);
    }
  }

  /**
   * Cancel animation and remove event listeners when viewer destroyed
   */
  destroy(): void {
    if (this.animationFrameId) {
      window.cancelAnimationFrame(this.animationFrameId);
    }
    if (this.resizeCanvas) {
      document.removeEventListener(ScreenFull.raw.fullscreenchange, this.resizeCanvas, false);
    }
    this.containerElement.removeEventListener('mousemove', this.mouseMoveListener);
    this.containerElement.removeEventListener('click', this.mouseClickListener);
  }

  /**
   * Initialize WebGL renderer and add Scene
   * @private
   */
  private initRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });

    this.renderer.setClearColor(this.config.renderer.backgroundColor, this.config.renderer.backgroundOpacity);

    this.renderer.setSize(this.dimensions.width, this.dimensions.height);

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.containerElement.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
  }

  /**
   * Create spot and ambient lights and positions them
   * @private
   */
  private initLight() {
      this.scene.add(new THREE.AmbientLight(this.config.light.ambient.color, this.config.light.ambient.intensity));
      const spotLight = new THREE.SpotLight(this.config.light.spot.color);
      spotLight.position.set(
          this.config.light.spot.position.x,
          this.config.light.spot.position.y,
          this.config.light.spot.position.z);
    spotLight.castShadow = true;
    spotLight.shadow.camera.near = 0.5;
    this.scene.add(spotLight);
    if (this.config.helpers.cameraHelper.isVisible) {
      this.scene.add(new THREE.CameraHelper(spotLight.shadow.camera));
    }
  }

  /**
   * Create camera and OrbitControls to control movement
   * @private
   */
  private initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      this.config.camera.fov,
      this.dimensions.width / this.dimensions.height,
      this.config.camera.near,
      this.config.camera.far
    );
    this.adjustCamera();
    if (this.config.camera.isMobile || this.config.camera.autorotate.speed !== 0) {
      this.cameraControl = new THREE.OrbitControls(this.camera, this.containerElement);
      this.cameraControl.minDistance = this.config.camera.zoom.minDistance;
      this.cameraControl.maxDistance = this.config.camera.zoom.maxDistance;
      this.cameraControl.zoomSpeed = this.config.camera.zoom.speed;
      this.cameraControl.rotateSpeed = this.config.camera.rotate.speed;
      this.cameraControl.autoRotate = this.config.camera.autorotate.speed !== 0;
      this.cameraControl.autoRotateSpeed = this.config.camera.autorotate.speed;
      this.cameraControl.enableKeys = this.config.camera.isKeyControlsEnabled;
      if (!this.config.camera.isMobile) {
        this.cameraControl.enablePan = false;
        this.cameraControl.enableZoom = false;
        this.cameraControl.enableRotate = false;
      }
    }
  }

  /**
   * Handle mouse move event
   * @param event
   */
  private onMouseMove(event: MouseEvent): void {
    event.preventDefault();
    const intersectedMesh = this.getIntersectedObject(event);
    if (intersectedMesh) {
      if (this.intersectedObject === intersectedMesh) {
        return;
      }
      this.intersectedObject = intersectedMesh;
      this.hoveredMesh.next(this.intersectedObject);
    } else {
      if (this.intersectedObject) {
        this.intersectedObject = null;
        this.hoveredMesh.next(this.intersectedObject);
      }
    }
  }

  /**
   * Handle mouse click event
   * @param {MouseEvent} event
   */
  private onMouseClick(event: MouseEvent): void {
    event.preventDefault();
    const intersectedMesh = this.getIntersectedObject(event);
    if (intersectedMesh) {
      this.selectedMesh.next(intersectedMesh);
    }
  }

  /**
   * Detect an object under a pointer
   * @param {MouseEvent} event
   * @returns {THREE.Mesh | null}
   */
  private getIntersectedObject(event: MouseEvent): THREE.Mesh | null {
    const mouse = new THREE.Vector2();

    // calculate mouse position in normalized device coordinates (-1 to +1) for both components
    mouse.x = (event.offsetX / this.dimensions.width) * 2 - 1;
    mouse.y = - (event.offsetY / this.dimensions.height) * 2 + 1;

    // update the picking ray with the camera and mouse position
    this.raycaster.setFromCamera(mouse, this.camera );

    // calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length) {
      return intersects[0].object;
    }

    return null;
  }

  /**
   * Adjust camera position according to object size
   *
   * @param {THREE.Vector3} meshSize - size of a box contained object to view
   * @param {number} scale - scale to convert the object's dimensions to unit cube
   * @private
   */
  private adjustCamera (meshSize?: THREE.Vector3, scale: number = 1) {
    if (meshSize instanceof THREE.Vector3) {
      const distanceToCamera = scale * (meshSize.length() / 2) / Math.sin(Math.PI * this.config.camera.fov / 360);
      const diagonal = Math.sqrt(meshSize.x * meshSize.x + meshSize.z * meshSize.z);
      const angle = Math.atan(2 * diagonal / meshSize.y) / 2; // max angle is 45deg, that's why angle divided by 2
      const y = scale * diagonal * Math.sin(angle);
      const minAngle = this.config.camera.minAngle;
      let alpha = Math.PI / 2 - Math.atan(meshSize.x / meshSize.z);
      alpha = minAngle && alpha < minAngle ? minAngle : alpha;
      const r = Math.sqrt(distanceToCamera * distanceToCamera - y * y);
      const x = r * Math.sin(alpha);
      const z = r * Math.cos(alpha);
      this.camera.position.set(x, y, z);
    } else {
      const {x, y, z} = this.config.camera.position;
      this.camera.position.set(x, y, z);
    }
    this.camera.lookAt(this.scene.position);
  }

  /**
   * Add axis, outer box and rotation sphere to the scene
   * Only for debugging
   * @param {THREE.Group} pivot - group, contained an object to view
   * @param {THREE.Vector3} size - size of a box, contained an object to view
   * @private
   */
  private addHelpers (pivot: THREE.Group, size: THREE.Vector3) {
    if (this.config.helpers.isAxisVisible) {
      this.scene.add(new THREE.AxisHelper(
        this.config.renderer.unitVectorSize,
        this.config.renderer.unitVectorSize,
        this.config.renderer.unitVectorSize
        )
      );
    }
    if (this.config.helpers.outerBox.isVisible) {
      pivot.add(new THREE.Mesh(
        new THREE.CubeGeometry(size.x, size.y, size.z),
        new THREE.MeshBasicMaterial({color: this.config.helpers.outerBox.color, wireframe: true})
      ));
    }
    if (this.config.helpers.rotationSphere.isVisible) {
      pivot.add(new THREE.Mesh(
        new THREE.SphereGeometry(size.length() / 2,
          this.config.helpers.rotationSphere.widthSegments,
          this.config.helpers.rotationSphere.heightSegments),
        new THREE.MeshBasicMaterial({color: this.config.helpers.rotationSphere.color, wireframe: true})
      ));
    }
  }

  /**
   * Render the scene
   * @private
   */
  private render() {
    if (this.config.camera.isMobile || this.config.camera.autorotate.speed !== 0) {
      this.ngZone.runOutsideAngular(() => {
        if (this.animationFrameId) {
          window.cancelAnimationFrame(this.animationFrameId);
        }
        this.animationFrameId = window.requestAnimationFrame(() => this.render());
      });
      this.cameraControl.update();
    }
    this.renderer.render(this.scene, this.camera);
  }

}

