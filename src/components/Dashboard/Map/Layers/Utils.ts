import {MercatorCoordinate, LngLatLike, MapLayerMouseEvent, Map, CustomLayerInterface} from 'mapbox-gl';
import {GLTFLoader, GLTF} from 'three/examples/jsm/loaders/GLTFLoader';
import {MapRef} from 'react-map-gl';
import * as THREE from 'three';
// import {parse, stringify} from 'flatted';
import {db} from '../../../../db';
import {LoaderUtils} from 'three';

export type Rotation = [number, number, number];
export type Coordinates = LngLatLike;

export interface Light {
  color: number;
  intensity: number;
  first?: {
    x: number;
    y: number;
    z: number;
  };
  second?: {
    x: number;
    y: number;
    z: number;
  };
}

export const layerTypes = {
  alarms: 'alarms',
  assets: 'assets',
  layers3d: 'layers3d'
};

export type LayerType = keyof typeof layerTypes;

type MapExtraProps = {[key in LayerType]: CustomLayerProps[]};

export interface MBMap extends Map, MapExtraProps {}

export interface MBMapRef extends MapRef {
  getMap: () => MBMap;
}

export interface Layer3d {
  camera?: THREE.Camera;
  scene?: THREE.Scene;
  map?: MBMap;
  renderer?: THREE.WebGLRenderer;
  raycaster?: THREE.Raycaster;
  raycast?: (clickEvent: MapLayerMouseEvent) => string | null | undefined;
}

export interface CustomLayerProps extends CustomLayerInterface, Layer3d {
  id: string;
  alarmId?: string;
  modelId?: string;
  district?: any;
}

const modelLoader = async (url: string): Promise<GLTF> => {
  const loader = new GLTFLoader();
  const data = await loader.loadAsync(url);
  return data;
};

const modelParser = async (url: string, json: string): Promise<GLTF> => {
  const loader = new GLTFLoader();
  const data = await loader.parseAsync(json, LoaderUtils.extractUrlBase(url));
  return data;
};

export const loadModel = async (url: string): Promise<GLTF> => {
  const storedData = await db.models.where('url').equals(url).first();
  if (storedData) {
    return await modelParser(url, storedData.model);
  }
  const model = await modelLoader(url);
  const id = await db.models.add({url, model: JSON.stringify(model.parser.json)});
  return model;
};

export const getModelTransform = (coordinates: Coordinates, scale: number, rotate: Rotation, altitude: number) => {
  const modelOrigin = coordinates;
  const modelAltitude = altitude;
  const modelRotate = rotate;

  const modelAsMercatorCoordinate = MercatorCoordinate.fromLngLat(modelOrigin, modelAltitude);

  const modelTransform = {
    translateX: modelAsMercatorCoordinate.x,
    translateY: modelAsMercatorCoordinate.y,
    translateZ: modelAsMercatorCoordinate.z,
    rotateX: modelRotate[0],
    rotateY: modelRotate[1],
    rotateZ: modelRotate[2],
    scale: scale || modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
  };

  return modelTransform;
};

export const basicOnAdd = (layer: CustomLayerProps, gltf: GLTF, ambientLight: Light) => (map: MBMap, gl: WebGLRenderingContext) => {
  layer.camera = new THREE.Camera();
  layer.scene = new THREE.Scene();

  //Adding an ambient light
  layer.scene.add(new THREE.AmbientLight(ambientLight.color, ambientLight.intensity));

  // use the three.js GLTF loader to add the 3D model to the three.js scene
  layer.scene.add(gltf.scene);
  layer.map = map;

  // use the Mapbox GL JS map canvas for three.js
  layer.renderer = new THREE.WebGLRenderer({
    canvas: map.getCanvas(),
    context: gl,
    antialias: true
  });
  layer.renderer.autoClear = false;
};

