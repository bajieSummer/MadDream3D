/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-01-20 16:09:11
 * @Description: file content
 */
function UIMain(Scene,anis){
    var aniUI = document.getElementById("aniS");
    for(var key in anis){
        aniUI.innerHTML +="<option value='"+key+"'>"+key+"</option>";
    }
     
    var currentAni = anis["ani0"];
    var playAniUi = document.getElementById("playUi");
    var pauseAniUi = document.getElementById("pauseUi");
    aniUI.addEventListener("change",function(){
        currentAni = anis[aniUI.value];
    });
    playAniUi.addEventListener("click",function(){
        for (var i in currentAni){
            currentAni[i].play();
        }
       
    });

    pauseAniUi.addEventListener("click",function(){
        for (var i in currentAni){
            currentAni[i].pause();
        }
    });
}
