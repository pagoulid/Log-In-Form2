
const h = require('crypto');


   

// initialization Auth
var Auth ={
    "Header":{
        "Alg":"SHA256",
        "Type":"GWT"


    },
    "Payload":{
        "user":"0",
        "pswd":"0",
        "token":"1" // cause i give 0 to token when i destroy it
        
    },
    "Salt":"0"
}
// initialization Auth


let old = 'pswd';
let Dir = require('./dirs');
let fs = require('fs');
const max = 850000;
const min = 10000;
let Authcheck = false;



methods={}
_methods={}

methods.checkmeth = function (req,callback){// return relative function due to req else error

    var Metharray=['PUT','POST','GET','DELETE'];

    if(Metharray.indexOf(req.method)>-1){
        /*call respective method*/ 
        var rm = _methods[req.method.toLowerCase()];
        callback(false,rm);
    }
    else{
        callback(true);
    }

}

methods.getup=  function (qpath,resp,resfunc,info){// if sign up must check if user exists
  // in get read first auth to validate  

    Dir.read('./'+qpath['uname'],qpath['uname']+'.json',(err,data)=>{
        
        if(err|data==0){// return 0 if data does not exist
            console.log(err);// succesful read or NOT!!
            resp.writeHead(500);
            resp.end('File does not exist or cannot read file ');
        }
        else{
            var Origindata = JSON.parse(data);
            var GivenHash = h.createHash('sha256').update(qpath['pswd']+Origindata['salt']).digest('base64');
            //SOS stored pswd is hash , given is raw (from qpath)
            Dir.read('./'+qpath['uname'],'Auth.json',(err,Authdata)=>{
                Authdata = JSON.parse(Authdata);
                // construct given auth
                /*Given Auth creation */// auth is given and authdata is origin
                Auth["Payload"]["user"]=qpath["uname"];
                Auth["Payload"]["pswd"]=GivenHash;
                if(Authdata["Payload"]["token"]!='0'){// cant give token only the system gives you
                    console.log('Authorization Failed!');
                    resp.writeHead(301,{Location:'http://localhost:3002/Authz_err'});
                    resp.end();

                }
                else{
                    Authdata['Payload']['token']=h.createHash('sha256').update((Math.random()* (max - min) + min).toString()).digest('hex');
                    Auth["Payload"]["token"]=Authdata["Payload"]["token"];//test token SOS

                    Auth["Salt"]=Authdata["Salt"];
  
        
                    var signature = H(Authdata);
                    var validate =H(Auth);
            
  
                    if(Origindata['pswd']==GivenHash){
                        if(validate==signature){
                            var pretty = JSON.stringify(Authdata,null,4); //changes to write
                            Timeout(Writestream('./'+Origindata['uname']+'/Auth.json',pretty));//test token SOS
                        // give new token on signup
                            console.log('Authentication & Authorization Completed');
                            setTimeout(function(){resfunc(resp,info)},3000);
                        }
                        else{// invalid signature
                    
                            console.log('Authorization Failed!');
                           
                            resp.writeHead(301,{Location:'http://localhost:3002/Authz_err'});
                            resp.end();


                        }
    
                    }
                    else{// invalid password
                        console.log('Authentication Failed');
                        
                        resp.writeHead(301,{Location:'http://localhost:3002/Auth_err'});
                        resp.end();

                
                    }
                }
             });
        }
    });

 
}
 

    
// method for sign-in
_methods.get=   function (qpath){// namefile,content is the query
    /*first use testfolder as main directory*/ 
    
    var curr = './';
    var f =  qpath['uname'];
    var c =  '0';
   
    var nxt_curr = './'+ qpath['uname'];
    var nxt_f = qpath['uname']+'.json';
    var nxt_c =  JSON.stringify(qpath,null,4);


    var nxt_nxt_curr = './'+ qpath['uname'];
    var nxt_nxt_f = 'Auth.json';
    
    
/*Auth creation */
    Auth["Payload"]["user"]=qpath["uname"];
    Auth["Payload"]["pswd"]=qpath["pswd"];
    Auth["Payload"]["token"]=h.createHash('sha256').update((Math.random()* (max - min) + min).toString()).digest('hex');
    // creation of token
   
    Auth["Salt"]=qpath["salt"];/// store given salt from qpath
/*Auth creation */
    
    var nxt_nxt_c =  JSON.stringify(Auth,null,4);//prettify auth json after giving values
    Timeout([FolderFuncsync(curr,f,c),FileFuncsync(nxt_curr,nxt_f,nxt_c),FileFuncsync(nxt_nxt_curr,nxt_nxt_f,nxt_nxt_c)]);
    /*Create namefolder if not exist,then create json and auth files*/ 
   
}

async function Timeout(funcArray){// timeout for creation
   
    for(func in funcArray){
        await func;
    }
    
  }


/*hash function*/
function H(json){
    var buff1 = Buffer.from(JSON.stringify(json.Header)).toString('base64');
    var buff2 = Buffer.from(JSON.stringify(json.Payload)).toString('base64');

    var fbuff = buff1+'.'+buff2;

    var salt = JSON.stringify(json.Salt);
    var p=h.createHash('sha256').update(fbuff+salt).digest('base64');
    return p;
}
/*hash function*/

function Writestream(Filedir,query){// this func will be useful in getup method

    var output = fs.createWriteStream(Filedir);
    output.write(query);
  
    }
/*sync creation func*/
var FolderFuncsync = (curr,f,c) =>{
    if(!fs.existsSync(curr+f)){
        Dir.create(curr,f,c,(msg)=>{

            console.log(msg);
    
        });

    }}


var FileFuncsync = (curr,f,c) =>{// creation of files
    
        Dir.create(curr,f,c,(msg)=>{
    
                console.log(msg);
         
            });
        }
   

module.exports=methods;