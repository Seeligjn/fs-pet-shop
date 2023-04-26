import process from "node:process";
import fs from "node:fs";

const subcommand = process.argv[2];

// if user enters node pets.js read
if (subcommand === "read") {
  const petIndexStr = process.argv[3];
  const petIndex = Number(petIndexStr)
  fs.readFile("pets.json", "utf8", (error, string) => {
    if (error) {
      throw error;
    }
    const pets = JSON.parse(string);
    if (petIndexStr === undefined) {
      console.log(pets);
    } else if (petIndex >= pets.length || petIndex < 0 || Number.isNaN(petIndex)) {
      console.error(
        `Usage: node pets.js read INDEX`
      );
      process.exit(1);
    } else {
      console.log(pets[petIndex]);
    }
  });
} else if (subcommand === 'create') {
    const age = Number(process.argv[3]);
    const kind = process.argv[4];
    const name = process.argv[5];
    if (age === undefined || kind === undefined || name === undefined) {
        console.error('Usage: node pets.js create AGE KIND NAME');
        process.exit(1);
    }
    const newPet = {age: age , kind: kind , name: name};

    fs.readFile('pets.json', 'utf8' , (error, string) => {
        if (error) {
            throw error
        }
        const pets = JSON.parse(string);
        pets.push(newPet);
        fs.writeFile('pets.json' , JSON.stringify(pets), (error) => {
            if (error) {
                throw error;
            }
        });
    });
        console.log({age , kind, name})
} else if (subcommand === 'update') {
    const desiredIndex = process.argv[3];
    const age = Number(process.argv[4]);
    const kind = process.argv[5];
    const name = process.argv[6];
    const newPet = {age: age , kind: kind , name: name};

    fs.readFile('pets.json' , 'utf8' , (error, string) => {
        if (error) {
            throw error;
        }
        const pets = JSON.parse(string);
        pets.splice(desiredIndex);
        pets.push(newPet);
        fs.writeFile('pets.json' , JSON.stringify(pets), (error => {
            if (error) {
                throw error;
            }
        }))
    });
}  

else {
  console.error("Usage: node pets.js [read | create | update | destroy]");
  process.exit(1);
}