export const onAdd =
  (layer: CustomLayerProps, type: LayerType, gltf: GLTF, ambientLight: Light, dirLight: Light, alarm?: any) =>
  (map: MBMap, gl: WebGLRenderingContext) => {
    layer.camera = new THREE.PerspectiveCamera(28, window.innerWidth / window.innerHeight, 0.1, 1e6);
    layer.scene = new THREE.Scene();

    //Adding a raycaster for the mouse click events
    layer.raycaster = new THREE.Raycaster();
    layer.raycaster.near = -1;
    layer.raycaster.far = 1e6;

    //Adding an ambient light
    layer.scene.add(new THREE.AmbientLight(ambientLight.color, ambientLight.intensity || 2));

    // create two three.js lights to illuminate the model
    const directionalLight = new THREE.DirectionalLight(dirLight.color, dirLight.intensity || 1);
    directionalLight.position.set(dirLight.first?.x || 0, dirLight.first?.y || -70, dirLight.first?.z || 100).normalize();
    layer.scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(dirLight.color, dirLight.intensity || 1);
    directionalLight2.position.set(dirLight.second?.x || 0, dirLight.second?.y || 70, dirLight.second?.z || 100).normalize();
    layer.scene.add(directionalLight2);

    // use the three.js GLTF loader to add the 3D model to the three.js scene
    // if (type === 'alarms') {
    //   alarm.scene.scale.set(50, 50, 50);
    //   const boxObject = gltf.scene.children.find((item) => item.type === 'Mesh' || item.type === 'Group');
    //   const box = new THREE.Box3().setFromObject(boxObject || new THREE.Object3D());
    //   alarm.scene.position.set(0, box.max.y, 0);
    //   layer.scene.add(alarm.scene);
    // } else {
    //   layer.scene.add(gltf.scene);
    // }

    layer.scene.add(gltf.scene);

    if (map[type]) {
      map[type].push(layer);
    } else {
      map[type] = [];
      map[type].push(layer);
    }
    layer.map = map;

    // use the Mapbox GL JS map canvas for three.js
    layer.renderer = new THREE.WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl,
      antialias: true
    });

    layer.renderer.autoClear = false;
    layer.map.triggerRepaint();
  };

export const onRemove = (type: LayerType, layerId: string) => (map: MBMap, gl: WebGLRenderingContext) => {
  if (map[type]) {
    const layers = map[type].filter((l) => l.id !== layerId);
    map[type] = layers;
  }

  map.triggerRepaint();
};

export const render =
  (layer: CustomLayerProps, coordinates: Coordinates, scale: number, rotate: Rotation, altitude: number) =>
  (gl: WebGLRenderingContext, matrix: number[]) => {
    const modelTransform = getModelTransform(coordinates, scale, rotate, altitude);
    const rotationX = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1, 0, 0), modelTransform.rotateX);
    const rotationY = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), modelTransform.rotateY);
    // const rotationZ = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 0, 1), modelTransform.rotateZ);

    const mScale = new THREE.Matrix4().makeScale(modelTransform.scale, -modelTransform.scale, modelTransform.scale);
    const rotation = new THREE.Matrix4().multiplyMatrices(rotationX, rotationY);
    let l = new THREE.Matrix4()
      .multiplyMatrices(mScale, rotation)
      .setPosition(modelTransform.translateX, modelTransform.translateY, modelTransform.translateZ);

    if (layer.camera) {
      layer.camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix).multiply(l);
    }

    layer.renderer?.resetState();
    layer.renderer?.render(layer.scene || new THREE.Scene(), layer.camera || new THREE.Camera());
    layer.map?.triggerRepaint();
  };

export const raycast =
  (layer: CustomLayerProps) =>
  (clickEvent: MapLayerMouseEvent): string | null | undefined => {
    const {point} = clickEvent;
    if (layer.scene?.visible) {
      var mouse = new THREE.Vector2();
      // scale mouse pixel position to a percentage of the screen's width and height
      if (layer && layer.map) {
        //@ts-ignore
        mouse.x = (point.x / layer.map.transform.width) * 2 - 1;
        //@ts-ignore
        mouse.y = 1 - (point.y / layer.map.transform.height) * 2;
      }

      const camInverseProjection = new THREE.Matrix4().copy(layer.camera?.projectionMatrix || new THREE.Matrix4()).invert();
      const cameraPosition = new THREE.Vector3().applyMatrix4(camInverseProjection);
      const mousePosition = new THREE.Vector3(mouse.x, mouse.y, 1).applyMatrix4(camInverseProjection);
      const viewDirection = mousePosition.clone().sub(cameraPosition).normalize();

      layer.raycaster?.set(cameraPosition, viewDirection);

      var intersects: any = [];
      for (var i in layer.scene.children) {
        if (layer.scene.children[i] instanceof THREE.Group) {
          intersects = layer.raycaster?.intersectObjects(layer.scene.children[i].children, true) || [];
        } else if (layer.scene.children[i] instanceof THREE.Mesh) {
          intersects.push(layer.raycaster?.intersectObject(layer.scene.children[i]));
        }
      }

      // calculate objects intersecting the picking ray
      if (intersects.length) return layer.modelId;
      else return null;
    }
    return null;
  };
