
const app = require("express")();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require("socket.io")(http);
const mysql = require("mysql");
const port = process.env.PORT;

const dateFormat = require('dateformat');
var users = [];

// Start the server


app.use(require("express").static('data'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get("/",function(req,res){
    res.sendFile(__dirname + '/index.html');
  });

const PORT = process.env.PORT || 443;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});


  
  //conncecting nodejs to remote mysql
  /*
const con = mysql.createConnection({
   connectionLimit :   100,
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'wordpress',
    port : '3307'

  });
  con.connect();*/
 
 const con = require('./database');
 
  //  getting today's date  
  var now ;
  var today;

  var table;

  
  // This is auto initiated event when Client connects to Your Machine.  
  io.on('connection',function(socket){  
    // authenticating  and gettting user name from wp_usermeta table. 
    socket.on('validate',function(data){
      var rol=data.rol;


      var query="select meta_value from wp_usermeta where meta_key = 'nickname' and user_id = '" + data.id+ "'";
      con.query(String(query),function(err,rows){
        if(rows.length>0){
          //Getting all the messages 
          var get_message="select * from messages";
          con.query(String(get_message),function(err,get_message_rows){
        
              // saving username in socket object 
              socket.nickname=rows[0].meta_value;
              
              if (rol.includes( 'administrator' )){
                socket.nickname=rows[0].meta_value+' (admin)';
                socket.rol=true;
              }else{
                socket.rol=false;
              }
                 
              
              users.push(socket.nickname);
              io.emit('updateUsers', users);
             
              //sending response to client side code.  
        

              io.emit('user entrance',{
                info:rows[0].meta_value+" is online." ,
                message:get_message_rows,
                id:data.id
              }); 
          });
  
        }
      });
    });
      
    //inserting messages to tables and sending the messages to client side code. 
    socket.on('send msg',function(data){
      now = new Date();
      today=dateFormat(now, "yyyy-mm-dd HH:MM");


      var query="insert into messages values ('','"+data.msg+"','"+data.id+"','"+socket.nickname+"','"+today+"')";
      con.query(String(query),function(err,rows){});
     

      con.query('SELECT MAX(Id) as id FROM messages', data.username, function(err, rows) {
            if (err) {
                callback(err, null);
            } else {
              io.emit('get msg',{table:rows[0].id,user:socket.nickname,message:data.msg,id:data.id,date:today,rol:socket.rol});
            }
        });
   
  
      
    });
  

    //When user dissconnects from server.
    socket.on('disconnect', function(){


      if(typeof(socket.nickname) == "undefined")
      {
        return;
      }
        users=removeItemFromArr(users,socket.nickname);
        io.emit('exit',{message:socket.nickname});
        
        io.emit('updateUsers', users);
    
    });
  


    socket.on('delete-message', function(identifier) {
      console.log('hola');
    connection.query("DELETE FROM `messages` WHERE `id` = '"+ identifier +"'", (err) => {
        if(!err) io.emit('message', { type: 'delete-message', identifier: identifier })
    });
})


    removeItemFromArr = ( arr, item ) => {
        return arr.filter( e => e !== item );
    };


  });
  
  /*
  http.listen(81,function(){
      console.log("Listening on 81");
  });*/
<<<<<<< HEAD
=======

 /* const PORT = process.env.PORT || 8080;
http.listen(PORT, function()  {
  console.log(`App listening on port 8080`);
});*/

>>>>>>> 95dd920fed8cb49475e1bdf950c81cf409564b1a
  /*
  const PORT = process.env.PORT || 8181;
app.listen(PORT, function()  {
  console.log(`App listening on port 81`);
<<<<<<< HEAD
});*/
=======
});*/
/*
 http.listen(port function()  {
  console.log(`App listening on port { port}`);
});*/

>>>>>>> 95dd920fed8cb49475e1bdf950c81cf409564b1a
