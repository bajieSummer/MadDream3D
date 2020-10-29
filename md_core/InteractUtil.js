/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-02-02 11:08:31
 * @Description: file content
 */
class InteractUtil{
    static  registerMovehandler(canvas,transform,ranges,moveCallback){
        var wid = canvas.clientWidth;
        var het = canvas.clientHeight;
        if(ranges===undefined){
            ranges = [360,180];
        }
        var res = {sx:-1,sy:-1,px:-1,py:-1,width:wid,height:het,range:ranges,state:-1};
        canvas.addEventListener("touchmove",function(evt){
            InteractUtil.responseToTouchRot(evt,transform,1,res,moveCallback);
        },false);
        canvas.addEventListener("touchstart",function(evt){
            InteractUtil.responseToTouchRot(evt,transform,0,res);
        },false);
        canvas.addEventListener("touchend",function(evt){
            InteractUtil.responseToTouchRot(evt,transform,2,res);
        },false);

        canvas.addEventListener("mousemove",function(evt){
            InteractUtil.responseToMouseRot(evt,transform,1,res,moveCallback);
        },false);
        canvas.addEventListener("mousedown",function(evt){
            InteractUtil.responseToMouseRot(evt,transform,0,res);
        },false);
        canvas.addEventListener("mouseup",function(evt){
            InteractUtil.responseToMouseRot(evt,transform,2,res);
        },false);
    }

    static responseToMouseRot(
        /**@type {TouchEvent} */ev,
        /**@type {Transform} */tf,
        type,res,moveCallback){   
            switch(type){
                case 0:// touch start
                    {
                        res.state = 0;
                        res.sx = ev.clientX;
                        res.sy = ev.clientY;
                        res.px = ev.clientX;
                        res.py = ev.clientY;
                    }
                    break;
                case 1: // touch move
                    {   if(res.state === 0){
                            var deltx = (ev.clientX-res.px)/res.width;
                            var delty = (ev.clientY -res.py)/res.height;
                            var ax = deltx*res.range[0];
                            var ay = delty*res.range[1];
                            //console.log(ax);
                            tf.rotate(ay,ax,0);
                            // 
                            if(moveCallback!==undefined && moveCallback!==null){
                                moveCallback(tf);
                            }
                            //console.log
                            res.px = ev.clientX;
                            res.py = ev.clientY;
                        }
                        
                    }   
                    break;
                case 2:
                    {
                        res.state = 2;
                    }
                    break;
            }
    
    }
    
    static responseToTouchRot(
        /**@type {TouchEvent} */ev,
        /**@type {Transform} */tf,
        type,res,moveCallback){
            var tc = ev.touches[0];
            
            switch(type){
                case 0:// touch start
                    {
                        res.sx = tc.clientX;
                        res.sy = tc.clientY;
                        res.px = tc.clientX;
                        res.py = tc.clientY;
                    }
                    break;
                case 1: // touch move
                    {   
                        var deltx = (tc.clientX-res.px)/res.width;
                        var delty = (tc.clientY -res.py)/res.height;
                        var ax = deltx*res.range[0];
                        var ay = delty*res.range[1];
                        //console.log(ax);
                        tf.rotate(ay,ax,0);
                        // 
                        if(moveCallback!==undefined && moveCallback!==null){
                            moveCallback(tf);
                        }
                        //console.log
                        res.px = tc.clientX;
                        res.py = tc.clientY;
                    }   
                    break;
                case 2:
                    {
    
                    }
                    break;
            }
    
    }

    static registerCameraMove(/**@type {Camera}*/ cam,canvas,moveCallback){
        cam.transform.rotOrder = RotationOrder.zyx;
        var initPos = new Vector3(cam.transform.pos.x,cam.transform.pos.y,cam.transform.pos.z);
        InteractUtil.registerMovehandler(canvas,cam.transform,[360,45],function(tf){
            var r = Math.sqrt(initPos.x*initPos.x +initPos.y*initPos.y + initPos.z*initPos.z);
            var cita = tf.rot.x*Math.PI/180.0;
            tf.pos.y = -1.0*r*Math.sin(cita);
            var l  = 1.0*r*Math.cos(cita);
            var cita2 = tf.rot.y*Math.PI/180.0;
            tf.pos.x =l*Math.sin(cita2);
            tf.pos.z =l*Math.cos(cita2);
            if(!MathUtil.isNone(moveCallback)){
                moveCallback(cam.transform);
            }
        });
       
    }
}