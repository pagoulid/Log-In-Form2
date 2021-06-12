const PORT = 3002;
var fs = require('fs');
let request = require('request');
const h = require('crypto');
var uri = require('url'); 
var form = 'form.html';
var page = 'pag.com.html'
var rmethod = require('./rMethod')
var Dir = require('./dirs');
let info = [];
const max = 9999;
const min = 100;// for salt
const tokmax = 850000;
const tokmin = 10000;// for new token
let oldname='';
//let info2 = '';


  
    fs.readFile('./'+form,(err,data)=>{ // read first form file to send request
        if(!err){
            require('http').createServer((req,res)=>{
                    console.log('URI    ',req.url)
                    if(req.method == 'GET' & req.url == '/'){// in localhost load form html
                        
                        if(!err){
                            
                            res.writeHead(200,{'Content-Type':'text/html'});
                            res.write(data);
                            res.end();
                        }
                        else{
            
                            res.writeHead(500,{'Content-Type':'text/html'});
                            res.write(err);
                            res.end();
            
            
                        }
                    }
                    else if(req.method == 'GET' & req.url == '/favicon.ico'){// just send ok resp
                        res.writeHead(200);
                        res.end();
                    }
                    else if(req.method == 'GET' & req.url.split('?')[1] == 'Logout=Log-out'){
                        var uname = './'+req.url.split('&')[0].split('=')[1];
                       /* Dir.readFile(uname+'/Auth.json',(err,Authdata)=>{
                            //first arg is uname folder
                            Authdata = JSON.parse(Authdata);
                            Authdata['Payload']['token']='0';
                            var pretty = JSON.stringify(Authdata,null,4); //changes to write
                            Timeout(Writestream(uname+'/Auth.json',pretty));
                            console.log('rewrite completed');
                            setTimeout(function(){ResponseTime1(res)},3000);
                            /*setTimeout(function(res){
                                res.writeHead(301,{Location:'http://localhost:3002'});
                                res.end();
    
                            },15000);
                        });*/
                        /*setTimeout(function(res){
                            res.writeHead(301,{Location:'http://localhost:3002'});
                            res.end();

                        },15000);*/
                        console.log('i am here');
                        res.writeHead(301,{Location:'http://localhost:3002'});
                        res.end();// Logging out from main webpage
                        //clickicng logout button gets me user uri with query logout after ?

                    }
                    else if(req.method == 'POST'){
                        //var postdata = PostResponseTime(res,Postreq(req));
                        //Timeout(postdata,request.get('http://localhost:3002/'+postdata));
                        req.on('data',(chunk)=>{
                            info.push(chunk);
                            
    
                        }).on('end',()=>{
                            console.log('POST OKOK');
                            //res.writeHead(200);
                            //res.end();
                            let info2=Buffer.concat(info).toString();
                            console.log('This is ma data    ',info2);
                            /*change hash test before post*/ 
                            if(info2!='Logout=Log-out'){
                                hashinfo=info2.split('&');
                                console.log(hashinfo.length)
                                
                                nam = hashinfo[0].split('=');
                                pswd = hashinfo[1].split('=');
                                sign = hashinfo[2].split('=');
                                if(pswd[1]!=='' & nam[1]!=''){
                                    pswd[1] = h.createHash('sha256').update(pswd[1]).digest('hex');
                                    hashinfo=nam[0]+'='+nam[1]+'&'+pswd[0]+'='+pswd[1]+'&'+sign[0]+'='+sign[1];
                                    info=[];
                                    /*change hash test before post*/ 
                                    /**but in entry store hash of(hash+salt) */
                                    //res.end();
                                    
                                    res.writeHead(301,{Location:'http://localhost:3002/'+hashinfo});
                                    res.end();
    
                                }
                                else{
                                    info=[];//bug fixed else info is concatinating all queries in next reqs
                                    console.log('One of the fields is missing.All fields required');
                                    res.writeHead(301,{Location:'http://localhost:3002/'});
                                    res.end();
    
                                }

                            }
                            else{// delete token on logout and give new
                                info=[];
                                var uname = './'+oldname;
                                fs.readFile(uname+'/Auth.json',(err,Authdata)=>{
                                     //first arg is uname folder
                                     Authdata = JSON.parse(Authdata);
                                     //Authdata['Payload']['token']=h.createHash('sha256').update((Math.random()* (tokmax - tokmin) + tokmin).toString()).digest('hex');
                                     Authdata['Payload']['token']='0';//destroying token on logout
                                     // destroy old token give new
                                     var pretty = JSON.stringify(Authdata,null,4); //changes to write
                                     Timeout(Writestream(uname+'/Auth.json',pretty));
                                     console.log('rewrite completed');
                                     setTimeout(function(){ResponseTime1(res)},3000);
                                     
                                });
                                     /*setTimeout(function(res){
                                         res.writeHead(301,{Location:'http://localhost:3002'});
                                         res.end();
             
                                     },15000);
                                 });*/




                            }
                            //CHECKPOINT
 /*                           hashinfo=info2.split('&');
                            console.log(hashinfo.length)
                            
                            nam = hashinfo[0].split('=');
                            pswd = hashinfo[1].split('=');
                            sign = hashinfo[2].split('=');
                            if(pswd[1]!=='' & nam[1]!=''){
                                pswd[1] = h.createHash('sha256').update(pswd[1]).digest('hex');
                                hashinfo=nam[0]+'='+nam[1]+'&'+pswd[0]+'='+pswd[1]+'&'+sign[0]+'='+sign[1];
                                info=[];*/
                                /*change hash test before post*/ 
                                /**but in entry store hash of(hash+salt) */
                                //res.end();
  /*                              
                                res.writeHead(301,{Location:'http://localhost:3002/'+hashinfo});
                                res.end();

                            }
                            else{
                                info=[];//bug fixed else info is concatinating all queries in next reqs
                                console.log('One of the fields is missing.All fields required');
                                res.writeHead(301,{Location:'http://localhost:3002/'});
                                res.end();

                            }*/
                           
                            // on end of request send post response after retrieving data for redirection
                            // so next req is GET for localhost:port/query
                        });
                        
                        
                        
                        
                    }
                    else{// either you signed in or signed up.redir to main html page with user info in query
                        // GET req
                        fs.readFile('./'+page,(err,Pagedata)=>{
                            
                            console.log('q debug ',req.url);
                            
                            var q = req.url.split('/');
                            //var q = uri.parse(req.url).query;
                            q=q[1];
                            q=q.split('&');
                            
                            var nam = q[0].split('=');
                            var pswd = q[1].split('=');
                            var Sign = q[2].split('=');
//CHECKPOINT : MUST HASH PASSWORD BEFORE POST
/**but in entry store hash of(hash+salt)*/
                            oldname=nam[1];// to check in logout
                            if(Sign[1]=='sign-in'){// sign in create entry
                                /**Check first if user exists */
                                if(fs.existsSync('./'+nam[1])){
                                    console.log('Entry Already exists ');
                                    res.writeHead(301,{Location:'http://localhost:3002'});
                                    
                                    res.end();
                                }
                                /**Check first if user exists */
                                else{
                                    var salt = Math.random()* (max - min) + min;/// generate random salt between min,max
                                    var qq ={
    
                                        'uname':nam[1],
                                        'pswd':h.createHash('sha256').update(pswd[1]+salt.toString()).digest('base64'),//pswd[1]
                                        'salt':salt.toString()
                                    }//store salt for authentication in sign up
                                    
                                    
                                    //testing with rmethod to create entry line 182
                                    // works
                                    rmethod.checkmeth(req,(err,rm)=>{// req instead of req.method
                                        if(err){
                                            throw err;
                                        }
                                        else{
                                            Timeout(rm(qq));// wait to create entry
                                            setTimeout(function(){ResponseTime(res,Pagedata)},3000);//after 3 seconds send resp
                                            //suceeding creating the file before sending the response
                                        }
    
    
                                    });
                                }
                            }
                            else{// Sign-up
                                var qq ={

                                    'uname':nam[1],
                                    'pswd':pswd[1]
                                    
                                }
                                //req.url.replace(pswd[1],'paparia');
                                console.log('signed up');
                                rmethod.getup(qq,req,res,ResponseTime,Pagedata);// add req if not 

                            }
                                //CHECKPOINT
 
                        });
                       
                        
                }

                
        


            }).listen(PORT); 
        }
        else{
            console.log(err);
        } 
    }); 

  
// checking timeout for post
/*
    function PostResponseTime(resp,data){
        console.log('Success!!!');
        resp.writeHead(200);
        resp.end();
      
      }

    function Postreq(req){
        req.on('data',(chunk)=>{
            info.push(chunk);

        }).on('end',()=>{
            //console.log('POST OKOK');
            //res.writeHead(200);
            //res.end();
            let info2=Buffer.concat(info).toString();
            console.log('This is ma data    ',info2);
            info=[];
            return info2
        });

    }
*/

      function ResponseTime(resp,data){
        console.log('Post okok!!!');
        resp.writeHead(200,{'Content-Type':'text/html'});
        resp.write(data);
        resp.end();
      
      }



      function ResponseTime1(resp){// redirection
        console.log('redir okok!!!');
        resp.writeHead(301,{Location:'http://localhost:3002'});
        resp.end();
      
      }

    async function Timeout(func1,func2){
         await func1;//(path,(msg)=>{console.log(msg)});
        
         //setTimeout(func2,50000);
      }

      function Writestream(Filedir,query){// this func will be useful in put method
        // in put i retrieve the data , i change the data , then i send back the data to the file
         
        /**TESTT */
        
        var output = fs.createWriteStream(Filedir);
        output.write(query);
      
      
        }