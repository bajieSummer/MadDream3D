/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-01-20 17:47:05
 * @Description: file content
 */
var PlaneMode ={
    "xy":0,
    "xz":1
};

class MeshUtil{
    static createMDWelcomeMesh(){
        // get vertexBuffers
        var posArr = [
            1.0, 1.0, 0.0,
            -1.0,  1.0, 0.0,
            1.0, -1.0, 0.0,
            -1.0,  -1.0,0.0,
            -1.5, -1.2,0.0,
        ];

        var colorArr = [
            1.0,1.0,1.0,1.0,
            0.5,0.5,0.6,1.0,
            0.7,0.7,0.7,1.0,
            1.0,1.0,0.3,1.0,
            0.1,0.1,0.2,1.0,
        ];
        /**@type {Mesh} */
        var mesh = Mesh.createFromArray(5,posArr,colorArr);
        mesh.setPrimitiveType(PrimitiveType.TriangularStrip);
        return mesh;
    }

    static createCameraPlane(
        /**@type {Camera} */cam,
        color){
        var a = Math.PI*cam.fov/360.0;
       // console.log(cam.fov,a);
        var height = 2.0*Math.tan(a)*cam.near;
        var width = height*cam.asp;
        var z = -cam.near;
        //+cam.transform.pos.z
       // console.log("createCameraPlane:::",width,height,z);
        return MeshUtil.createColorPlane(width,height,color,z);
    }

    

    static createPlane(width,height,zValue,hasTangent,planeMode){

        var a = 0.5;
        var b = 0.5;
        var c = 0.0;
        if(typeof(width) === "number"){
            a = width/2.0;
        }
        if(typeof(height) === "number"){
            b = height/2.0;
        }
        if(typeof(zValue) === "number"){
            c = zValue;
        }
        
        var posArr = null;
        var vtn = [0.0,0.0,1.0];
        if(planeMode === PlaneMode.xz){
            posArr = [
                -a,c,b,
                a,c,b,
                a,c,-b,
                -a,c,-b,
            ];
            vtn =[0.0,1.0,0.0];

        }else{
            var posArr = [
                // Front face
                -a, -b,  c,
                a, -b,  c,
                a,  b,  c,
                -a,  b,  c,
            ];
        }
         var uvArr =[
             0.0,0.0,
             1.0,0.0,
             1.0,1.0,
             0.0,1.0

         ];
        var vertexNormal = [
            // Front
             vtn[0],  vtn[1],  vtn[2],
             vtn[0],  vtn[1],  vtn[2],
             vtn[0],  vtn[1],  vtn[2],
             vtn[0],  vtn[1],  vtn[2],
        ];
         /**@type {Mesh} */
         var mesh = Mesh.createFromArray(4,posArr,null);
         mesh.setPrimitiveType(PrimitiveType.TriangularFan);
         mesh.uv = uvArr;
         mesh.vertexNormal = vertexNormal;
         /**@type {Mesh} */
 
        if(hasTangent){
            var vertexTangent =[
                1.0,  0.0,  0.0,
                1.0,  0.0,  0.0,
                1.0,  0.0,  0.0,
                1.0,  0.0,  0.0,
            ];
            mesh.vertexTangent = vertexTangent;
        }

         return mesh;
    }

    static createColorPlane(width,height,color,zValue){
        var plane = MeshUtil.createPlane(width,height,zValue);
        if(color === undefined){
            color = [0.5,  0.6,  0.8,  1.0];
        }
        var vc = plane.vertexCount;
        var colorArr = null;
        if(color.length == vc*4.0)
        {   
            colorArr = color;
        }else{
            colorArr = [];
            for(var i=0; i<vc; i++){
                Array.prototype.push.apply(colorArr,color);
            }
        }
        plane.vertexColor = colorArr;
        return plane;
    }

