/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-01-24 17:57:44
 * @Description: file content
 */

function initCanvas(canvasId) {
  // init Canvas
  var canvas = document.getElementById(canvasId);
  /** @type {WebGLRenderingContext} */
  var gl = canvas.getContext("webgl");
  if (gl === null) {
    gl = canvas.getContext("experimental-webgl");
  }
  if (gl === null) {
    alert("Unable to initialize the webgl context");
  }
  /** @type {WebGLRenderingContext} */
  return gl;
}

function initCamera(gl) {
  var asp = gl.canvas.clientWidth / gl.canvas.clientHeight;
  var cam = new Mad3D.Camera();
  /**@type {Transform} */
  var transform = cam.transform;
  cam.setFov(45);
  cam.setFar(100.0);
  cam.setNear(0.1);
  cam.setAsp(asp);
  transform.setPosition(0, 0, 6);
  transform.rotate(0, 0, 0);
  return cam;
}
var T = 5.0;
function createSineBoxes(/**@type {Entity}*/ enti) {
  var ents = [];
  var sc = 0.3;
  var nums = 30;
  //var T = 5.0;
  var nT = 3;
  var delt = (T * nT) / nums;
  var pos = enti.transform.pos;
  for (var i = 0; i < nums; i++) {
    var enti1 = enti.copy();
    enti1.transform.setPosition(pos.x, pos.y, pos.z);
    enti1.transform.resetScale(sc, sc, sc);
    var x = i * delt;
    var f = (Math.PI * 2.0) / T;
    var y = Math.sin(f * x);
    //console.log(x,y);
    enti1.transform.translate(x, y, 0);
    ents.push(enti1);
  }
  //ents.push(enti);
  return ents;
}

function initScene() {
  /**@type {WebGLRenderingContext} */
  var gl = initCanvas("sipc");
  //gl.enable(gl.CULL_FACE);
  //gl.cullFace(gl.FRONT);
  // set projection and mv matrix

  var cam = initCamera(gl);
  // create Mesh:
  //var mesh =createSqModelMesh();
  //var mesh = MeshUtil.createColorBox();
  var mesh = Mad3D.MeshUtil.createColorPlane();
  var material = Mad3D.MaterialUtil.createFromShader(simple_vs, simple_fs);
  material.shaderOption.vertexColor = true;

  //var ets = [];
  var entity = new Mad3D.Entity("t1");
  entity.mesh = mesh;
  entity.material = material;
  entity.transform.translate(-4, -1.5, 0);
  var ets = createSineBoxes(entity);
  // test anim

  //var ets  [];
  //ets.push(entity);
  // entity.transform.translate(2,1,0);
  //entity.transform.rotate(0,0,5);
  // ets.push(entity);

  // ets.push(ent2);
  //entity.transform.translate(0.5,0.2,0);
  var scene = new Mad3D.Scene();

  scene.addCamera(cam);
  scene.entityList = ets;
  scene.gl = gl;
  return scene;
}

function batchAnis(scene, ets) {
  var anis = {};
  for (var i in ets) {
    var enti = ets[i];
    var name = "ani" + i;
    anis[name] = test_animation(scene, enti);
  }
  return anis;
}

function test_animation(scene, enti) {
  var pos = enti.transform.pos;
  heit = Math.sin((pos.x * Math.PI * 2.0) / T) - pos.y;
  var m1 = Mad3D.TransformAni(scene, enti.transform, {
    targets: enti.transform.pos,
    y: heit,
    duration: 3000,
    direction: "alternate",
    loop: 10,
    easing: "easeInOutCirc",
    autoplay: true,
    update: function (anim) {
      // console.log("dd",enti.transform.pos.y);
    },
  });

  var m2 = Mad3D.TransformAni(scene, enti.transform, {
    targets: enti.transform.rot,
    x: 180,
    duration: 3000,
    direction: "alternate",
    loop: 4,
    easing: "easeInOutCirc",
    autoplay: true,
    update: function (anim) {
      //console.log("dd",anim.progress);
    },
  });

  return [m1, m2];
}

function main() {
  scene = initScene();

  scene.enableActiveDraw(true);
  scene.draw();
  var anis = batchAnis(scene, scene.entityList);
  UIMain(scene, anis);
}

window.onload = main;
