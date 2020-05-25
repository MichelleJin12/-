console.log("Hello no demon");
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path'); //보안
var sanitizeHtml = require('sanitize-html');//필터링 모듈

var template = require('./lib/template.js')//모듈 만들어서 사용하기

var app = http.createServer(function(request,response){
    //request : 웹브라우저로 부터 들어오는 요청에 대한 여러가지 정보를 담고 있는 객체
    //response : 이 함수안의 구현을 통해 사용자에게 전송해주고 싶은 내용을 response를 통해 응답해줌
    var _url = request.url;
    var queryData = url.parse(_url,true).query;// query parse함
    var pathname = url.parse(_url,true).pathname;
    if(pathname === '/'){ //파일을 찾을 수 있으면
      if(queryData.id === undefined){ //루트경로 -메인페이지
        fs.readdir('./data',function(error,filelist){
          var title = 'Welcome';
          var description = 'Hello Node.js';
          var list = template.list(filelist);
          var html = template.html(title, list,`<h2>${title}</h2>${description}`,`<a href="/create">create</a>`);
          response.writeHead(200);
          response.end(html); // 화면 띄우는 중
        /*
          var list = templateList(filelist);
          var template = templateHTML(title, list,`<h2>${title}</h2>${description}`,`<a href="/create">create</a>`);
      //여기서 중요한건 <a href="/?id=HTML">로 다시 url query string을 완성해서 거기로 가게 만드는 것!
      //열게되 파일 내용을 description 인자로 받고 있음!
          response.writeHead(200);
          response.end(template); // 화면 띄우는 중
        */
        });
      }else{      //본문부분 파일로 읽어오기  //readFile열때 ``사용해서 열기
          fs.readdir('./data',function(error,filelist){
            var filteredId= path.parse(queryData.id).base;//보안 - 세탁 후 상위 dir탐색 불가능(base는 딱 id만 남겨줌)
              fs.readFile(`data/${filteredId}`,'utf8',function(err,description){
                var title = queryData.id;
                var sanitizedTitle = sanitizeHtml(title);//제목과 내용 띄워줄때 살균과정 (보안)
                var sanitizedDescription = sanitizeHtml(description,{
                  allowedTags:['h1']
                });
                var list = template.list(filelist);
                var html = template.html(title, list,`<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,`
                  <a href = "/create">create</a>
                  <a href = "/update?id=${sanitizedTitle}">update</a>
                  <form action ="delete_process" method="post" onsubmit="진짜 삭제할꺼야?">
                    <input type = "hidden" name = "id" value = "${sanitizedTitle}">
                    <input type = "submit" value = "delete">
                  </form>`
              );
              //여기서 중요한건 <a href="/?id=HTML">로 다시 url query string을 완성해서 거기로 가게 만드는 것!
              //열게되 파일 내용을 description 인자로 받고 있음!
                response.writeHead(200);
                response.end(html); // 화면 띄우는 중
              });
            });
      }
    }else if(pathname === '/create'){ //새로만든 페이지로 go
      fs.readdir('./data',function(error,filelist){
        var title = 'WEB - create';
        var list = template.list(filelist);
        var html = template.html(title, list,`
          <form action="/create_process" method="post">
            <p><input type = "text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description">
              </textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
          `,'');
        response.writeHead(200);
        response.end(html);
      });
    }else if(pathname === '/create_process'){//페이지를 submit하고나서
      var body = '';
      request.on('data',function(data){ // data: 수신된 정보 조각, post data양을 조절하기 위함 - 조각조각 수신
        body = body + data;
      });
      request.on('end',function(){ // 들어올 정보 조각이 이제 더이상 없으면 자동 호출
        var post = qs.parse(body);//변수 post안에 post한 내용이 들어있음
        var title = post.title;
        var description = post.description;
        fs.writeFile(`data/${title}`,description,'utf8',function(err){
          response.writeHead(302,{Location:`/?id=${title}`});//page를 다른 곳으로 redirection 시킴
          response.end();
        })
        console.log(post);
      });
    }else if(pathname === '/update'){
      fs.readdir('./data',function(error,filelist){
        var filteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredId}`,'utf8',function(err,description){
          var title = queryData.id;
          var list = template.list(filelist);
          var html = template.html(title, list,
            //update_process 는 수정되지 않은 파일의 이름을 id로 받을 수 있음
            `<form action="/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <p><input type = "text" name="title" placeholder="title" value = ${title}></p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `
        );
        //여기서 중요한건 <a href="/?id=HTML">로 다시 url query string을 완성해서 거기로 가게 만드는 것!
        //열게되 파일 내용을 description 인자로 받고 있음!
          response.writeHead(200);
          response.end(html); // 화면 띄우는 중
        });
      });
    }else if(pathname === '/update_process'){
      var body = '';
      request.on('data',function(data){ // data: 수신된 정보 조각, post data양을 조절하기 위함 - 조각조각 수신
        body = body + data;
      });
      request.on('end',function(){ // 들어올 정보 조각이 이제 더이상 없으면 자동 호출
        var post = qs.parse(body);//변수 post안에 post한 내용이 들어있음
        var id = post.id;
        var title = post.title;
        var description = post.description;
        console.log(post);
        fs.rename(`data/${id}`,`data/${title}`,function(error){ //filename을 수정사항으로 rename
          //에러처리 아직 안함
          //내용도 수정해줌 - rename된 파일에 해당되는 것의 본문을 수정해줘야하므로, rename안!
          fs.writeFile(`data/${title}`,description,'utf8',function(err){
            console.log('write updated');
            response.writeHead(302,{Location:`/?id=${title}`});//page를 다른 곳으로 redirection 시킴
            response.end();
          });
        })
      });
    }else if(pathname === '/delete_process'){
      var body = '';
      request.on('data',function(data){
        body = body + data;
      });
      request.on('end',function(){ // 들어올 정보 조각이 이제 더이상 없으면 자동 호출
        var post = qs.parse(body);//변수 post안에 post한 내용이 들어있음
        var id = post.id;
        var filteredId= path.parse(id).base;
        fs.unlink(`data/${filteredId}`,function(error){
          response.writeHead(302,{Location:`/`});//삭제가 끝나면 홈으로 redirection
          response.end();
        });
      });
    }else{ //파일을 아예 찾지 못하면
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000); // 요청에 대해서 응답할 수 있도록 http 서버를 구동시키는 API가 listen임!