    static createBox(width,height,thick,hasTangent,anchor){
        var a = 0.5;
        var b = 0.5;
        var c = 0.5;
        if("number" === typeof(width)){
            a = width/2.0;
        }
        if("number" === typeof(height)){
            b = height/2.0;
        }
        if("number" === typeof(thick)){
            c = thick/2.0;
        }
  

        var posArr =[
            // Front face
            -a, -b,  c,
            a, -b,  c,
            a,  b,  c,
            -a,  b,  c,
            
            // Back face
            -a, -b, -c,
            -a,  b, -c,
            a,  b, -c,
            a, -b, -c,
            
            // Top face
            -a,  b, -c,
            -a,  b,  c,
            a,  b,  c,
            a,  b, -c,
            
            // Bottom face
            -a, -b, -c,
            a, -b, -c,
            a, -b,  c,
            -a, -b,  c,
            
            // Right face
            a, -b, -c,
            a,  b, -c,
            a,  b,  c,
            a, -b,  c,
            
            // Left face
            -a, -b, -c,
            -a, -b,  c,
            -a,  b,  c,
            -a,  b, -c,


        ];
        if(anchor !== undefined){
            var dx = width*anchor[0];
            var dy = height*anchor[1];
            var dz = thick*anchor[2];
            for(var i=0;i<24;i++){
                posArr[i*3] -= dx;
                posArr[i*3+1] -= dy;
                posArr[i*3+2] -= dz;
            }
        }

         var uv =[
            // Front face
            0.0,0.0,
            1.0,0.0,
            1.0,1.0,
            0.0,1.0,
            // back face
            1.0,0.0,
            1.0,1.0,
            0.0,1.0,
            0.0,0.0,
            //top
            0.0,1.0,
            0.0,0.0,
            1.0,0.0,
            1.0,1.0,
            //bottom
            0.0,0.0,
            1.0,0.0,
            1.0,1.0,
            0.0,1.0,
            //right
            1.0,0.0,
            1.0,1.0,
            0.0,1.0,
            0.0,0.0,
            //left
            0.0,0.0,
            1.0,0.0,
            1.0,1.0,
            0.0,1.0

        ];

        var vertexNormal = [
            // Front
             0.0,  0.0,  1.0,
             0.0,  0.0,  1.0,
             0.0,  0.0,  1.0,
             0.0,  0.0,  1.0,
        
            // Back
             0.0,  0.0, -1.0,
             0.0,  0.0, -1.0,
             0.0,  0.0, -1.0,
             0.0,  0.0, -1.0,
        
            // Top
             0.0,  1.0,  0.0,
             0.0,  1.0,  0.0,
             0.0,  1.0,  0.0,
             0.0,  1.0,  0.0,
        
            // Bottom
             0.0, -1.0,  0.0,
             0.0, -1.0,  0.0,
             0.0, -1.0,  0.0,
             0.0, -1.0,  0.0,
        
            // Right
             1.0,  0.0,  0.0,
             1.0,  0.0,  0.0,
             1.0,  0.0,  0.0,
             1.0,  0.0,  0.0,
        
            // Left
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0
          ];
         
         

        var indinces = [
           0,  1,  2,       0,  2,  3,    // front
           4,  5,  6,       4,  6,  7,    // back
            8,  9,  10,     8,  10, 11,   // top
            12, 13, 14,     12, 14, 15,   // bottom
            16, 17, 18,     16, 18, 19,   // right
            20, 21, 22,     20, 22, 23,   // left
        ];

         /**@type {Mesh} */
         var mesh = Mesh.createFromArray(24,posArr,null);
         mesh.vertexIndices = indinces;
         mesh.uv = uv;
         mesh.vertexNormal = vertexNormal;
         mesh.setPrimitiveType(PrimitiveType.Triangular);
         if(hasTangent){
            var tns = [
              // Front
               1.0,  0.0,  0.0, 
              // Back
               -1.0,  0.0, 0.0,
              // Top
               1.0,  0.0,  0.0,
              // Bottom
              1.0, 0.0,  0.0,
              // Right
              0.0, 0.0,  -1.0,
              // Left
              0.0,  0.0, 1.0,
            ];
            mesh.vertexTangent = [];
            for (var i in tns){
                for (var j=0;j<4; j++){
                    mesh.vertexTangent.push(tns[i]);
                }
            }
        }
         return mesh;
    }

