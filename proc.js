//For path processing

host = {};

host.procurl=function (url,callback){
    var patharray =url.split('?'); 
    var hostpath = patharray[0];
    if(hostpath!=='/favicon.ico'){
        
        if(patharray.length===2){
            var querypath = patharray[1];
            querypath =querypath.split('&');
            console.log(querypath.length);
            if (querypath.length===4){// check if number and query attributes are correct
                
                n = querypath[0].split('=');// get values of query,need to fix query format
                //n=n[1];
                u= querypath[1].split('=');
                //u=u[1];
                pswd = querypath[2].split('=');
                //pswd=pswd[1];
                GRU= querypath[3].split('=');
                //GRU=GRU[1];
                //console.log(n[0],u[0],pswd[0],GRU[0]);
            }
            else{
                return callback('Wrong number of query attributes');
            }

            qkeys=['name','username','pswd','GroupUser'];
            if(qkeys[0]!==n[0] || qkeys[1]!==u[0] ||qkeys[2]!==pswd[0] || qkeys[3]!==GRU[0]){
               
                return callback('More than 1 query attributes are wrong.Check again for registration');
            }

             var q = {
                'name':n[1],
                'username':u[1],
                'pswd':pswd[1],
                'GroupUser':GRU[1]
            }

            //querypath=JSON.stringify(q);
            
            callback(false,hostpath,q);
        }

        }


        else if(patharray.length<2){
            callback(false,hostpath,'undefined');
        }
        else{
            callback('Invalid query syntax');
        }

  }


module.exports=host;