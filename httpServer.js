import http from 'node:http'
import fs from 'node:fs'

//create a server object:
http.createServer(function (request, response) {
    const petRegExp = /^\/pets\/(.*)$/;
    //get request method
    console.log(request.method);
    //get request path
    console.log(request.url)

    // if GET to /pets, return pets
    if (request.method === 'GET' && request.url === '/pet') {
        //read pets file and return result
        fs.readFile('pets.json' , 'utf8' , (error,string) => { 
            response.setHeader('Content-Type' , 'application/json')
            response.write(string);
            response.end();
        });
    } else if (request.method === 'GET' &&  petRegExp.test(request.url)) {
        const petIndex = Number(request.url.match(petRegExp)[1]);
        fs.readFile('pets.json', 'utf8' , (error, string) => {
            response.setHeader('Content-Type' , 'application/json')
            //handle out of bounds indexes
            const pets = JSON.parse(string);
            const pet = pets[petIndex];
            response.write(JSON.stringify(pet));
            response.end();
        });
    } else {
        response.write('Goodbye'); //write a response to the client
        response.end(); //end the response
    }


}).listen(3000); //the server object listens on port 3000