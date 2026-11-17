// Phase 16c — Fix the remaining 3 visual issues:
// 1. Remove the bad sea fan branches (flat-scaled tree = weird large flat shape)  
// 2. Fix sand texture brightness (too white — base RGB too high)
// 3. Fix seabed AO — the vertex colors still appear too bright

const fs = require('fs');
const path = 'c:/Users/SHUBHAM/Desktop/deep-ocean-explorer/deep-ocean-explorer.html';
let html = fs.readFileSync(path, 'utf8');

// ── 1. Remove the bad 'sea fan branches' — the flat-scaled tree geometry
//    looks like a large flat playing card, not a sea fan. Remove it.
//    Replace with proper fan-like branching at smaller scale using tree() without z-scale
const oldSeaFan = `safeReef('sea fan branches',()=>reef([14,15,16].map(s=>{const g=tree(s,.18,.008,5);g.scale(1,1,.18);return g}),50,sw(CM(),swy(.08,'position.y*.5')),[.5,1.3],()=>new THREE.Color().setHSL([.03,.06,.72,.08,.75][Math.floor(Math.random()*5)],.45,.38+Math.random()*.12)));`;
const newSeaFan = `safeReef('gorgonian sea fans',()=>reef([14,15,16].map(s=>tree(s,.18,.006,5)),45,sw(CM(),swy(.06,'position.y*.4')),[.4,1.0],()=>new THREE.Color().setHSL([.03,.07,.09,.04,.06][Math.floor(Math.random()*5)],.4+Math.random()*.1,.32+Math.random()*.1)));`;
if (html.includes(oldSeaFan)) {
  html = html.replace(oldSeaFan, newSeaFan);
  console.log('✓ Replaced bad flat-scaled sea fan with proper gorgonian coral');
} else {
  console.warn('✗ Sea fan target not found');
}

// ── 2. Fix sand texture — the base RGB values (224, 204, 164) are too bright,
//    resulting in near-white sand. Reduce to warm mid-tone golden sand.
//    r=224→170, g=204→152, b=164→118 (warm golden-tan, mid-tone)
//    Also increase grain darkness variation
const oldSandTex = `let r=224+rip+silt+grain,g=204+rip*.9+silt*.9+grain,b=164+rip*.7+silt*.7+grain;`;
const newSandTex = `let r=170+rip*.6+silt*.5+grain*.5,g=152+rip*.5+silt*.5+grain*.4,b=118+rip*.4+silt*.4+grain*.3;`;
if (html.includes(oldSandTex)) {
  html = html.replace(oldSandTex, newSandTex);
  console.log('✓ Darkened sand texture base (224→170, 204→152, 164→118) for golden sand');
} else {
  console.warn('✗ Sand texture brightness target not found');
}

// ── 3. Also fix the shell fleck and silt patch colours to match the darker sand
//    Currently: shell fleck r=242,g=238,b=228 (white) — keep but reduce intensity
//    silt patch: r=155,g=140,b=120 — keep
const oldShellFleck = `if(Math.random()<.004){r=242;g=238;b=228}else if(Math.random()<.003){r=155;g=140;b=120}`;
const newShellFleck = `if(Math.random()<.004){r=210;g=200;b=185}else if(Math.random()<.003){r=120;g=108;b=88}`;
if (html.includes(oldShellFleck)) {
  html = html.replace(oldShellFleck, newShellFleck);
  console.log('✓ Reduced shell fleck brightness to match darker sand');
} else {
  console.warn('✗ Shell fleck target not found');
}

// ── 4. Also fix the deep branching coral at L622 — it uses CM() with 
//    HSL(0.08, 0.5, 0.35) = medium green-olive which is correct
//    But ensure it's not too bright by keeping it as is

