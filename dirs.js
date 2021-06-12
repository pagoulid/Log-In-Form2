var fs = require('fs');
/**/

var dirproc ={}; // main process for dir operations
/*Create new directory or file*/ 

count = function(array,callback){ // counts length of an array
    let wordcount = 0; 
    if (array instanceof Array){
        array.forEach(w => {
                wordcount=wordcount+1;
            
        });
        callback(false,wordcount);
    }
    else{
        callback('Object not iterable')
    }
}
// if dir content = false, if file content=json data
dirproc.create = (currdir,newObject,content,callback)=>{// create file or directory if not exists
                        if(typeof(newObject)==='string'){
                            words = newObject.trim().split('.');

                            count(words,(err,count)=>{

                                if(err){
                                    callback(err);
                                }
                                else{
                                    let Objname=words[0];
                                    if(count===1){ //create file or dir;
                                        /*callback*/callback('Is directory');
                                        if(!fs.existsSync(Objname)){
                                            fs.mkdirSync(currdir+'/'+Objname);
                                        }
                                        else{
                                            callback('Folder already exists')
                                        }
                                    }
                                    else if (count===2){//need some content for the file
                                        callback('Is file');
                                        let ext = words[1];
                                        let file = Objname+'.'+ext;

                                        fs.readdir(currdir,(err,files)=>{// check if file already exists
                                            if(!err){
                                                let Fexist = false;
                                                 for(let f of files){
                                                    if(f!=file){
                                                        continue;
                                                    }
                                                    else{
                                                        Fexist = true;
                                                        break;
                                                    } 
                                                }
                                                if(!Fexist){
                                                    
                                                    fs.appendFile(currdir+'/'+file,content,(err)=>{//appendFile
                                                        if(err){
                                                            callback('Cannot create file: '+file);
                                                        }
                                                        else{
                                                            if(file=="Auth.json"){
                                                                callback('Authentication Completed');
                                                            }
                                                            else{
                                                                callback('Creation of file Completed');
                                                            }
                                                            
                                                        }
                                                    })
                                                }
                                            }
                                            else{
                                                callback('Something went wrong in checking for the existence of the file');
                                            }   
                                        });
                                    }
                                    else{
                                        callback('Something went wrong.Check the name of the path/file you want to create');
                                    }
                                }
                            })
                        }
                        else{
                            callback('Passed wrong format of object.Try again');
                        }
                }
/*Create new directory or file*/ 

/*Delete directory or file*/
dirproc.delete = (currdir,newObject,callback)=>{// create file or directory if not exists
    if(typeof(newObject)==='string'){
        words = newObject.trim().split('.');

        count(words,(err,count)=>{

            if(err){
                callback(err);
            }
            else{
                let Objname=words[0];
                if(count===1){ //create file or dir;
                    /*callback*///callback('Is directory');
                    if(!fs.existsSync(currdir+'/'+Objname)){
                        
                        callback('Folder does not exists');
                        
                    }
                    else{
                        //fs.rmdirSync(currdir+'/'+Objname);
                        //callback('Deletion of Folder completed');
/*************************************************************** */
                        var delpath = currdir+'/'+Objname;
                        fs.readdir(delpath,(err,files)=>{// first delete all files inside folder
                            if(!err){
                                let Fexist = false;
                                for(let f of files){
                                    fs.unlinkSync(delpath+'/'+f,(err)=>{//appendFile
                                        if(err){
                                            console.log('Cannot delete file: '+f);
                                        }
                                        else{
                                            console.log('File deleted:'+f);
                                            //callback('Deletion of file Completed');
                                        }
                                    });



                        fs.rmdir(delpath,(err)=>{///remove folder
                            if(err){
                                callback(err);
                            }
                            else{
                                //var delpath = currdir+'/'+Objname;

                                callback('Deletion of Folder completed')
                            }
                        });



                                }
                        }});
                        /*fs.rmdir(currdir+'/'+Objname,(err)=>{
                            if(err){
                                callback(err);
                            }
                            else{
                                //var delpath = currdir+'/'+Objname;

                                callback('Deletion of Folder completed')
                            }
                        });*/

/*************************************************************** */
                        }
                    }
                    else if (count===2){//need some content for the file
                        //callback('Is file');
                        let ext = words[1];
                        let file = Objname+'.'+ext;

                        fs.readdir(currdir,(err,files)=>{// check if file already exists
                            if(!err){
                                let Fexist = false;
                                for(let f of files){
                                    if(f!=file){
                                        continue;
                                    }
                                    else{
                                        Fexist = true;
                                        break;
                                    } 
                                }
                                if(Fexist){// in exist we want the file to exist
                                    
                                    fs.unlinkSync(currdir+'/'+file,(err)=>{//appendFile
                                        if(err){
                                            callback('Cannot delete file: '+file);
                                        }
                                        else{
                                            callback('Deletion of file Completed');
                                        }
                                    })
                                }
                            }
                            else{
                                callback('File does not exist');
                            }   
                        });
                    }
                    else{
                        callback('Something went wrong.Check the name of the path/file you want to delete');
                    }
                }
            })
        }
        else{
            callback('Passed wrong format of object.Try again');
        }
    }





/*Delete directory or file*/ 
 
/*Read File */
dirproc.read= function (currdir,filepath,callback){
    // checks if file and json format
    var check=filepath.split('.');
    //Must check if path exists
    
    if(check.length===2){
        if(check[1]==='json' & fs.existsSync(currdir+'/'+filepath)){
            fs.readFile(currdir+'/'+filepath,'utf-8',(err,data)=>{
                console.log('Reading File: '+currdir+'/'+filepath);
                if(err){
                    callback('Error reading the file',0);//send 0 to rmethod for 500 resp

                }
                else{// file is okok return data to read
                    callback(false,data);
                }
            })

        }
        else{
            callback('Passed wrong format,must be json or file does not exist',0);
        }

    }
    else{
        callback("Can't read Non-file or wrong format");
    }



}



/*Read File */

module.exports=dirproc;