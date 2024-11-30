function load() {
  fetch("/public/input25.txt")
    .then((res) => res.text())
    .then((input) => {
      init(input);
    });
}

function test() {
  init(`jqt: rhn xhk nvd
rsh: frs pzl lsr
xhk: hfx
cmg: qnr nvd lhk bvb
rhn: xhk bvb hfx
bvb: xhk hfx
pzl: lsr hfx nvd
qnr: nvd
ntq: jqt hfx bvb xhk
nvd: lhk
lsr: lhk
rzs: qnr cmg lsr rsh
frs: qnr lhk lsr`);
}

function parseInput(input) {
  const nodes = {};

  const getNode = (key) => {
    if (!nodes[key]) nodes[key] = new Node(key);
    return nodes[key];
  };

  input.split("\n").forEach((line) => {
    const [l, r] = line.split(": ");
    const ln = getNode(l);
    r.split(" ").forEach((x) => {
      const rn = getNode(x);
      ln.connect(rn);
      rn.connect(ln);
    });
  });

  console.log(nodes);

  return nodes;
}

class Node {
  key;
  x = 0;
  y = 0;
  links = [];

  constructor(key) {
    this.key = key;
    this.x = Math.round(Math.random() * scale);
    this.y = Math.round(Math.random() * scale);
  }

  connect(node) {
    this.links.push(node);
    // node.connect(this);
  }

  stepTowards(ox, oy, scale) {
    let dx = ox - this.x;
    let dy = oy - this.y;
    if (dx > 20) this.x += dx * 0.1 * scale;
    if (dy > 20) this.y += dy * 0.1 * scale;
  }
}

let container;
let canvas;
let ctx;
let nodeMap;
let nodes;
const scale = 5000;

function init(input) {
  nodeMap = parseInput(input);
  container = document.getElementById("container");
  canvas = container.querySelector("canvas");
  ctx = canvas.getContext("2d");
  // canvas.style.height = `${scale * 2}px`;
  // canvas.style.width = `${scale * 2}px`;
  canvas.height = scale * 1.2;
  canvas.width = scale * 1.2;

  nodes = Object.values(nodeMap);
  render();

  function jump() {
    let minX = 9999,
      minY = 9999,
      maxY = 0,
      maxX = 0;
    nodes.forEach((node) => {
      node.links.forEach((other) => {
        const midx = (other.x + node.x) / 2;
        const midy = (other.y + node.y) / 2;
        node.stepTowards(midx, midy, other.links.length);
        other.stepTowards(midx, midy, node.links.length);
        // console.log({ min, max, node, other });
      });
    });
    nodes.forEach((node) => {
      minX = Math.min(minX, node.x);
      maxX = Math.max(maxX, node.x);
      minY = Math.min(minY, node.y);
      maxY = Math.max(maxY, node.y);
    });

    const rangeX = maxX - minX;
    const rangeY = maxY - minY;
    const scalerX = scale / rangeX;
    const scalerY = scale / rangeY;
    nodes.forEach((node) => {
      // console.log(`node ${node.key} at ${node.x},${node.y}`);
      node.x = (node.x - minX) * scalerX;
      node.y = (node.y - minY) * scalerY;
      // console.log(`becomes ${node.key} at ${node.x},${node.y} when scaled ${scalerX} from range ${minX} to ${maxX}`);
    });
    render();
  }

  setInterval(jump, 1000);
  jump();
}

function render() {
  console.log("render", nodeMap);
  const pad = 20;
  ctx.clearRect(0, 0, scale + pad * 4, scale + pad * 4);

  nodes.forEach((node) => {
    ctx.fillStyle = "black";
    ctx.font = "24px serif";
    ctx.fillText(node.key, node.x + pad, node.y + pad);
    node.links.forEach((other) => {
      ctx.strokeStyle = "rgba(128,128,128,0.6)";
      ctx.beginPath();
      ctx.moveTo(node.x + pad, node.y + pad);
      ctx.lineTo(other.x + pad, other.y + pad);
      ctx.closePath();
      ctx.stroke();
    });
  });
}

load();
