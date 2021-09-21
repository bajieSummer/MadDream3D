/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-12-22 22:14:43
 * @Description: file content
 */

import { Vector3 } from "../MadDream";

var Dimensions = { unit: 0.9, peru: 0.5, g: new Vector3(0.0, -9.8, 0.0) };
var STP = { mass: 0.02, ks: 20, kd: 0.2, l0: 0.12, isFixed: false };
var SpPhyics = function (pos, v, isFixed, mass, ks, kd, l0) {
   if (pos === undefined || v === undefined) {
      console.error("pos or v is undefined");
      return;
   }
   this.pos = pos; this.v = v;
   this.mass = mass === undefined ? STP.mass : mass;
   this.ks = ks === undefined ? STP.ks : ks;
   this.kd = kd === undefined ? STP.kd : kd;
   this.l0 = l0 === undefined ? STP.l0 : l0;
   this.isFixed = isFixed === undefined ? STP.isFixed : isFixed;
};
class SlopeSpring {
   constructor(params) {
      if (params === undefined) {
         params = {};
      }
      this.Dimensions = params.Dimensions === undefined ? Dimensions : params.Dimensions;;
      this.STP = params.STP === undefined ? STP : params.STP;
      this.joints = null;
   }


   // x = 0.12 m   1.2*0.1 =0.12

   draw2Physics(pos, phPos) {
      var unit = this.Dimensions.unit;
      var peru = this.Dimensions.peru;
      var resPos = phPos;
      if (resPos === undefined) {
         resPos = new Vector3();
      }
      resPos.x = pos.x / unit * peru;
      resPos.y = pos.y / unit * peru;
      resPos.z = pos.z / unit * peru;
      return resPos;
   }
   physics2Draw(pos, dPos) {
      var unit = this.Dimensions.unit;
      var peru = this.Dimensions.peru;
      var resPos = dPos;
      if (resPos === undefined) {
         resPos = new Vector3();
      }
      resPos.x = pos.x / peru * unit;
      resPos.y = pos.y / peru * unit;
      resPos.z = pos.z / peru * unit;
      return resPos;
   }

   createSprJoint(pos, calls) {
      // var baseUrl = "../pics/MD3d_hello.png"; 
      var unit = this.Dimensions.unit;

      if (calls === undefined) {
         calls = {};
      }

      var physics0 = new SpPhyics(this.draw2Physics(pos), new Vector3(0.0, 0.0, 0.0), true);
      var physArr = [physics0];
      calls.perJoint(this, 0, pos);
      for (var i = 1; i < 10; i++) {
         //   var ct = enti.copy("box"+i);
         var d = physics0.l0 * 1.02 / this.Dimensions.peru * unit;
         var posi = new Vector3(pos.x + i * d * 0.5, pos.y + (-d) * i, pos.z + i * d * 0.2);
         calls.perJoint(this, i, posi);
         var phPos = this.draw2Physics(posi);
         // console.log("i=",i," phPos=",phPos," pos=",ct.transform.pos);

         var phy = new SpPhyics(phPos, new Vector3(0.0, 0.0, 0.0), false);
         physArr.push(phy);
      }
      this.joints = physArr;
      return physArr;
   }

   updateForces(i, entiArr) {
      //F =up(fp+fd)+ m*g + down(fp+fd)
      var phy = entiArr[i];
      if (phy.isFixed) return null;
      var phy0 = i > 0 ? entiArr[i - 1] : null;
      var phy1 = (i + 1) < entiArr.length ? entiArr[i + 1] : null;
      //(entiArr.length-i)
      // var G = -1.0*phy.mass*g;
      var G = MathUtil.V3MultiNum(Dimensions.g, phy.mass);

      var F_air = MathUtil.V3MultiNum(phy.v, -0.5 * 1.0 * 1.293 * 0.01 * MathUtil.getLength(phy.v));
      //for up:
      var upFp = new Vector3(0.0, 0.0, 0.0); var upFd = new Vector3(0.0, 0.0, 0.0);
      if (phy0 !== null) {
         var Xu = MathUtil.V3SubV3(phy0.pos, phy.pos);
         var lenXu = MathUtil.getLength(Xu);
         upFp = MathUtil.V3MultiNum(Xu, phy0.ks / lenXu * (lenXu - phy0.l0));
         upFd = MathUtil.multiplyV3(Xu, MathUtil.V3SubV3(phy0.v, phy.v));
         upFd = MathUtil.V3MultiNum(upFd, phy0.kd / lenXu);
      }
      var dnFp = new Vector3(0.0, 0.0, 0.0); var dnFd = new Vector3(0.0, 0.0, 0.0);
      if (phy1 !== null) {
         var Xdn = MathUtil.V3SubV3(phy.pos, phy1.pos);
         var lenXdn = MathUtil.getLength(Xdn);
         dnFp = MathUtil.V3MultiNum(Xdn, -1.0 * phy.ks / lenXdn * (lenXdn - phy.l0));
         dnFd = MathUtil.multiplyV3(Xdn, MathUtil.V3SubV3(phy.v, phy1.v));
         dnFd = MathUtil.V3MultiNum(dnFd, -1.0 * phy.kd / lenXdn);

      }
      // console.log("i=",i," upFp =",upFp, " upFd=",upFd, " dnFp=",dnFp," dnFd=",dnFd," F_air=",F_air);
      //upFd,,dnFd
      return MathUtil.V3ADDV3(upFp, upFd, dnFp, dnFd, G, F_air);
   }

   updatePosV(dt, F, i, entiArr) {
      var phy = entiArr[i];
      if (phy.isFixed) return;

      var a = MathUtil.V3MultiNum(F, 1.0 / phy.mass);
      // phy.v += a*dt;
      //phy.pos.y +=phy.v*dt; 
      phy.v = MathUtil.V3ADDV3(phy.v, MathUtil.V3MultiNum(a, dt));
      phy.pos = MathUtil.V3ADDV3(phy.pos, MathUtil.V3MultiNum(phy.v, dt));

      // console.log("i=",i," f=",F," a=",a," v=",phy.v," y =",phy.pos);
   }

   updateSpring(dt, spring, callbacks) {
      if (callbacks === undefined) {
         callbacks = {};
      }
      var F = [];
      for (var i = (spring.length - 1); i > 0; i--) {
         F[i] = this.updateForces(i, spring);
      }
      var that = this;
      for (var j = (spring.length - 1); j > 0; j--) {
         this.updatePosV(dt, F[j], j, spring);
         var dp = this.physics2Draw(spring[j].pos);
         if (callbacks.perJoint !== undefined) {
            callbacks.perJoint(that, j, dp);
         }
      }
      //ds.lineMesh.updateAllVertexPos(ds.linePos);
      if (callbacks.afterUpdate !== undefined) {
         callbacks.afterUpdate(that);
      }
   }

   run(callbacks, interval) {
      if (interval === undefined) interval = 0.01;
      var that = this;
      this.runHandle = window.setInterval(function () {
         that.updateSpring(interval, that.joints, callbacks);
      }, interval * 1000);
   }
   dispose() {
      window.clearInterval(this.runHandle);
   }
}

