const fs= require('fs');// require is a built-in Node.js function used to import and use modules. In this case, it is importing the fs module
const http=require('http');///networking capability
const url=require('url');
const slugify=require('slugify');
const replaceTemplate=require('./final/modules/replaceTemplatee');//importing the replaceTemplate module
///Files
//synchronous code/blocking code execution
// const textIn=fs.readFileSync('./final/txt/input.txt','utf-8');
// console.log(textIn);
// const textOut=`This is the written file of avocados: ${textIn}. \n created on ${Date.now()}`;
// fs.writeFileSync('./final/txt/outputt.txt',textOut);
// const fileread=fs.readFileSync('./final/txt/outputt.txt','utf-8');
// console.log(fileread);

//Non blocking /Asynchronous

// fs.readFile('./final/txt/start.txt','utf-8',(err,data1)=>{
//     console.log(`First file: ${data1}`);
//     fs.readFile('./final/txt/read-this.txt','utf-8',(err,data2)=>{
//         if (err){
//             console.log(`error`)
//         };
//         console.log(`Second file: ${data2}`);
//         fs.readFile('./final/txt/append.txt','utf-8',(err,data3)=>{
//             console.log(`Third file: ${data3}`);
//             fs.writeFile('./final/txt/finalll.txt',`First file: ${data2} \n second file: ${data3} `,()=>{
//                 console.log(`file has been written`);
//                 fs.readFile('./final/txt/finalll.txt','utf-8',(err,data4)=>{
//                     console.log(`final file is: ${data4}`);
//                 })
//             });
//         })
//     })
// })
// console.log(`will read the file`);

///Server

const templateoverview=fs.readFileSync('./final/templates/template-overview.html','utf-8');
const templateproduct=fs.readFileSync('./final/templates/template-product.html','utf-8');
const templatecard=fs.readFileSync('./final/templates/template-card.html','utf-8');
console.log('Templates loaded successfully');
const data = fs.readFileSync('./final/dev-data/data.json', 'utf-8'); // Reads the contents of 'data.json' file synchronously
       const dataobject =JSON.parse(data);//convert json string into js object
   const slugs=dataobject.map(el=>slugify(el.productName,{lower:true}));// Creates an array of slugs from product names using the slugify library
console.log(slugs);
   const server=http.createServer((req,resp)=>{// Creates an HTTP server that handles incoming requests and responses using a callback function
        const{query,pathname}=(url.parse(req.url,true));
        //  const pathname=req.url;// Extracts the URL path from the incoming request object
    //overview page
    if(pathname==='/'||pathname==='/overview'){
resp.writeHead(200,{'Content-Type':'text/html'});
const cardHtml=dataobject.map(el=>replaceTemplate(templatecard,el)).join('');
const output =templateoverview.replace('{%PRODUCT_CARDS%}',cardHtml);
        resp.end(output);

    }//Product Page
    else if(pathname==='/product'){
        resp.writeHead(200,{'content-type':'text/html'});
        const product=dataobject[query.id];
        const output=replaceTemplate(templateproduct,product)
        resp.end(output);





    }



   //API
    else if(pathname==='/api'){
   
       resp.writeHead(200, {'Content-type': 'application/json'});
       resp.end(data);     
  
    }

    //Not found
    else{
        resp.end(`This is a default page!!`)
    }
    //callback function exectued each time the server is called
})
server.listen(4000,'127.0.0.1',()=>{
    console.log(`listening to the request on port 8000`);
})