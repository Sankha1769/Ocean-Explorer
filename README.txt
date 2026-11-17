DEEP OCEAN EXPLORER
===================
A single-file Three.js (r128) underwater exploration simulator: start on a beach,
walk into the sea, dive through five depth zones to a trench, and discover 49 species.

HOW TO RUN
- Open deep-ocean-explorer.html in a current desktop browser (Chrome, Edge, Firefox).
- An internet connection is needed: Three.js r128 loads from cdnjs.cloudflare.com and the
  optional GLTFLoader/SkeletonUtils load from cdn.jsdelivr.net (pinned to three@0.128.0).
- No install, server or build step.
- If startup fails you get an error panel with the failing stage, the message and
  Retry (low quality) / Reload buttons. Press G afterwards to see the error list.

CONTROLS
 Mouse (click view to capture; Esc releases)  look
 W A S D                                      walk / swim
 Shift                                        sprint on land, fin-kick in water
 Space / C                                    jump (land), swim up / down (water)
 E                                            inspect the creature in the reticle
 F  hand flashlight      L  head-mounted lamp
 V  sonar ping           T  thermal/acoustic visor      R  visor scan pulse
 X  slow-swim mode       J  species journal             H  help and settings
 G  diagnostics          B  10-second benchmark (prints FPS, frame times)
 Mobile: left joystick, drag to look, buttons for up/down, light, inspect, sonar, visor, scan.
 Quality (Low/Medium/High), volume, particles and view distance are in the H panel.

ASSET LOADER (H panel -> Asset loader)
- Import your OWN .glb (or .gltf with its .bin and textures) for the ten priority species,
  with a preview, facing and scale controls. Record the real source and license.
- Upload your OWN PBR texture maps (albedo, normal, roughness, AO, height) for sand, rock,
  coral and plants.
- No models or textures are bundled. All animals and textures are procedural placeholders,
  not photorealistic assets.

STATUS (honest)
- Verified only outside a browser: the script passes syntax checks and runs through startup,
  600 frames and a scripted walk/sprint/jump/swim/key-press playthrough against stand-in
  objects limited to the Three.js r128 API.
- NOT verified in a real browser: WebGL rendering, how it looks, shader compilation,
  real frame rate, mouse-look, mobile touch, reload behaviour.
- Not built: imported coral models, automatic texture downscaling, instanced school rendering.
- Terrain is a height-field: no true caves or overhangs.
