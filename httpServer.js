// import http from "node:http";
// import fs from "node:fs";

// //create a server object:
// http
//   .createServer(function (request, response) {
//     const petRegExp = /^\/pets\/(.*)$/;
//     //get request method
//     console.log(request.method);
//     //get request path
//     console.log(request.url);

//     // if GET to /pets, return pets
//     if (request.method === "GET" && request.url === "/pets") {
//       //read pets file and return result
//       fs.readFile("pets.json", "utf8", (error, string) => {
//         response.setHeader("Content-Type", "application/json");
//         response.write(string);
//         response.end();
//       });
//     } else if (request.method === "GET" && petRegExp.test(request.url)) {
//       const petIndex = Number(request.url.match(petRegExp)[1]);
//       fs.readFile("pets.json", "utf8", (error, string) => {
//         response.setHeader("Content-Type", "application/json");
//         //handle out of bounds indexes
//         const pets = JSON.parse(string);
//         const pet = pets[petIndex];
//         if (petIndex > pets.length - 1 || petIndex < 0) {
//           response.statusCode = 404;
//           response.setHeader("Content-Type", "text/plain");
//           response.end("Not Found");
//         }
//         response.write(JSON.stringify(pet));
//         response.end();
//       });
//     } else {
//       response.write("Goodbye"); //write a response to the client
//       response.end(); //end the response
//     }
//   })
//   .listen(3000); //the server object listens on port 3000

import http from "http";
import fs from "fs";

http
  .createServer(function (req, res) {
    const petRegExp = /^\/pets\/(.*)$/;
    if (req.method === "GET" && req.url === "/pets") {
      fs.readFile("pets.json", "utf-8", (error, string) => {
        res.setHeader("Content-Type", "application/json");
        res.write(string);
        res.end();
      });
    } else if (req.method === "GET" && petRegExp.test(req.url)) {
      const petIndex = Number(req.url.match(petRegExp)[1]);
      fs.readFile("pets.json", "utf-8", (error, string) => {
        res.setHeader("Content-Type", "application/json");
        const pets = JSON.parse(string);
        const pet = pets[petIndex];

        if (
          petIndex > pets.length - 1 ||
          petIndex < 0 ||
          petIndex === undefined
        ) {
          res.statusCode = 404;
          res.setHeader("Content-Type", "text/plain");
          res.end("Not Found");
        }
        res.end(JSON.stringify(pet));
      });
    } else {
      res.end();
    }
  })
  .listen(3000, function () {
    console.log("listening on port 3000");
  });
