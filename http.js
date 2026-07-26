const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
let port = 3000;

function listen(port) {
    httpServer.listen(port, "127.0.0.1", () => {
        console.log(`Listening on http://127.0.0.1:${port}`);
    })
}

const httpServer = http.createServer((req, res) => { 
    const { url, method } = req;
    // Add new user
    if(url === "/users" && method === "POST") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        })
        req.on("end", () => {
            newUser = JSON.parse(body);

            fs.readFile(path.resolve(__dirname, "./test_files/users.json"), "utf8", (err, fileData) => {
                const users = JSON.parse(fileData);
                if(err) {
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.write(JSON.stringify({ status: 500, error: err.message }));
                    res.end();
                } 
                else {
                    const match = users.find(user => user.email === newUser.email);
                    if(match) {
                        res.writeHead(409, { "Content-Type": "application/json" });
                        res.write(JSON.stringify({ status: 409, error: "Email already exists" }));
                        res.end();
                    }else {
                        newUser.id = users.length + 1;
                        users.push(newUser);
                        fs.writeFile(path.resolve(__dirname, "./test_files/users.json"), JSON.stringify(users), (err) => {
                            if(err) {
                                res.writeHead(500, { "Content-Type": "application/json" });
                                res.write(JSON.stringify({ status: 500, error: err.message }));
                                res.end();
                            }else {
                                res.writeHead(201, { "Content-Type": "application/json" });
                                res.write(JSON.stringify({ status: 201, message: "User added successfully" }));
                                res.end();
                            }
                        })
                    }
                }
            })
        })
    }
    // Update user
    else if (url.startsWith("/user/") && method === "PATCH") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        })
        req.on("end", () => {
            const id = url.split("/")[2];
            const user = JSON.parse(body);
            fs.readFile(path.resolve(__dirname, "./test_files/users.json"), "utf8", (err, fileData) => {
                if(err) {
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.write(JSON.stringify({ status: 500, error: err.message }));
                    res.end();
                } 
                
                const users = JSON.parse(fileData);
                const match = users.find(user => user.id === Number(id));
                if(!match) {
                    res.writeHead(404, { "Content-Type": "application/json" });
                    res.write(JSON.stringify({ status: 404, error: "User not found" }));
                    res.end();
                }else {
                    match.name = user.name;
                    match.age = user.age;
                    match.email = user.email;
                    fs.writeFile(path.resolve(__dirname, "./test_files/users.json"), JSON.stringify(users), (err) => {
                        if(err) {
                            res.writeHead(500, { "Content-Type": "application/json" });
                            res.write(JSON.stringify({ status: 500, error: err.message }));
                            res.end();
                        }else {
                            res.writeHead(200, { "Content-Type": "application/json" });
                            res.write(JSON.stringify({ status: 200, message: "User updated successfully" }));
                            res.end();
                        }
                    })
                }
            })
        })
    }
    // Delete user
    else if (url.startsWith("/user/") && method === "DELETE") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        })
        req.on("end", () => {
            const id = url.split("/")[2];
            fs.readFile(path.resolve(__dirname, "./test_files/users.json"), "utf8", (err, fileData) => {
                if(err) {
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.write(JSON.stringify({ status: 500, error: err.message }));
                    res.end();
                } 

                const users = JSON.parse(fileData);
                const match = users.find(user => user.id === Number(id));
                if(!match) {
                    res.writeHead(404, { "Content-Type": "application/json" });
                    res.write(JSON.stringify({ status: 404, error: "User not found" }));
                    res.end();
                } else {
                    const index = users.indexOf(match);
                    users.splice(index, 1);
                    fs.writeFile(path.resolve(__dirname, "./test_files/users.json"), JSON.stringify(users), (err) => {
                        if(err) {
                            res.writeHead(500, { "Content-Type": "application/json" });
                            res.write(JSON.stringify({ status: 500, error: err.message }));
                            res.end();
                        }else {
                            res.writeHead(200, { "Content-Type": "application/json" });
                            res.write(JSON.stringify({ status: 200, message: "User deleted successfully" }));
                            res.end();
                        }
                    })
                }
            })
        })
    }
    // Get all users
    else if (url === "/users" && method === "GET") {
        fs.readFile(path.resolve(__dirname, "./test_files/users.json"), "utf8", (err, fileData) => {
            if(err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ status: 500, error: err.message }));
                res.end();
            } 
            else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(fileData);
                res.end();
            }
        })
    }
    // Get single user
    else if (url.startsWith("/user/") && method === "GET") {
        const id = url.split("/")[2];
        fs.readFile(path.resolve(__dirname, "./test_files/users.json"), "utf8", (err, fileData) => {
            if(err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ status: 500, error: err.message }));
                res.end();
            } 

            const users = JSON.parse(fileData);
            const match = users.find(user => user.id === Number(id));
            if(!match) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.write(JSON.stringify({ status: 404, error: "User not found" }));
                res.end();
            }else {
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify(match));
                res.end();
            }
        })
    }
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ status: 404, error: "Invalid route" }));
        res.end();
    }
});

httpServer.on("error", (error) => {
    if(error.code === "EADDRINUSE") {
        console.log(`Port ${port} is already in use.`);
        console.log("Try using a different port.");
        port++;
        listen(port);
    }
});

listen(port);