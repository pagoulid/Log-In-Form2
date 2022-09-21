const PORT = 3002;
var fs = require('fs');
let request = require('request');
const h = require('crypto');
var uri = require('url'); 
var form = 'form.html';
var page = 'pag.com.html'
var AuthErrPage = 'AuthenticationErr.html'
var AuthzErrPage = 'AuthorizationErr.html'
var rmethod = require('./rMethod')
var Dir = require('./dirs');
let info = [];// for POST data
const max = 9999;
const min = 100;// for salt
const tokmax = 850000;
const tokmin = 10000;// for new token
let oldname='';



  
    fs.readFile('./'+form,(err,data)=>{ // read first form file to send request
        if(!err){
            require('http').createServer((req,res)=>{
                    
                    if(req.method == 'GET' & req.url == '/'){// form html
                        console.log('GET    ',req.url)      
                        res.writeHead(200,{'Content-Type':'text/html'});
                        res.write(data);
                        res.end();
                    }
                    else if(req.method == 'GET' & req.url == '/favicon.ico'){
                        console.log('GET    ',req.url)
                        res.writeHead(200);
                        res.end();
                    }
                    else if(req.method == 'GET' & req.url == '/Auth_err'){
                        console.log('GET    ',req.url)
                        fs.readFile('./'+AuthErrPage,(err,Pagedata)=>{
                            res.writeHead(200,{'Content-Type':'text/html'});
                            res.write(Pagedata);
                            res.end();

                        })
                        
                        

                    }
                    else if(req.method == 'GET' & req.url == '/Authz_err'){
                        console.log('GET    ',req.url)
                        fs.readFile('./'+AuthzErrPage,(err,Pagedata)=>{
                            res.writeHead(200,{'Content-Type':'text/html'});
                            res.write(Pagedata);
                            res.end();

                        })
                        
                        

                    }
                    else if(req.method == 'POST'){
                        console.log('POST    ',req.url)
                        req.on('data',(chunk)=>{
                            info.push(chunk);
                            
    
                        }).on('end',()=>{
                            
                            let info2=Buffer.concat(info).toString();
                            console.log('POST data:   ',info2);
                            
                            if(info2!='Logout=Log-out'){
                                hashinfo=info2.split('&');
                                
                                nam = hashinfo[0].split('=');// e.g ['name','John']
                                pswd = hashinfo[1].split('=');
                                sign = hashinfo[2].split('=');
                                /*if empty field redir to form else make a get req for sign in auth or just sign up registration  */ 
                                if(pswd[1]!=='' & nam[1]!=''){
                                    pswd[1] = h.createHash('sha256').update(pswd[1]).digest('hex');
                                    hashinfo=nam[0]+'='+nam[1]+'&'+pswd[0]+'='+pswd[1]+'&'+sign[0]+'='+sign[1];
                                    info=[];
                                    /*change hash test before post*/ 
                                    /**but in entry store hash of(hash+salt) */
                                    
                                    res.writeHead(301,{Location:'http://localhost:3002/'+hashinfo});//see else at line 92
                                    res.end();
    
                                }
                                else{
                                    info=[];
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
                            }
                            // on end of request send post response after retrieving data for redirection
                            // so next req is GET for localhost:port/query
                        });   
                    }
                    else{// either you signed in or signed up.redir to main html page with user info in query
                        // GET req
                        fs.readFile('./'+page,(err,Pagedata)=>{
                            
                            //console.log('GET ',req.url);
                            
                            var q = req.url.split('/');
                            
                            q=q[1];
                            q=q.split('&');//['name=...','pswd=...','sign=...']
                            
                            var nam = q[0].split('=');
                            var pswd = q[1].split('=');
                            var Sign = q[2].split('=');
                            /**in entry store hash of(hash+salt)*/
                            oldname=nam[1];// to check in logout
                            if(Sign[1]=='sign-up'){
                                /**Check first if user already exists */
                                if(fs.existsSync('./'+nam[1])){
                                    console.log('Entry Already exists ');
                                    res.writeHead(301,{Location:'http://localhost:3002'});
                                    
                                    res.end();
                                }
                                /**Check first if user already exists */
                                else{
                                    var salt = Math.random()* (max - min) + min;/// generate random salt between min,max
                                    var qq ={
    
                                        'uname':nam[1],
                                        'pswd':h.createHash('sha256').update(pswd[1]+salt.toString()).digest('base64'),
                                        'salt':salt.toString()
                                    }
                                    
                                    
                                    //checkmeth returns a function relative to the given req method
                                    rmethod.checkmeth(req,(err,rm)=>{
                                        if(err){
                                            throw err;
                                        }
                                        else{
                                        
                                            rm(qq);//suceeding creating folder, files before sending the response
                                            setTimeout(function(){ResponseTime(res,Pagedata)},3000);   
                                        }
                                    });
                                }
                            }
                            else{// Sign-in
                                var qq ={

                                    'uname':nam[1],
                                    'pswd':pswd[1]
                                    
                                }
                                
                                rmethod.getup(qq,res,ResponseTime,Pagedata);// add req if not 

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


      function ResponseTime(resp,data){
        console.log('Sending Response...');
        resp.writeHead(200,{'Content-Type':'text/html'});
        resp.write(data);
        resp.end();
      
      }



      function ResponseTime1(resp){// redirection
        
        resp.writeHead(301,{Location:'http://localhost:3002'});
        resp.end();
      
      }

    async function Timeout(func1,func2){
         await func1;
    
      }

      function Writestream(Filedir,query){// this func will be useful in put method
        // in put i retrieve the data , i change the data , then i send back the data to the file
         
        /**TESTT */
        
        var output = fs.createWriteStream(Filedir);
        output.write(query);
      
      
        }