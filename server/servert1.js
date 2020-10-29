/*
 * @Author: Sophie
 * @email: bajie615@126.com
 * @Date: 2020-01-22 15:42:18
 * @Description: file content
 */
var http = require("http");
var url = require('url');
var fs = require('fs');

function testFile(filename){
    return fs.lstatSync(filename).isFile();
}

function createlinkstr(fnames,filename,host){
    var linkstr ="";
    for (var i in fnames){
        var fi =fnames[i];
       // var  lk ="http://localhost:8080"+filename +"/"+fi;
       var lk = "http://"+host +filename +"/" +fi;
        console.log("now each link",lk);
        linkstr += "<h1><a href='"+lk+"'>"+fi+"</a></h1>";  
    }
    return linkstr;
}


http.createServer(function (req, res) {
    console.log("request url"+req.url);
    console.log("request head",req.headers.host);
    var q = url.parse(req.url, true);
    console.log("host==",q.href);
    var filename = ".." + q.pathname;
    console.log("create Server:::",filename);
    var exists = fs.existsSync(filename);
    if (exists){
        var isFile = testFile(filename);
        if(isFile){
            fs.readFile(filename, function(err, data) {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end("404 Not Found"+err.syscall);
            } 
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            return res.end();
            });
        }else{
            var htmlstr = "<html><head> <meta name='viewport'"+ 
            "content='width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no'/>"+
            "</head><body><p>Test Server</p>";
            var htmled = "</body></html>";
            var fscontents = fs.readdirSync(filename);
            var linkstr = createlinkstr(fscontents,q.pathname,req.headers.host);
            htmlstr = htmlstr +linkstr +htmled;
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(htmlstr);
            return res.end();
            
        }
    }else{
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.write("no such file"+req.url);
        res.end();
        console.log("no such file or fold exists");
    }
   
  }).listen(8080); 

// http.createServer(function(req,res){
//     //res.writeHead(200,{'Content-Type':'text/html'});
//     fs.readFile('examples/frag_sphere/frag_sphere.html',function(err,data){
//         res.write(data);
//     });

    
//     //res.end('hello world');
// }).listen(8080);