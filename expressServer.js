// import express from 'express';
// import fs from 'fs';

// const app = express();
// const port = 3000

// app.get('/pets' , (req , res) => {
//     fs.readFile('pets.json' , 'utf8' , (error, string) => {
//         if (error) {
//             console.error(error);
//             res.sendStatus(500);
//         }
//         const pets = JSON.parse(string);
//         res.send(pets);
//     });
// })

// app.get('/pets/:petIndex' , (req , res) => {
//     const petIndex = Number(req.params.petIndex);
//     fs.readFile('pets.json' , 'utf8' , (error, string) => {
//         const pets = JSON.parse(string)
//         if (error) {
//             console.error(error);
//             res.sendStatus(500);
//         } 
//         else if (petIndex < 0 || petIndex >= pets.length) {
//             res.sendStatus(404);
//         }
//         console.log(petIndex)
//         res.send(pets[petIndex])
//     });
// });



// app.use(express.json())
// app.post('/pets', (req, res, next) => {
//     console.log(req.body)
//     res.json(req.body)
//   })



// app.listen(port , () => {
//     console.log('listening')
// })


import express from 'express';
import fs from 'fs';
const app = express();
const port = 3000
app.get('/pets' , (req , res) => {
    fs.readFile('pets.json' , 'utf8' , (error, string) => {
        if (error) {
            console.error(error);
            res.sendStatus(500);
        }
        const pets = JSON.parse(string);
        res.send(pets);
    });
})
app.get('/pets/:petIndex' , (req , res) => {
    const petIndex = Number(req.params.petIndex);
    fs.readFile('pets.json' , 'utf8' , (error, string) => {
        const pets = JSON.parse(string)
        if (error) {
            console.error(error);
            res.sendStatus(500);
        }
        else if (petIndex < 0 || petIndex >= pets.length) {
            res.sendStatus(404);
        }
        console.log(req.params)
        console.log(petIndex)
        res.send(pets[petIndex])
    });
});
app.use(express.json())
app.post('/pets', (req, res, next) => {
    const newPet = req.body
    res.json(req.body)
    fs.readFile('pets.json' , 'utf8' , (error , string) => {
        const pets = JSON.parse(string)
        if (error) {
            console.error(error);
            res.sendStatus(500);
        }
        pets.push(newPet);
        fs.writeFile('pets.json' , JSON.stringify(pets) , (error)=> {
            res.send(newPet)
        })
    })
  });
app.listen(port , () => {
    console.log('listening')
});