    static createColorBox(width,height,thick,
        /** @type {Array}
         * 6*4 Array,color:[r,g,b,a]
         * [front, back, top, bottom, right, left]
         */
        faceColors){
        var mesh = MeshUtil.createBox(width,height,thick);
        var fcs = null;
        if(faceColors instanceof(Array)){
            fcs = faceColors;
        }else{
            fcs =  [
                [0.8,  0.8,  0.8,  1.0],    // Front face: white
                [0.7,  0.4,  0.4,  1.0],    // Back face: red
                [0.55,  0.70,  0.35,  1.0],    // Top face: green
                [0.3,  0.3,  0.7,  1.0],    // Bottom face: blue
                [0.7,  0.7,  0.3,  1.0],    // Right face: yellow
                [0.7,  0.35,  0.65,  1.0],    // Left face: purple
              ];
        }
        var colorArr = [];
        for (var i in fcs){
            var fc = fcs[i];
            // every 4 vertexs decide a face
            for (var j=0; j<4; j++){
                Array.prototype.push.apply(colorArr,fc);
            }
        }
        mesh.vertexColor = colorArr;
        return mesh;


    }
    static createSphereIndices(i,j,columns,indices){
        if(i>0){         
            if(j===0){
                // last row (i-1)*columns+j  (i-1)*columns+j+1
                var fp1 = (i-1)*columns+j;
                var fp2 = i*columns+j;
                var fp3 = fp1+1;
                indices.push(fp1,fp2,fp3);
            }else if(j===columns-1){
                //p1/p2 (i)*columns+j-1  (i)*columns+j+1
                var ep1 =(i)*columns+j-1;
                var ep2 =i*columns+j;
                var ep3 =(i-1)*columns+j;
                indices.push(ep1,ep2,ep3);
            }else{
                var mp1 = i*columns+j-1;
                var mp2 = i*columns+j;
                var mp3 = (i-1)*columns+j;
                var mp4 = (i-1)*columns+j+1;
                //1,2,3 2,4,3
                indices.push(mp1,mp2,mp3);
                indices.push(mp3,mp2,mp4);
            }
        }

    }

    static createSphere(radius,rows,columns,hasTangent){
        if(radius === undefined){
            radius = 1;
        }

        if(rows===undefined){
            rows = 20;
        }
        if(columns === undefined){
            columns =20;
        }

        var uv = [];
        var vertexNormal = [];
        var posArr = [];
        var indices = [];
        var vT = [];
       // console.log("rows>>>>>columns>>>",rows,columns);
        for (var i=0; i<rows;i++){
            // map lon from 0-1 to 0 to PI
            var lat = i/(rows-1);
            // map from 0-1 to -PI to PI
            //lat =(lat*2.0-1)*Math.PI;
            lat = lat*Math.PI;
            for (var j=0; j<columns;j++){
                var lon = j/(columns-1);
                // map from 0-1 to PI to -PI
                lon = (1.0-lon*2.0)*Math.PI;
                var y = Math.cos(lat);
                var x = Math.sin(lat)*Math.cos(lon);
                var z = Math.sin(lat)*Math.sin(lon);
                posArr.push(x*radius,y*radius,z*radius);
                vertexNormal.push(x,y,z);
                uv.push(j/(columns-1.0),1.0-i/(rows-1.0));
                if(hasTangent){
                    var vtz = Math.cos(lon);
                    var vtx = Math.sin(lon);
                    vT.push(vtx,0,vtz);
                }
                MeshUtil.createSphereIndices(i,j,columns,indices);
            }
        }
        //console.log(uv.length);
        /**@type {Mesh} */
        var mesh = Mesh.createFromArray(rows*columns,posArr,null);
        mesh.uv = uv;
        mesh.vertexNormal = vertexNormal;
        mesh.vertexIndices = indices;
        if(hasTangent){
            mesh.vertexTangent = vT;
        }
        mesh.setPrimitiveType(PrimitiveType.Triangular);
        return mesh;
    }

