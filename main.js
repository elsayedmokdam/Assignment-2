const path = require("node:path");
const fs = require("node:fs");
const { EventEmitter } = require("node:events");
const event = new EventEmitter();
const date = new Date();
// -------------------------------
// Q1 :
// -----

const pathDirectory = () => `File: ${__filename} \nDir: ${__dirname}`;
// console.log(pathDirectory())

// Q2 :
// -----
function findFileName(filePath) {
  // Way 1
  return path.basename(filePath);

  // Way 2
  /* const sep = path.sep
    return filePath.split(sep).pop(); */
}
// console.log(findFileName(__filename))

// Q3 :
// -----

const buildPath = ({ dir, name, ext }) => path.join(dir, `${name}.${ext}`);
// console.log(buildPath({ dir: __dirname, name: "main", ext: "js" }));

// Q4 :
// -----

function findExtension(filePath) {
    // Way 1
    // return path.extname(filePath)

    // Way 2
    return path.parse(filePath).ext
}

// console.log(findExtension(__filename));

// Q5 :
// -----

function findNameExt(filePath) {
    const parsed = path.parse(filePath);
    return {
        name: parsed.name,
        ext: parsed.ext
    }
}
// console.log(findNameExt(__filename));

// Q6 :
// -----

const checkAbsolute = (filePath) => path.isAbsolute(filePath);
// console.log(checkAbsolute(__filename));

// Q7 :
// -----

function joinSegments() {
    // console.log(arguments);
    return path.join(...arguments);
}

// console.log(joinSegments("src", "components", "App.js"))

// Q8 :
// -----

const convertToRelative = (relativePath) => path.resolve(__dirname, relativePath);
// console.log(convertToRelative("./index.js"));

// Q9 :
// -----

const joinPaths = (path1, path2) => path.join(path1, path2);
// console.log(joinPaths("/folder1","folder2/file.txt"));

// Q10 :
// -----

function deleteFile(filePath) {
    const exists = fs.existsSync(filePath);
    if (exists) {
        fs.unlinkSync(filePath);
        console.log(`The file ${filePath} has been deleted.`);
    }else {
        console.log(`The file ${filePath} does not exist.`);
    }
}
// deleteFile("./test_files/data.txt");

// Q11 :
// -----

function createFolderSync() {
    const folderPath = "./newFolder";
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
        console.log(`The folder ${folderPath} has been created.`);
    }else {
        console.log(`The folder ${folderPath} already exists.`);
    }
}
// createFolderSync();

// Q12 :
// -----

event.on("start", () => {
    console.log("Welcome event triggered!");
})

// event.emit("start");

// Q13 :
// -----

event.on("login", (user) => {
    console.log(`User: ${user} logged in at: ${date.toLocaleString()}`);
})

// event.emit("login", "Sayed Mokdam");

// Q14 :
// -----

/* const pathToRead = path.resolve(__dirname, "./test_files/notes.txt");
try {
    const content = fs.readFileSync(pathToRead, "utf8");
    console.log(`Content: ${content}`);
} catch (error) {
    console.log(error);
} */

// Q15 :
// -----

function addToFile(filePath, content) {
    fs.writeFile(filePath, content, { flag: "a" }, (err) => {
        if (err) return console.log(err);
        console.log(`The file ${filePath} has been updated.`);
    })
}
// addToFile("./test_files/data.txt", "Hello I'm Sayed Mohamed Mokdam");

// Q16 :
// -----

// console.log(fs.existsSync("./bonus.js"));

// Q17 :
// -----

// console.log(process)
function findOSAndCPUArch() {
    return {
        platform: process.platform,
        Arch: process.arch
    }
}
// console.log(findOSAndCPUArch());

// Q18 :
// -----

const filePath = path.resolve(__dirname, "./test_files/big.txt");
function readStream(filePath) {
    const readStream = fs.createReadStream(filePath, {
        highWaterMark: 10000,
        encoding: "utf8"
    })

    readStream.on("data", (chunk) => {
        console.log("===============")
        console.log({chunk});
        console.log("===============")
    })

    readStream.on("end", () => {
        console.log("The file has been read completely.");
    })

    readStream.on("error" , (error) => {
        console.log(error)
    })
}
// readStream(filePath)

// Q19 :
// ----

const copyTo = path.resolve(__dirname, "./test_files/write.txt");
function copyFile(filePath, copyTo) {
    const writeStream = fs.createWriteStream(copyTo);
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(writeStream);

    readStream.on("error", (error) => {
        console.log(error)
    })

    writeStream.on("error", (error) => {
        console.log(error)
    })

    readStream.on("end", () => {
        console.log(`The file ${filePath} has been copied to ${copyTo}.`);
    })
}
// copyFile(filePath, copyTo)

// Q20 :
// -----

const { createGzip } = require("node:zlib");
const fileZIP = path.resolve(__dirname, "./test_files/data.txt.gz");

function compressFile(filePath, fileZIP) {
    const readStream = fs.createReadStream(filePath);
    const writeStream = fs.createWriteStream(fileZIP);

    readStream.on("error", (error) => {
        console.log(error)
    })
    writeStream.on("error", (error) => {
        console.log(error)
    })
    readStream.on("end", () => {
        console.log(`The file ${filePath} (has been compressed to) ${fileZIP}.`);
    })

    const gzip = createGzip(); // compressed file
    readStream.pipe(gzip).pipe(writeStream);
    // readStream.pipe(gzip) // Reade the file and compress it
    // gzip.pipe(writeStream) // write what you read in the compressed way
}
// compressFile(filePath, fileZIP)