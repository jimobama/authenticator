
/*If Promise donot support promised object to create a  user-defined promised objectwith sam stand*/
if(!Promise){

	var PENDING   =0;
	var FULFULLED =1;
	var REJECTED  =2;

	var Promise = (function(callback){
		var state =PENDING;
		var value =null;
		var handlers =new Array();

   //Transition
   var fulfill =(function(result){
   	state = FULFULLED;
   	value =result;
   	handlers.forEach(handler);
   	handlers=null;
   });

   var reject=(function(error){
   	state =REJECTED;
   	value =error;
   	handlers.forEach(handler);
   	handlers=null;
   });

   var handle =(function(_handler){
   	if(state === PENDING)
   		handlers.push(_handler);

   	if(state ===FULFULLED && (typeof handler.onFullfilled==="function")){
   		handler.onFullfilled(value);
   	}
   	if(state =="REJECTED" && (typeof handler.onRejected=="function")){
   		handler.onRejected(value);
   	}

   });
	 //higher level transistion

	 var resolve=(function(result){
	 	try{
	 		var then = getThen(result);
	 		if(then){
	 			doResolve(then.bind(result),resolve,reject);
	 			return
	 		}
	 		fulfill(result);
	 	}catch(e){
	 		reject(e);
	 	}

	 });


	 //helper function

	 var getThen=(function(value){
	 	var t= typeof value;
	 	if(value && (t==="object" || t ==="function")){
	 		var then = value.then;
	 		if(typeof then ==="function"){
	 			return then;
	 		}

	 	}
	 	return null;
	 });


	 var doResolve=(function(fn , onFullfilled, onRejected){
	 	var done = false;
	 	try{
	 		fn((function(value){
	 			if(done)return;
	 			done=true;
	 			onFullfilled(value);

	 		}),(function(reason){
	 			if(done)return ;
	 			done =true;
	 			onRejected(ex);
	 		}));
	 	}catch(ex)
	 	{ 
	 		if(done)return ;
	 		done =trye;
	 		onRejected(ex);
	 	}

	 });


	 this.done = (function(onFullfilled, onRejected){

	 	setTimeout(function(){
	 		handle({"onFulfilled":onFullfilled,"onRejected" :onRejected
	 	});
	 	},0);
	 });

	 doResolve(callback,resolve, reject);

	});

	Promise.prototype.then =(function(onResolve,onReject){
		var self= this;
		return new Promise((function(resolve,reject){

			return self.done(function(result){
				if(typeof onResolve ==="function"){
					try{
						return resolve(onResolve(result));
					}catch(ex){
						return reject(ex);
					}
				}else{
					return resolve(result);
				}

			},function(error){
				if(typeof onRejected ==="function"){
					try{
						return resolve(onRejected(error));
					}catch(ex){
						return reject(ex);
					}
				}else{
					return reject(error);
				}

			});
		}));

	});



	


	/*Create Authentication object*/

	var Authenticator = (function(username, password){
		var __username =(typeof username === "string")?username:"";
		var __password =(typeof password ==  "string")?password:"";
		var __onsuccess =(function(privalliges));
		var __onerror =(function(error));
		var __url =null;
		var __isAutho    =false;
		var __inProgress = 0;

		var isCallable=(function(){

		});
     // create async request to the give server url 
     var get=(function(url, data){ 
     	return new Promise((function(accept, reject){
     		var request = new  XMLHttpRequest();
     		request.open("POST", url, true);
     		request.addEventListener("load",(function(){
     			if(this.status <= 400)accept(request.responseText)
     				else reject(new Error("Authentication Request fails/ Network problem"));
     		})).bind(request);
     		request.addEventListener("error",(function(){
     			reject(new Error("Invalid url provided"));
     		}).bind(request));
     		var postData = (typeof data !=="string")?null:data;
     		request.send(postData);
     		__inProgress=1;
     	}));

     	var onSuccess =(function(data){
     		__inProgress = 2;
     		if(data){
     			if(data.status === true){
     				__isAutho = data.status;
     				__onsuccess(data.content);
     			}
     			else{
     				_isAutho=false;
     				__onerror(data.error);
     			}
     		}else{
     			__onerror(new Error("Authentication fails"));
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
     	"autho":(function(){
     		get(__url,"username="+__username+",password"+__password).then(onSuccess, onError);
     	})
     }
 })