    static createDoughnuts(iradius, oradius,rows,columns){
        if(iradius === undefined){
            iradius = 0.7;
        }
        if(oradius === undefined){
            oradius = 1;
        }
        if(rows===undefined){
            rows = 20;
        }
        if(columns === undefined){
            columns =20;
        }
        var uv = [];
        var vertexNormal = [];
        var posArr = [];
        var indices = [];

        var pradius =(oradius - iradius)/2.0; 
        for (var i=0; i<rows;i++){

            var lat = i/(rows-1); // piple angle 
            lat = lat*2.0*Math.PI;
            for (var j=0; j<columns;j++){
                var lon = j/(columns-1);
                lon = lon*2.0*Math.PI; // 
                var y = Math.sin(lat)*pradius;
                var l = Math.cos(lat)*pradius+pradius+iradius;
                
                var x = l*Math.cos(lon);
                var z = l*Math.sin(lon);
                posArr.push(x,y,z);
                var pcx =(iradius+pradius)*Math.cos(lon);
                var pcy = 0.0;
                var pcz =(iradius+pradius)*Math.sin(lon);
                // console.log("now>>>>>");
                // console.log(i,j,lat,lon);

                // console.log("point center",pcx,pcy,pcz);
                // console.log("vertex",x,y,z);
                var nx = x-pcx; var ny = y-pcy;  var nz = z - pcz;
                var nl = MathUtil.getLength(nx,ny,nz);
                vertexNormal.push(nx/nl,ny/nl,nz/nl);
                uv.push(j/(columns-1),i/(rows-1));
                MeshUtil.createSphereIndices(i,j,columns,indices);
            }
            // 0 1 2 3...columns-1
            // columns ..........2columns -1
            // ri*columns + 0 ri*columns + 1 ..... ri*columns + columns-1


        }
        //console.log(indices);
        /**@type {Mesh} */
        var mesh = Mesh.createFromArray(rows*columns,posArr,null);
        mesh.uv = uv;
        mesh.vertexNormal = vertexNormal;
        mesh.vertexIndices = indices;
        mesh.setPrimitiveType(PrimitiveType.Triangular);
        return mesh;
    }

    static createCircle(r,nums){
        if(r===undefined){
            r =1.0;
        }
        if(nums === undefined){
            nums = 30;
        }
        var posArr = [];
        var vertexNormal = [];
        var uv =[];
        posArr.push(0,0,0);
        uv.push(0.5,0.5);
        vertexNormal.push(0,1,0);
        var vertexIndices = [];
        for(var i = 0; i<nums;i++){
            // map from 0-1, to 0,360
            var t = i/nums*Math.PI*2.0;
            // x,z plane
            //var z = -1.0*Math.cos(t);
            //var x = Math.sin(t);
            var x = Math.sin(t);
            var z = Math.cos(t);
            var y = 0.0;
            posArr.push(r*x,y,r*z);
            vertexNormal.push(0,1,0);
            var u = x*0.5 + 0.5;
            var v = z*0.5 + 0.5;
            uv.push(u,v);
            if(i>0){
                //vertexIndices.push(0,i+1,i);
                vertexIndices.push(0,i,i+1);
            }
        }
        vertexIndices.push(0,nums,1);  
        var mesh = Mesh.createFromArray(nums+1,posArr,null);
        mesh.uv = uv;
        mesh.vertexNormal = vertexNormal;
        mesh.vertexIndices = vertexIndices;
        mesh.setPrimitiveType(PrimitiveType.Triangular);
        return mesh; 
    }

