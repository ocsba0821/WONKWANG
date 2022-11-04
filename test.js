var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
let cheerio = require('cheerio');
let request = require('request');


var path = require('path');
var express = require('express');
var session = require('express-session');
var bodyparser = require('body-parser'); //post 방식 이용 
const parser = require('xml2json');

var template = require('./lib/template.js');
var template2 = require('./lib/template2.js');
var sanitizeHtml = require('sanitize-html');
var mysql = require('mysql');
const { mainModule } = require('process');

var db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'apiuser',
    password: '1234',
    database: 'api'
});
db.connect();

var app = express();
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(express.static(__dirname + ''));

app.use(bodyparser.urlencoded({extended: true}));

app.use(bodyparser.json());


/*function templateHTML(title, list, body, control) {
    return `
      <!doctype html>
      <html>
      <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
        <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-525PG0WVQ1"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
    
      gtag('config', 'G-525PG0WVQ1');
    </script>//전체 사이트 태그 설치 사이트에 gtag.js 추가 페이지 조회수를 구글로 전달
      </head>
      <body>
        <h1><a href="/">고객상담센터</a></h1>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/3n8106brsg4" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        ${list}//이 부분이 고객상담센터 유튜브랑 나옴
    
        ${control}
        ${body}
        <!--Start of Tawk.to Script-->
        <script type="text/javascript">
        var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
        (function(){
        var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
        s1.async=true;
        s1.src='https://embed.tawk.to/635a5e34daff0e1306d442e7/1ggcfvvcr';
        s1.charset='UTF-8';
        s1.setAttribute('crossorigin','*');
        s0.parentNode.insertBefore(s1,s0);
        })();
        </script>// 채팅내용 tawk 사용함
    
    
      </body>
      </html>
      `;
  }
  function templateList(filelist) {
    var list = '<ul>';
    var i = 0;
    while (i < filelist.length) {
      list = list + `<li><a href="/bbs?id=${filelist[i]}">${filelist[i]}</a></li>`;
      i = i + 1;
    }
    list = list + '</ul>';
    return list;
  }

function templateHTML(title, list, body, control){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  }
  function templateList(filelist){
    var list = '<ul>';
    var i = 0;
    while(i < filelist.length){
      list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  }*/

  function station(name) {

    if (name == "부산") {
      return '35.11543560776758,129.04223226917358';
    } else if (name == "통영") {
      return '34.88518379783825,128.4169441180927';
    } else if (name == "경주") {
      return '35.84466079615989,129.21790345569565';
    } else if (name == "단양") {
      return '37.01916436494398,128.33858581421015';
    } else if (name == "강릉") {
      return '37.76401896414172,128.90163576922785';
    } else if (name == "울산") {
      return '35.55161428724902,129.13851672685396';
    } else if (name == "포항") {
      return '36.07196015278183,129.3419183538491';
    } else if (name == "영덕") {
      return '36.41103310776056,129.37728718454295';
    } else if (name == "울진") {
      return '36.98376867444184,129.3971215403755';
    } else if (name == "군산") {
      return '35.99947617825534,126.75978954035538';
    } else if (name == "전주") {
      return '35.850056958058765,127.16181945569575';
    } else if (name == "광주") {
      return '35.260286533439455,126.92534747510909';
    } else if (name == "순천") {
      return '34.94600883924083,127.50318489615485';
    } else if (name == "광주") {
      return '35.22582730698232,126.91483008425706';
    } else if (name == "여수") {
      return '34.75389006202851,127.74869419325849';
    } else if (name == "대구") {
      return '35.87625684854493,128.59600954035284';
    } else if (name == "안동") {
      return '36.56465859587872,128.73312024340967';
    } else if (name == "영월") {
      return '37.18266377085605,128.48073526921553';
    } else if (name == "서울") {
      return '37.56707198164024,126.97868048584694';
    } else if (name == "경주") {
      return '35.85632053281893,129.22476796399508';
    }
  }

  app.use('/', function (request, response, next){
    if (session.loggedin == true || request.url == "/login" || request.url =="/main" ||  request.url.includes("/register")){
        next();
    }//request.url =="/main" ||
    else {
        //response.redirect("http://localhost:3001/login");
        response.redirect("http://localhost:3000/main")
    }
  });



  app.get('',function (request, response){
    response.sendFile(path.join(__dirname + '/main.html'));
  });



  app.get('/main', function (request, response){
    response.sendFile(path.join(__dirname + '/main.html'));
  });

  app.get('/move', function (request, response){
    response.sendFile(path.join(__dirname + '/move.html'));
  });



  app.get('/main2', function (request, response){
    response.sendFile(path.join(__dirname + '/main2.html'));
  });

  app.get('/location', function(request, response){
    response.sendFile(path.join(__dirname + '/location.html'));
  });

  app.get('/test', function(request, response){
    response.sendFile(path.join(__dirname + '/test.html'));
  });

  app.get('/logout', function(request, response){
    session.loggedin = false;
    response.redirect("/main")
  });

  app.get('/api', function(request, response){
    response.sendFile(path.join(__dirname + '/api.html'));
  });

  app.get('/api2', function(request, response){
    response.sendFile(path.join(__dirname + '/api2.html'));
  });
  
  app.get('/api3', function(request, response){
    response.sendFile(path.join(__dirname + '/api3.html'));
  });

  app.get('/iksan', function(request, response){
    response.sendFile(path.join(__dirname + '/iksan.html'));
  });
  
  app.get('/gyungju', function(request, response){
    response.sendFile(path.join(__dirname + '/gyungju.html'));
  });
  app.get('/seoul', function(request, response){
    response.sendFile(path.join(__dirname + '/seoul.html'));
  });
  app.get('/busan', function(request, response){
    response.sendFile(path.join(__dirname + '/busan.html'));
  });

  app.get('/jeju', function(request, response){
    response.sendFile(path.join(__dirname + '/jeju.html'));
  });

  app.listen(3000);

  var test = http.createServer(function (request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if (pathname === '/') {
        if (queryData.id === undefined) {
          db.query(`SELECT * FROM topic`, function (error, topics) {
    
            var title = '고객상담 센터.';
            var description = '불편사항이나 개선사항이 있으면 알려주세요.';
            var video = '<iframe width="560" height="315" src="https://www.youtube.com/embed/3n8106brsg4" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    
            var list = template.list(topics);
            var html = template.HTML(title, list,
              `<h2>${title}</h2><h3>${description}</h3><h3>${video}</h3>`,
              // `<a href="/create">글 남기기</a>`,
              `<button id = bt type="button" onclick="location.href='/create'">글 남기기</button>`
    
            );
            response.writeHead(200);
            response.end(html);
          });
        } else {
          db.query(`SELECT * FROM topic`, function (error, topics) {
            if (error) {
              throw error;
            }
            db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function (error2, topic) {
              if (error2) {
                throw error2;
              }
              var title = topic[0].title;
              var description = topic[0].description;
              var list = template.list(topics);
              var html = template.HTML(title, list,
                `<h2>${title}</h2> <h3>${description}</h3>`,
    
    
                ` <div style="margin-bottom:10px;"><button id = bt type="button" onclick="location.href='/create'">글 남기기</button></div>
              <div style="margin-bottom:10px;">
                <button id = bt type="button" onclick="location.href='/update?id=${queryData.id}'">글 수정하기</button><div>
                <div style="margin-TOP:10px;">
                <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${queryData.id}">
                    <div id = article> <input id=w type="submit" value="글 삭제하기"> </div>
                  </form>`
              );
              response.writeHead(200);
              response.end(html);
            })
          });
        }
      } else if (pathname === '/create') {
        db.query(`SELECT * FROM topic`, function (error, topics) {
          var title = '글 남기기';
          var list = template.list(topics);
          var html = template.HTML(title, list,
            `
            <form action="/create_process" method="post">
            <div style="margin-TOP:10px;">
              <p><input type="text" name="title" required="" style="text-align:center; width:800px; height:40px; letter-spacing: 0px" placeholder="제목을 적어주세요."></p> </div>
              <p>
                <textarea name="description" required="" style="text-align:center; width:800px; height:290px; letter-spacing: 0px" placeholder="본문을 적어주세요."></textarea>
              </p>
              <p>
                <input id = bt type="submit">
              </p>
            </form>
            `,
            `<button id = bt type="button" onclick="location.href='/create'">글 남기기</button>`
          );
          response.writeHead(200);
          response.end(html);
        });
      } else if (pathname === '/create_process') {
        var body = '';
        request.on('data', function (data) {
          body = body + data;
        });
        request.on('end', function () {
          var qs = require("querystring");
          var post = qs.parse(body);
          db.query(`
              INSERT INTO topic (title, description, created, author_id) 
                VALUES(?, ?, NOW(), ?)`,
            [post.title, post.description, 1],
            function (error, result) {
              if (error) {
                throw error;
              }
              response.writeHead(302, { Location: `/?id=${result.insertId}` });
              response.end();
            }
          )
        });
      } else if (pathname === '/update') {
        db.query('SELECT * FROM topic', function (error, topics) {
          if (error) {
            throw error;
          }
          db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function (error2, topic) {
            if (error2) {
              throw error2;
            }
            var list = template.list(topics);
            var html = template.HTML(topic[0].title, list,
              `
              <form action="/update_process" method="post">
                <input type="hidden" name="id" value="${topic[0].id}">
                <p><input type="text" name="title" style="text-align:center; width:800px; height:40px; letter-spacing: 0px" placeholder="제목을 적어주세요." value="${topic[0].title}"></p>
                <p>
                  <textarea name="description" style="text-align:center; width:800px; height:290px; letter-spacing: 0px" placeholder="본문을 적어주세요.">${topic[0].description}</textarea>
                </p>
                <p>
                  <input id = bt type="submit">
                </p>
              </form>
              `,
              `<button id = bt type="button" onclick="location.href='/create'">글 남기기</button>
               <button id = bt type="button" onclick="location.href='/update?id=${queryData.id}'">글 수정하기</button>`
            );
            response.writeHead(200);
            response.end(html);
          });
        });
      } else if (pathname === '/update_process') {
        var body = '';
        request.on('data', function (data) {
          body = body + data;
        });
        request.on('end', function () {
          var post = qs.parse(body);
          db.query('UPDATE topic SET title=?, description=?, author_id=1 WHERE id=?', [post.title, post.description, post.id], function (error, result) {
            response.writeHead(302, { Location: `/?id=${post.id}` });
            response.end();
          })
        });
      } else if (pathname === '/delete_process') {
        var body = '';
        request.on('data', function (data) {
          body = body + data;
        });
        request.on('end', function () {
          var post = qs.parse(body);
          db.query('DELETE FROM topic WHERE id = ?', [post.id], function (error, result) {
            if (error) {
              throw error;
            }
            response.writeHead(302, { Location: `/` });
            response.end();
          });
        });
      }

    else if(pathname === '/login'){

        var title = '로그인 페이지 입니다.';

        var html = template2.HTML(title, "",
        `<div class="container">
        <div class="jumbotron">
          <form class="form-signin" action="login_process" method="POST">
            <h1 class="h3 mb-3 font-weight-normal">${title}</h1>
            <input type="text" id="id" name="id" class="form-control" placeholder="아이디" required=""
              autofocus="">
            <input type="password" id="password" name="password" class="form-control" placeholder="비밀번호" required="">
    
            <button class="btn btn-lg btn-primary btn-block" type="submit">로그인하기</button>
          </form>
          <a href="/join">회원가입</a>
        </div>
      </div>
      <hr>
      <footer class="text-center">
        <div class="container">
          <div class="row">
            <div class="col-12">
              <p>Copyright © MyWebsite. All rights reserved.</p>
            </div>
          </div>
        </div>`, ""
  
        
        
        
        );
        response.writeHead(200);
        response.end(html);
    }

    else if (pathname ==='/join'){

        var title = '회원가입 페이지 입니다.';
//form action join_process => join_process로 처리된다.
    var html = template2.HTML(title, "",
      `<div class="container">
      <div class="jumbotron"> 
        <form class="form-signin" action="join_process" method="POST">
          <h1 class="h3 mb-3 font-weight-normal">${title}</h1>
          <input type="text" id="username" name="id" class="form-control" placeholder="아이디" required=""
            autofocus="">
          <input type="password" id="password1" name="password1" class="form-control" placeholder="비밀번호" required="">
          <input type="password" id="password2" name="password2" class="form-control" placeholder="비밀번호 확인" required="">
  
          <button class="btn btn-lg btn-primary btn-block" type="submit">회원가입</button>
        </form>
      </div>
    </div>
    <hr>
    <footer class="text-center">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <p>Copyright © MyWebsite. All rights reserved.</p>
          </div>
        </div>
      </div>`, ""

    );
    response.writeHead(200);
    response.end(html);
    }

   
    else if (pathname === '/login_process'){
        var body ='';
        request.on('data', function (data){
            body = body + data;
        });
        request.on('end', function(){
            var qs = require("querystring");
            var post = qs.parse(body);

            db.query(`SELECT * FROM users WHERE id=?`, [post.id], function (error2, user){
                if (error2 || user.length == 0){
                    response.writeHead(302, { Location: `/login`});
                    response.end();
                } else {

                    var id = user[0].id;
                    var password = user[0].password;

                    if((id == post.id) && (password == post.password)){
                        session.loggedin = true
                        session.id = id;
                        
                        
                        response.writeHead(302, {Location: `http://localhost:3000/main2` } );
                     
                        response.end();
                    }

                    else {
                        response.writeHead('200', {'Content-Type':'text/html; charset=utf8'})
                        response.write("<script>alert('아이디 또는 비밀번호가 틀렸습니다.');location.href = document.referrer;</script>");
                        //response.writeHead(302, {Location: `/login`});
                        response.end();
                    }
                }
            })
        });
    }else if (pathname === '/logout'){
        session.loggedin = false;
        response.writeHead(302, {Location: `http://localhost:3000/main`});
        response.end();
    }

    else if (pathname === '/join_process'){
        var body = '';
        request.on('data',function(data){
            body = body + data;
        });
        request.on('end',function(){
            var qs = require("querystring");
            var post = qs.parse(body);

            if(post.password1 != post.password2){
                response.writeHead(302, {Location: `/join`});
                response.end();
                return;
            }
            db.query(`SELECT * FROM users WHERE id=?` , [post.id], function (error2, user){
                if (error2 || user.length != 0){
                    response.writeHead('200', {'Content-Type':'text/html; charset=utf8'})
                    response.write("<script>alert('이미 존재하는 아이디 입니다.');location.href = document.referrer;</script>");
                    //response.writeHead(302, {Location: `/join`});
                    response.end();
                }
                else {
                  db.query(`
                  INSERT INTO users (id, password, passcheck)
                    VALUES(?, ?, ?)`,
                    [post.id, post.password1, post.password2],
                    function(error, result) {
                      if (error) {
                        
                        response.writeHead(302, {Location: `/join`});
                        response.end();
                      }
                      response.writeHead(302, {Location: `/login`});
                      response.end();
                    }
                    
                  )
                    
                }
            });
        });
    }
    else {
      response.writeHead(404);
      response.end('Not Found');
    }

  });

  test.listen(3001);