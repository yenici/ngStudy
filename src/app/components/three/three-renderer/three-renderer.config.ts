export default {
  container: {
    defaultWidth: 464,
    defaultHeight: 318
  },
  renderer: {
    backgroundColor: 0xC0C0C0,
    backgroundOpacity: 1,
    backgroundImageUrl: '',
    backgroundCubeSize: 100,
    unitVectorSize: 1
  },
  camera: {
    fov: 50,     // Camera frustum vertical field of view, from bottom to top of view, in degrees
    near: 0.01,  // Camera frustum near plane. Closer than this value object won't be rendered
    far: 100,    // Camera frustum far plane. Further than this value object won't be rendered
    position: { x: 1, y: 0, z: 2 },
    minAngle: Math.PI / 4, // Minimum angle between camera and zOy
    isMobile: true,
    isKeyControlsEnabled: false, // Control object position with cursor keys
    zoom: {
      minDistance: 0.1,
      maxDistance: 10,
      speed: 0.5
    },
    rotate: {
      speed: 0.5
    },
    autorotate: {
      speed: 0
    }
  },
  light: {
    ambient: {
      color: 0x404040,
      intensity: 4
    },
    spot: {
      color: 0xffffff,
      position: { x: -3, y: 1, z: 0 }
    }
  },

  // For debugging purpose only
  helpers: {
    isAxisVisible: true,
    outerBox: {
      isVisible: false,
      color: 0x0000FF
    },
    rotationSphere: {
      isVisible: false,
      widthSegments: 20,
      heightSegments: 20,
      color: 0xFFFF00
    }
  }
};