    static createTaper(height,radius,nums){
        var posArr = [];
        var uv =[];
        var vertexNormal = [];
        //var vertexIndices = [];
    
        for(var i=0; i<nums; i++){
            var lat = i/(nums);
            // map lat from 0,1 to 0,2PI
            lat = lat*Math.PI *2.0;
            // point h
            posArr.push(0,height,0);
            uv.push(0.5,0.5);
            // point 1
            var z1 = Math.cos(lat); 
            var x1 = Math.sin(lat);
            posArr.push(radius*x1,0,radius*z1);
            var v1 = 0.5*z1 +0.5;
            var u1 = 0.5*x1 +0.5;
            uv.push(u1,v1);
            // point 2
            var k = i+1;
            if(i==nums-1){
                k = 0;
            }
            var lat2 = k/(nums);
            lat2 = lat2*Math.PI*2.0;
            var z2 = Math.cos(lat2);
            var x2 = Math.sin(lat2);
            posArr.push(radius*x2,0,radius*z2);
            var v2 = 0.5*z2 +0.5;
            var u2 = 0.5*x2 +0.5;
            uv.push(u2,v2);
            // vertex normal    dh = (x,y,z)- h(0,height,0), (x,y-height,z)
            // dr = (x,y,z) - (0,y,0)   (x,0,z) 
            //vn = dr- dot(dr,norm(dh))*norm(dh)
            var xh=0.5*(x2-x1)+x1; var zh = 0.5*(z2-z1)+z1;
            var yh = 0.0;
            var dr = new Vector3(xh,0,zh);
            var dh = new Vector3(xh,yh-height,zh);
            var ndh = MathUtil.normalize(dh);
            var lh= xh*ndh.x+zh*ndh.z;
            var nx = dr.x- ndh.x*lh; var ny = dr.y -ndh.y*lh;
            var nz = dr.z -ndh.z*lh;
            for (var h =0; h<3; h++){
                vertexNormal.push(nx,ny,nz);
            }

            // bottom triangluar
           posArr.push(radius*x2,0,radius*z2);
           posArr.push(radius*x1,0,radius*z1);
           posArr.push(0,0,0);
           uv.push(u2,v2);
           uv.push(u1,v1);
           uv.push(0.5,0.5);
           for (var t =0; t<3; t++){
            vertexNormal.push(0,-1,0);
        }




        }
        console.log(posArr);
        var mesh = Mesh.createFromArray(nums*6,posArr,null);
        mesh.uv = uv;
        mesh.vertexNormal = vertexNormal;
        mesh.setPrimitiveType(PrimitiveType.Triangular);
        return mesh; 
        
    }


    static createTaper_origin(height,radius,rows,columns){
        var posArr = [];
        var uv =[];
        var vertexNormal = [];
        var vertexIndices = [];
        for(var i=0; i<rows; i++){
            var v = i/(rows-1.0);
            //map to 0 - pi
            var lat =v*Math.PI;
            for(var j=0; j<columns; j++){
                var u = j/(columns-1.0);
                // map to 0 - 2*Pi 
                var lon = 2*u*Math.PI;
                var y = (1.0-v)*height;
                var r = radius*y/height;
                var z = r*Math.cos(lon);
                var x = r*Math.sin(lon);
                posArr.push(x,y,z);
                uv.push(u,v);
                // vertex normal    dh = (x,y,z)- h(0,height,0),
                // dr = (x,y,z) - (0,y,0)   (x,0,z) 
                //vn = dr- dot(dr,norm(dh))*norm(dh)
                var dr = new Vector3(x,0,z);
                var ndh = MathUtil.normalize(x,y-height,z);
                var lh= x*ndh.x+z*ndh.z;
                var nx = dr.x- ndh.x*lh; var ny = dr.y -ndh.y*lh;
                var nz = dr.z -ndh.z*lh;
                vertexNormal.push(nx,ny,nz);
                MeshUtil.createSphereIndices(i,j,columns,vertexIndices);
            }
            console.log(posArr);
            var mesh = Mesh.createFromArray(rows*columns,posArr,null);
            mesh.uv = uv;
            mesh.vertexNormal = vertexNormal;
            mesh.vertexIndices = vertexIndices;
            mesh.setPrimitiveType(PrimitiveType.Triangular);
            return mesh; 
            
        }
    }

    static createLine(posArr,colorArr){

        var count = posArr.length/3;
         /**@type {Mesh} */
         var mesh = Mesh.createFromArray(count,posArr,colorArr);
         mesh.setPrimitiveType(PrimitiveType.LineStrip);
         /**@type {Mesh} */
         return mesh;
    }
}