function addSheetFile(path){
        var fileref=document.createElement("link")
        fileref.rel="stylesheet";
        fileref.type="text/css";
        fileref.href=path;
        fileref.media="screen";
        var headobj=document.getElementsByTagName('head')[0];
        headobj.appendChild(fileref);
}
function show() {
    var infoConsole = document.getElementById('info');
    var type = infoConsole.getAttribute("type");
    if (type === "0") {
        infoConsole.style.cssText = "width:100vw;height:40vh;";
        infoConsole.setAttribute("type", "1");
    } else {
        infoConsole.removeAttribute('style');
        infoConsole.setAttribute("type", "0");
    }
}
function insertStyleInHead(css){
    head = document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    if(style.styleSheet){
        style.styleSheet.cssText = css;
    }else{
        style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
}

function addLogger(){
    var obj1 = document.getElementsByTagName("body")[0]; 
    obj1.innerHTML = obj1.innerHTML + "<div id='info' onClick='show();' type='0'></div>";
    insertStyleInHead("\
        #info{position: fixed;\
        right: 0;\
        bottom: 0;\
        width: 20px;\
        height: 20px;\
        background: rgba(10, 10, 10, .8);\
        overflow: scroll;\
        font-size: 10px\
        z-index: 999;\
        -webkit-tap-highlight-color: transparent;\
    }\
    #info h3 {\
        color: white;\
        word-wrap: break-word;\
        white-space: pre;\
    }\
    #info h3:nth-child(odd) {\
        background-color: rgba(0, 0, 0, .4);}");
    var infoConsole = document.getElementById('info');
    if (infoConsole) {
        if (console) {
            var _console = {
                log: console.log
            };
            console.log = function (attr) {
                _console.log(attr);
                var str = JSON.stringify(attr, null, 4);
                var node = document.createElement("H3");
                var textnode = document.createTextNode(str);
    
                node.appendChild(textnode);
                infoConsole.appendChild(node);
            };
        }
    }
}

addLogger();