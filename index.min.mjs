const $=(a,c=b=>"AbortError"===b?.name)=>async function(b){return(a??this).catch(d=>{if(c(d))return"function"===typeof b?b(d):b;throw d;})},
A=(a,c,b)=>{if("AsyncFunction"!==a?.constructor.name)throw new TypeError(`fn must be an AsyncFunction, got ${a}`);return new Proxy(a,{apply:async(...d)=>$(Reflect.apply(...d),b)(c)})},
B=$(),
C=(a=Promise.prototype,c)=>!a.abort&&Object.defineProperty(a,"abort",{value:$(null,c),writable:!0,enumerable:!1,configurable:!0});
export{A as abortableAsync,B as abort,C as inject};
