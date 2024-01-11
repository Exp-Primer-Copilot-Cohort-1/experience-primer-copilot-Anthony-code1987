// create web server
// 1. load modules
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
// 2. create web server object
var server = http.createServer(function(request,response){
    // 2.1 get url
    var parsedUrl = url.parse(request.url);
    var resource = parsedUrl.pathname;
    // 2.2 get query string as object
    var query = qs.parse(parsedUrl.query);
    // 2.3 get http method
    var method = request.method;
    // 2.4 set response header
    response.writeHead(200,{'Content-Type':'text/html'});
    // 2.5 set response body
    if(resource == '/'){
        fs.readFile('comment.html','utf-8',function(error,data){
            if(error){
                response.end('500 Internal Server '+error);
            }else{
                response.end(data);
            }
        });
    }else if(resource == '/create'){
        if(method == 'POST'){
            request.on('data',function(data){
                var body = '';
                body += data;
                var post = qs.parse(body);
                var comment = post.comment;
                console.log(comment);
                fs.appendFile('comment.txt',comment+'\n','utf-8',function(error){
                    if(error){
                        response.end('500 Internal Server '+error);
                    }else{
                        response.writeHead(302,{'Location':'/'}); // redirect
                        response.end();
                    }
                });
            });
        }else{
            response.end('405 Method Not Allowed');
        }
    }else if(resource == '/list'){
        fs.readFile('comment.txt','utf-8',function(error,data){
            if(error){
                response.end('500 Internal Server '+error);
            }else{
                response.end(data);
            }
        });
    }else{
        response.end('404 Page Not Found');
    }
});
// 3. start web server
server.listen(80,function(){
    console.log('Server running at http://localhost3000');
}   );
