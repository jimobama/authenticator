
/*If Promise donot support promised object to create a  user-defined promised objectwith sam stand*/


	/*Create Authentication object*/

	var Authenticator = (function(username, password){

          var __password =(typeof password ==  "string")?password:"";
          var __username =(typeof username ==  "string")?username:"";        
          var __isAutho    =false;
          var __options= {"type":"json", "method":"post","onsuccess":(function(){console.log("Required a callback function to handle onsuccess");}),
                 "onerror":(function(error){console.log("require an error callback function ");}), "url":"index.php"};
          //check if a callback vlaue is a function
          var isCallable=(function(callable){
               return (typeof callable ==="function");
          });

          // create async request to the give server url 
          var request = (new  XMLHttpRequest()) || (new ActiveXObject("Microsoft.XMLHTTP")); 
          var get=(function(url, data){ 
               return new Promise((function(accept, reject){
                    request.open("POST", url, true);
                    //list to load
                    request.addEventListener("load",(function(){
                         if(this.status <= 400)accept(request.responseText)
                              else reject(new Error("Network error ; could not access the given server file location"));
                    }).bind(request));
                    //list to error
                    request.addEventListener("error",(function(){
                         reject(new Error("Invalid url provided"));
                    }).bind(request));

                    var postData = (typeof data !=="string")?null:data;
                    request.send(postData);
               }));
          });

      //Handle on Successful callback 
       var onSuccess =(function(data){
                         var convertData = convertBaseSupporttedType(data);
                         if(convertData){
                              if(__options.type=="json"){
                                    if(convertData.status === true){
                                   __isAutho = convertData.status;
                                   __options.onsuccess(convertData.content);
                                }else{
                                   __isAutho=false;
                                   __options.onerror(convertData.error);
                                }
                                 
                              }else if(__options.type==="xml"){
                                   
                                   if(convertData.status()== true){
                                        __isAutho = true;
                                       __options.onsuccess(convertData.content());
                                   }else{
                                    __isAutho=false;
                                    __options.onerror(convertData.error());
                                   }
                            }
                         }else{
                              __options.onerror(new Error("@Unable to load server data"));
                              __isAutho=false;
          }});
     //Handle onerror callback
       var onError   =(function(error){
                         __options.onerror(error);
                    });
    //Parser return input to json or xml
      var convertBaseSupporttedType=(function(data){
               var xmlDoc=null;
              if(__options.type==="xml"){
                var     parser =new DOMParser();
                 xmlDoc =  parser.parserFromString(data, "text/xml");
                 //get status
                  xmlDoc.status=(function(){
                    var statusTag=  this.getElementsByTagName("status")[0];
                    if(statusTag){
                        var st=  parseInt(statusTag.innerHTML);
                        return (st ==true)?true:false;
                    }
                    return false;
                 }).bind(this);
                xmlDoc.error =(function(){
                    var tag=  this.getElementsByTagName("error")[0];
                    if(tag){
                         return tag.innerHTML;
                    }
                    return "";
                }).bind(xmlDoc); 
                //prcessing xml document format data
              }else if(__option.type=="json"){
                //process json object
                if(!JSON  || !JSON.parse){
                    JSON ={};
                    JSON.parse=eval;
                    data = "("+ data +")";
                }
                xmlDoc = JSON.parse(data);
              }
              return xmlDoc;
         });

          //return objects
          return {
               "then":(function(onsuccess, onerror){
                 try{
                 __options.onsuccess = (isCallable(onsuccess))?onsuccess: __options.onsuccess;
                 __options.onerror = (isCallable(onerror))?onerror: __options.onerror;
                  get(__options.url,"username="+__username+",password"+__password)
                    .then(onSuccess, onError);
                  }catch(e){
                    if(onerror)
                          onerror(e);
                  }
               }),
               "settings":(function(options){
                 if(options){
                    __options.onsuccess = (isCallable(options.onsuccess))?options.onsuccess: __options.onsuccess;
                    __options.onerror = (isCallable(options.onerror))?options.onerror: __options.onerror;
                    __options.url= (typeof url === "string")?url:__options.url;
                      if(typeof options.type === "string"){__options.type=options.type.toLowercase();}
                    __options.type =(__options.type === "xml")?"xml":"json";
                    if(typeof options.method ==="string" ){
                           __options.method = options.method.toLowercase();
                         }
                    __options.method =(__options.method ==="get")?"get":"post";
                 }
               })
          }

     });


