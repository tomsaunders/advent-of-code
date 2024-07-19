import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";

let container;
let camera, scene, renderer;
const splineHelperObjects = [];

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const onUpPosition = new THREE.Vector2();
const onDownPosition = new THREE.Vector2();

let transformControl;

init();

function init() {
  container = document.getElementById("container");

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.set(0, 250, 1000);
  scene.add(camera);

  scene.add(new THREE.AmbientLight(0xf0f0f0, 3));
  const light = new THREE.SpotLight(0xffffff, 4.5);
  light.position.set(0, 1500, 200);
  light.angle = Math.PI * 0.2;
  light.decay = 0;
  light.castShadow = true;
  light.shadow.camera.near = 200;
  light.shadow.camera.far = 2000;
  light.shadow.bias = -0.000222;
  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;
  scene.add(light);

  const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
  planeGeometry.rotateX(-Math.PI / 2);
  const planeMaterial = new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.2 });

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.position.y = -200;
  plane.receiveShadow = true;
  scene.add(plane);

  const helper = new THREE.GridHelper(2000, 100);
  helper.position.y = -199;
  helper.material.opacity = 0.25;
  helper.material.transparent = true;
  scene.add(helper);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.damping = 0.2;
  controls.addEventListener("change", render);

  transformControl = new TransformControls(camera, renderer.domElement);
  transformControl.addEventListener("change", render);
  transformControl.addEventListener("dragging-changed", function (event) {
    controls.enabled = !event.value;
  });
  scene.add(transformControl);

  transformControl.addEventListener("objectChange", function () {
    updateSplineOutline();
  });

  document.addEventListener("pointerdown", onPointerDown);
  document.addEventListener("pointerup", onPointerUp);
  document.addEventListener("pointermove", onPointerMove);
  window.addEventListener("resize", onWindowResize);

  load();

  render();
}

function render() {
  renderer.render(scene, camera);
}

function onPointerDown(event) {
  onDownPosition.x = event.clientX;
  onDownPosition.y = event.clientY;
}

function onPointerUp(event) {
  onUpPosition.x = event.clientX;
  onUpPosition.y = event.clientY;

  if (onDownPosition.distanceTo(onUpPosition) === 0) {
    transformControl.detach();
    render();
  }
}

function onPointerMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(splineHelperObjects, false);

  if (intersects.length > 0) {
    const object = intersects[0].object;

    if (object !== transformControl.object) {
      transformControl.attach(object);
    }
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();
}

function load() {
  fetch("/public/input24.txt")
    .then((res) => res.text())
    .then((input) => {
      hail(input);
    });
}

class Velocity {
  dx = 0;
  dy = 0;
  dz = 0;
  constructor(x, y, z) {
    this.dx = x;
    this.dy = y;
    this.dz = z;
  }
}

class Position {
  x = 0;
  y = 0;
  z = 0;
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

class Hailstone {
  key;
  start;
  velocity;
  position;
  constructor(key, start, velocity) {
    this.key = key;
    this.start = start;
    this.velocity = velocity;
    this.position = start;
  }
  nextPosition(ticks) {
    return {
      x: this.position.x + this.velocity.dx * ticks,
      y: this.position.y + this.velocity.dy * ticks,
      z: this.position.z + this.velocity.dz * ticks,
    };
  }
  intersectionPoint(other) {
    // this this.x Y1
    const x1 = this.position.x;
    const y1 = this.position.y;
    const x2 = this.nextPosition(100000000000000).x;
    const y2 = this.nextPosition(100000000000000).y;
    const x3 = other.position.x;
    const y3 = other.position.y;
    const x4 = other.nextPosition(100000000000000).x;
    const y4 = other.nextPosition(100000000000000).y;

    const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);

    // Lines are parallel
    if (denominator === 0) {
      return [-1, -1, -1];
    }

    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

    // is the intersection along the segments (doesnt require going in the past)
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
      return [-1, -1, -1];
    }

    // Return a object with the x and y coordinates of the intersection
    let x = x1 + ua * (x2 - x1);
    let y = y1 + ua * (y2 - y1);

    return [x, y];
  }
}

function hail(input) {
  const stones = input.split("\n").map((line) => {
    const [left, right] = line.split(" @ ");
    const [x, y, z] = left.split(", ").map((x) => parseInt(x));
    const [dx, dy, dz] = right.split(", ").map((x) => parseInt(x));
    return new Hailstone(line, { x, y, z }, { dx, dy, dz });
  });

  stones.forEach((stone) => {
    stone.points = [];
    let i = 0;
    const p = stone.nextPosition(i * 1000000000000);
    stone.points.push(new THREE.Vector3(p.x / 1000000000000, p.y / 1000000000000, p.z / 1000000000000));
    // for (let i = 0; i < 5; i++) {
    //   const p = stone.nextPosition(i * 1000000000000);
    //   points.push(new THREE.Vector3(p.x / 1000000000000, p.y / 1000000000000, p.z / 1000000000000));
    // }
    stone.material = new THREE.LineBasicMaterial({
      color: new THREE.Color(
        (500 + stone.velocity.dx) / 1000,
        (500 + stone.velocity.dy) / 1000,
        (500 + stone.velocity.dz) / 1000
      ),
    });
    stone.geometry = new THREE.BufferGeometry().setFromPoints(stone.points);
    stone.line = new THREE.Line(stone.geometry, stone.material);
    scene.add(stone.line);
  });
  console.log("render scene", scene);

  render();
  let ticks = 1;
  setInterval(() => {
    stones.forEach((stone) => {
      const p = stone.nextPosition(ticks * 10000000000);
      stone.points.push(new THREE.Vector3(p.x / 1000000000000, p.y / 1000000000000, p.z / 1000000000000));
      stone.geometry.setFromPoints(stone.points);
    });
    render();
    ticks++;
  }, 200);
}

// TODO draw the box which is the 200000 - 40000 range
// calculate the times when each hailstone enters and exits the range
//
