// Phase 16h — Fix the persistent cylinder-log and floating algae ball
const fs = require('fs');
const path = 'c:/Users/SHUBHAM/Desktop/deep-ocean-explorer/deep-ocean-explorer.html';
let html = fs.readFileSync(path, 'utf8');

// ── 1. The smooth grey cylinder 'log' is from the 46 rocks at x:-195 to -160
//    Scale set(1.5+rand*3, 1.2+rand*3, 1.5+rand*3) can create a tall thin oval
//    that looks like a log. Fix: cap Y scale to match X scale to avoid elongation
//    Also position offset +.5 is too high — set to +.1
const oldRockyReefWall = `for(let i=0;i<46;i++){const m=new THREE.Mesh(rg0,rockM),x=rx(-195,-160),z=rx(-280,280);m.scale.set(1.5+Math.random()*3,1.2+Math.random()*3,1.5+Math.random()*3);m.position.set(x,H(x,z)+.5,z);m.rotation.set(Math.random()*3,Math.random()*3,0);m.castShadow=m.receiveShadow=true;ben.add(m);BI.push(m)}`;
const newRockyReefWall = `for(let i=0;i<46;i++){const m=new THREE.Mesh(rg0,rockM),x=rx(-195,-160),z=rx(-280,280),sx=1.5+Math.random()*2.5;m.scale.set(sx,.8+Math.random()*.7,sx*(0.7+Math.random()*.5));m.position.set(x,H(x,z)+.1,z);m.rotation.set(Math.random()*1.5,Math.random()*6.28,Math.random()*.5);m.castShadow=m.receiveShadow=true;ben.add(m);BI.push(m)}`;
if (html.includes(oldRockyReefWall)) {
  html = html.replace(oldRockyReefWall, newRockyReefWall);
  console.log('✓ Fixed rocky reef wall rocks (capped Y scale, varied rotations, lower offset)');
} else {
  console.warn('✗ Rocky reef wall target not found');
}

// ── 2. Fix the floating mkAlgae() — currently uses put() with offset +.05
//    But the geometry's IcosahedronGeometry pieces are translated to y=h/2
//    where h=.25+rand*.25, so center of algae clump = y≈0.25 above base
//    The clump appears to float. Fix: reduce the offset to 0 so it sits on seabed
const oldAlgaeInst = `inst(mkAlgae(),sw(MS({color:0x7a3e28,roughness:.8,side:2}),swy(.2,'position.y')),90,d=>{put(d,-330,-175,-120,120,.05)`;
const newAlgaeInst = `inst(mkAlgae(),sw(MS({color:0x7a3e28,roughness:.8,side:2}),swy(.2,'position.y')),90,d=>{put(d,-330,-175,-120,120,-.05)`;
if (html.includes(oldAlgaeInst)) {
  html = html.replace(oldAlgaeInst, newAlgaeInst);
  console.log('✓ Fixed algae ball placement (offset .05 → -.05 to sit on seabed)');
} else {
  console.warn('✗ Algae inst target not found');
  const idx = html.indexOf('put(d,-330,-175,-120,120,.05)');
  if (idx !== -1) console.log('Found algae at:', idx);
}

// ── 3. The 130 general rocks also have too-uniform grey scale — add flatShading randomness
// They're placed at rx(-330,520), rx(-250,250) using rg0 geometry with scale .6+rand*3
// and flatShading:true — this should already give faceted look, not smooth cylinder
// The smooth cylinder is DEFINITELY from the beach section then.
// Let me check the beach palm trunk positions — they're at x=-470 to -372
// and the diver at x=-225 looking east (yaw=-1.57 = looking in -X direction = looking west!)
// Wait — yaw=-1.57 ≈ -π/2. In the game's coordinate system:
// looking direction = (-sin(yaw), 0, -cos(yaw)) = (-sin(-1.57), 0, -cos(-1.57)) = (1, 0, 0)
// So yaw=-1.57 means looking in the POSITIVE X direction = EAST in world space
// But the beach is at x=-450 to -360, coral reef at x=-330 to -165
// At x=-225, looking east (+X) means looking toward x=-165 and beyond (open ocean)
// The palm trunks at x=-470 to -372 are BEHIND the diver (west)
// So the cylinder cannot be a palm trunk. It MUST be one of the smooth rocks.
// rg0 = BI.find(o => o.isMesh).geometry — from the initial rocks at L326-329
// Looking at L326-329, the initial rocks are IcosahedronGeometry(.8,2) with
// various modifiers. This is a naturally faceted shape.
// With scale(1.5+rand*3, 1.2+rand*3, 1.5+rand*3), if Y is much larger than X/Z,
// you get an elongated vertical oval that looks like a smooth cylinder.
// Our fix above caps Y to avoid this.

// ── 4. Also the 130 general rocks — ensure they don't have Y scale much larger than X
const oldGeneralRocks = `for(let i=0;i<130;i++){const m=new THREE.Mesh(rg0,rockM),x=rx(-330,520),z=rx(-250,250);m.scale.setScalar(.6+Math.random()*3);`;
const newGeneralRocks = `for(let i=0;i<130;i++){const m=new THREE.Mesh(rg0,rockM),x=rx(-330,520),z=rx(-250,250);const rs=.6+Math.random()*2.5;m.scale.set(rs,.4+Math.random()*rs*.8,rs*(.6+Math.random()*.7));`;
if (html.includes(oldGeneralRocks)) {
  html = html.replace(oldGeneralRocks, newGeneralRocks);
  console.log('✓ Fixed general rocks scale (no more tall cylindrical rocks)');
} else {
  console.warn('✗ General rocks target not found');
}

// Write
fs.writeFileSync(path, html, 'utf8');
console.log('\n✅ Phase 16h written');

// Validate
const h2 = fs.readFileSync(path, 'utf8');
const scripts = []; let idx = 0;
while(true) { const s = h2.indexOf('<script>', idx); if(s===-1) break; const e = h2.indexOf('</script>', s); scripts.push(h2.slice(s+8, e)); idx = e+9; }
let ok = true;
scripts.forEach((js, i) => { try { new Function(js); console.log('Script', i, 'OK'); } catch(e) { console.error('Script', i, 'ERROR:', e.message); ok = false; } });
if(ok) console.log('✓ All scripts valid');
