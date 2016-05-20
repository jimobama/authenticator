
/*If Promise donot support promised object to create a  user-defined promised objectwith sam stand*/


	/*Create Authentication object*/

	var Authenticator = (function(username, password){
		var __username =(typeof username === "string")?username:"";
		var __password =(typeof password ==  "string")?password:"";
		var __onsuccess =(function(privalliges));
		var __onerror =(function(error));
		var __url =null;
		var __isAutho    =false;
		var __inProgress = 0;
          var __options= {"type":"json", "method":"POST"};
		var isCallable=(function(){

		});
     // create async request to the give server url 
     var request = (new  XMLHttpRequest()) || (new ActiveXObject("Microsoft.XMLHTTP")); 
     var get=(function(url, data){ 
     	return new Promise((function(accept, reject){     		              
     		request.open("POST", url, true);
               //list to load
     		request.addEventListener("load",(function(){
     			if(this.status <= 400)accept(request.responseText)
     				else reject(new Error("Authentication Request fails/ Network problem"));
     		}).bind(request));
               //list to error
     		request.addEventListener("error",(function(){
     			reject(new Error("Invalid url provided"));
     		}).bind(request));

     		var postData = (typeof data !=="string")?null:data;
     		request.send(postData);
     		__inProgress=1;
     	}));
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

var onSuccess =(function(data){
     		__inProgress = 2;
               var convertData = convertBaseSupporttedType(data);
     		if(convertData){
                    if(__options.type=="json"){
                          if(convertData.status === true){
                         __isAutho = convertData.status;
                         __onsuccess(convertData.content);
                      }else{
                         __isAutho=false;
                         __onerror(convertData.error);
                      }
                       
                    }else if(__options.type==="xml"){
     			  	
     				if(convertData.status()== true){
                              __isAutho = true;
                             __onsuccess(convertData.content());
                         }else{
                          __isAutho=false;
                          __onerror(convertData.error());
                         }
     		   }
     		}else{
     			__onerror(new Error("@Authentication fails; invalid response data format"));
                    __isAutho=false;
     		}

     	});
     	var onError   =(function(error){
     		__inProgress = 0;
     		__onerror(error);
     	});

     //Return inner object interface

     return {
     	"url":(function(url){
     		__url  =(typeof url==="string")?url:null;
     		if(!isUrl(__url))
     			throw TypeError("@isAutho: Invalid parameter argument provided required a valid uri");
     		return Authenticator(__username, __password);
     	})	
     	"success":(function(onsuccess){
     		if(isCallable(onsuccess)){
     			__onsuccess = onsuccess;
     		}
     		return Authenticator(__username, __password);
     	}),
     	"error":(function(onerror){
     		if(isCallable(onerror))
     			__onerror =onerror;
     		return Authenticator(__username, __password);
     	}),
     	"isAutho":(function(){return (_isAutho && (__inProgress===2));}),
          "settings":(function(options){
             if(typeof options =="object"){
                __options.type= (options.type)?options.type:__options.type;
                __options.method= (options.type)?options.type:__options.method;
             }
          }),
     	"autho":(function(){
     		get(__url,"username="+__username+",password"+__password).then(onSuccess, onError);
     	})
     }
 })
