import * as THREE from "three";
import { loadSession, saveSession, hasFeature } from "./state/session";
import model from "./data/model.json";

let scene, camera, renderer, raycaster, mouse, tiles = [], session;

export async function init(canvasEl: HTMLCanvasElement) {
  session = loadSession();

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(70, canvasEl.clientWidth / canvasEl.clientHeight, 0.1, 100);
  camera.position.set(0, 1.6, 3);

  renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: true, alpha: true });
  renderer.setSize(canvasEl.clientWidth, canvasEl.clientHeight);
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  // Floor & lighting
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshStandardMaterial({ color: 0x222222, metalness: .2, roughness: .8 }));
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x222233, 1.0));

  // Transparent “glass” panel
  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(2.4, 1.4),
    new THREE.MeshPhysicalMaterial({ color: 0x111111, transparent: true, opacity: 0.1, roughness: 0.1, transmission: 0.85, thickness: 0.02 })
  );
  glass.position.set(0, 1.5, -1.5);
  scene.add(glass);

  // Build interactive tiles based on plan features
  const features = [
    { id: "display",       label: "Display" },
    { id: "lighting",      label: "Lighting" },
    { id: "climate",       label: "Climate" },
    { id: "security",      label: "Security" },
    { id: "assistant",     label: "Assistant" },
    { id: "entertainment", label: "Entertainment" },
    { id: "network",       label: "Network" }
  ];

  const tileGeo = new THREE.PlaneGeometry(0.7, 0.33);
  let ix = 0;
  for (const f of features) {
    if (!hasFeature(session.plan, f.id, model)) continue; // plan gate

    const mat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.22 });
    const tile = new THREE.Mesh(tileGeo, mat);
    tile.position.set(-0.8 + (ix % 3) * 0.8, 1.8 - Math.floor(ix / 3) * 0.4, -1.49);
    tile.userData = { feature: f.id, label: f.label };
    tiles.push(tile);
    scene.add(tile);

    // Label (simple)
    const sprite = makeTextSprite(f.label);
    sprite.position.copy(tile.position).add(new THREE.Vector3(0, -0.2, 0));
    scene.add(sprite);
    ix++;
  }

  // Teleport “room” hotspots
  for (const r of model.rooms) {
    const dot = new THREE.Mesh(new THREE.CircleGeometry(0.1, 32), new THREE.MeshBasicMaterial({ color: 0xff6600 }));
    dot.position.set(r.spawn[0], 0.02, r.spawn[2]);
    dot.rotation.x = -Math.PI / 2;
    dot.userData = { type: "room", roomId: r.id };
    scene.add(dot);
    tiles.push(dot); // clickable
  }

  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerdown", onDown);
  animate();
}

function makeTextSprite(text: string) {
  const c = document.createElement("canvas"); const ctx = c.getContext("2d")!;
  c.width = 512; c.height = 128;
  ctx.font = "48px Inter, Arial";
  ctx.fillStyle = "rgba(0,255,255,0.95)";
  ctx.textAlign = "center"; ctx.fillText(text, 256, 80);
  const tex = new THREE.CanvasTexture(c);
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
  const s = new THREE.Sprite(mat); s.scale.set(0.7, 0.18, 1); return s;
}

function onMove(e: PointerEvent) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
}

function onDown() {
  raycaster.setFromCamera(mouse, camera);
  const hit = raycaster.intersectObjects(tiles, false)[0];
  if (!hit) return;

  const ud = hit.object.userData;
  if (ud.type === "room") {
    session.roomId = ud.roomId;
    saveSession(session);
    // simple teleport
    const room = (window as any).NV_MODEL.rooms.find((r:any)=>r.id===ud.roomId);
    camera.position.set(room.spawn[0], 1.6, room.spawn[2] + 3);
    return;
  }

  if (ud.feature) {
    openFeature(ud.feature);
  }
}

function openFeature(featureId: string) {
  // Example: toggle lighting intensity per room
  const key = `${session.roomId}.${featureId}`;
  const current = session.roomSettings[key] ?? 0.7;
  const next = Number((Math.min(1, current + 0.1)).toFixed(2));
  session.roomSettings[key] = next;
  saveSession(session);

  // Give visual feedback: pulse tracer
  pulseTracer();
}

function pulseTracer() {
  const geo = new THREE.RingGeometry(0.0, 1.2, 64);
  const mat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.5 });
  const ring = new THREE.Mesh(geo, mat);
  ring.position.set(0, 1.5, -1.49);
  scene.add(ring);
  const start = performance.now();
  const tick = () => {
    const t = (performance.now() - start) / 600;
    ring.scale.setScalar(1 + t * 2);
    ring.material.opacity = Math.max(0, 0.5 - t * 0.5);
    if (t < 1) requestAnimationFrame(tick); else scene.remove(ring);
  };
  tick();
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// expose model for room lookups
(window as any).NV_MODEL = model;