// ── 5. Fix the regen() AO so the VERTEX COLOURS actually compute darker
//    Current after last fix: ao=.42+.32*cl(.5+h/(a*3.5+.5)*.5) 
//    At reef depth (h≈-12, a≈1.3), cl(val) is 0 → ao=0.42
//    SC[0] rgb: (0.82,0.74,0.56) → 0.42 × (0.82,0.74,0.56) = (0.34,0.31,0.24) 
//    This IS a correct dark warm tan BUT the texture multiplies it
//    The texture at base 170,152,118 = (0.67,0.60,0.46) normalized
//    Final: (0.34×0.67, 0.31×0.60, 0.24×0.46) = (0.23, 0.19, 0.11) — this would be VERY dark
//    Maybe the AO is too dark now. Let's try a balanced approach:
//    ao range: 0.55 to 0.80 (not too dark, not too bright)
const oldAO2 = `const ao=.42+.32*cl(.5+h/(a*3.5+.5)*.5);ca.setXYZ(k,col.r*ao,col.g*ao,col.b*ao)`;
const newAO2 = `const ao=.55+.28*cl(.5+h/(a*3.5+.5)*.5);ca.setXYZ(k,col.r*ao,col.g*ao,col.b*ao)`;
if (html.includes(oldAO2)) {
  html = html.replace(oldAO2, newAO2);
  console.log('✓ Rebalanced AO to 0.55-0.83 range (not too dark, not too bright)');
} else {
  console.warn('✗ AO target not found');
}

// ── 6. Fix the seagrass instance that still uses 0x2c6e2e (bright green) —
//    there's one more at L587 (waving seagrass) with this color — it's fine, it's dark
//    But check if there's a BRIGHT green remaining anywhere

// ── 7. Remove the remaining bright ribbon algae — the 'seaweed ribbon' at L621
//    uses mkRibbonAlgae() which we replaced with multi-blade sea lettuce
//    but its COLOR fn returns HSL(0.25-0.32, 0.48, 0.20-0.28) = dark olive green
//    That should NOT be bright yellow-green. But maybe the multi-blade lettuce
//    code when combined with CM() (white base) looks too bright.
//    Fix: give it a proper dark seaweed MeshStandardMaterial instead of CM() (white)
const oldRibbonMat = `safeReef('seaweed ribbon',()=>reef([mkRibbonAlgae()],120,sw(CM(),swz(.35,'position.y*position.y',1.4)),[.8,1.6],()=>new THREE.Color().setHSL(.25+Math.random()*.07,.48,.2+Math.random()*.08)));`;
const newRibbonMat = `safeReef('sea lettuce',()=>reef([mkRibbonAlgae()],100,sw(MS({color:0x2a5e1a,roughness:.75,side:2}),swz(.35,'position.y*position.y',1.4)),[.5,1.2],()=>new THREE.Color().setHSL(.22+Math.random()*.07,.5,.22+Math.random()*.07)));`;
if (html.includes(oldRibbonMat)) {
  html = html.replace(oldRibbonMat, newRibbonMat);
  console.log('✓ Fixed sea lettuce material (dark green instead of white CM())');
} else {
  console.warn('✗ Seaweed ribbon material target not found');
}

// Write
fs.writeFileSync(path, html, 'utf8');
console.log('\n✅ Phase 16c fixes written');

// Verify JS parses
const html2 = fs.readFileSync(path, 'utf8');
const scripts = [];let idx=0;
while(true){const s=html2.indexOf('<script>',idx);if(s===-1)break;const e=html2.indexOf('</script>',s);scripts.push(html2.slice(s+8,e));idx=e+9}
let allOk=true;
scripts.forEach((js,i)=>{try{new Function(js);console.log('Script',i,'parses OK')}catch(e){console.error('Script',i,'PARSE ERROR:',e.message);allOk=false}});
if(allOk)console.log('✓ All scripts valid');

// Verify key changes
console.log('\n--- Key changes ---');
console.log('Sea fan fixed:', html2.includes('gorgonian sea fans'));
console.log('Sand darkened:', html2.includes('r=170+rip*.6'));
console.log('Sea lettuce material:', html2.includes('color:0x2a5e1a'));
console.log('AO rebalanced:', html2.includes('.55+.28*cl'));
