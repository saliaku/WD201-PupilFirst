// const fs = require("fs");

// let printhello = () => {
//     console.log("hello")
// };

// printhello();

// fs.writeFile(
//     "sample.txt",
//     "Hello World!!",
//     (err) =>{
//         if(err) throw err;

//         console.log("File created successfully");
//     }
// );

// fs.readFile(
//     "sample.txt",
//     (err,data) => {
//         if(err) throw err;
//         console.log(data.toString());
//     }
// );

// fs.appendFile("sample.txt", " This is my updated content", (err) => {
//     if (err) throw err;
//     console.log("File updated!");
//   });

// fs.rename("sample.txt", "test.txt", (err) => {
//     if (err) throw err;
//     console.log("File name updated!");
//   });

//   fs.unlink("test.txt", (err) => {
//     if (err) throw err;
//     console.log("File test.txt deleted successfully!");
//   });

// const http = require("http");
// const fs = require("fs");

// const server = http.createServer((req, res) =>{
//     const stream = fs.createReadStream("sample.txt");
//     stream.pipe(res);
    
//     // fs.readFile(
//     //     "sample.txt",
//     //     (err,data) => {
//     //         res.end(data);
//     //     }
//     // )
// });

// server.listen(3000);

const http = require("http");
const fs = require("fs");

const minimist = require("minimist");
const args = minimist(process.argv.slice(2),{
  default: {
    port: 3000
  }
});
const port = args.port;


let homeContent = "";
let projectContent = "";
let registrationContent = "";

fs.readFile("home.html", (err, home) => {
  if (err) {
    throw err;
  }
  homeContent = home;
});

fs.readFile("project.html", (err, project) => {
  if (err) {
    throw err;
  }
  projectContent = project;
});

fs.readFile("registration.html", (err,registration) => {
  if(err){
    throw err;
  }
  registrationContent = registration;
});

fs.readFile("home.html", (err, home) => {
if (err) {
    throw err;
}

http.createServer((request, response) => {
    let url = request.url;
    response.writeHeader(200, { "Content-Type": "text/html" });
    switch (url) {
      case "/project":
        response.write(projectContent);
        response.end();
        break;
      case "/registration":
        response.write(registrationContent);
        response.end();
        break;
      default:
        response.write(homeContent);
        response.end();
        break;
    }
  }).listen(port);
});




