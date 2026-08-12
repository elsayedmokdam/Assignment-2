const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
let port = 3000;

function listen(port) {
  httpServer.listen(port, "127.0.0.1", () => {
    console.log(`Listening on http://127.0.0.1:${port}`);
  });
}

async function readUsers() {
  return await fs.readFile(path.resolve(__dirname, "./test_files/users.json"), {
    encoding: "utf-8",
  });
}

async function writeUsers(data) {
  return await fs.writeFile(
    path.resolve(__dirname, "./test_files/users.json"),
    JSON.stringify(data, null, 2),
  );
}

function formatResponse(
  res,
  data,
  status = 200,
  message = "Success",
  error = undefined,
) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.write(
    JSON.stringify({
      message,
      status,
      data,
      error,
    }),
  );
  res.end();
}

const httpServer = http.createServer((req, res) => {
  const { url, method } = req;
  // Add new user
  if (url === "/users" && method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        const newUser = JSON.parse(body);
        const data = await readUsers();
        const users = JSON.parse(data);

        const matched = users.find((user) => user.email === newUser.email);
        if (matched) {
          return formatResponse(res, null, 404, "User already exists");
        }
        const maxId = users.length
          ? Math.max(...users.map((user) => user.id))
          : 0;

        newUser.id = maxId + 1;
        users.push(newUser);
        await writeUsers(users);
        return formatResponse(res, newUser, 201, "User added successfully");
      } catch (error) {
        return formatResponse(res, 500, "Internal Server Error", error.message);
      }
    });
  }
  // Update user
  else if (url.startsWith("/user/") && method === "PATCH") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      try {
        const id = url.split("/")[2];
        const updatedUser = JSON.parse(body);
        const data = await readUsers();
        const users = JSON.parse(data);
        const matched = users.find((user) => user.email === updatedUser.email);
        if (matched) {
          return formatResponse(res, null, 404, "User already exists");
        }
        const index = users.findIndex((user) => user.id === Number(id));
        if (index === -1) {
          return formatResponse(res, null, 404, "User not found");
        }

        users[index] = {
          ...users[index],
          ...updatedUser,
        };
        await writeUsers(users);
        return formatResponse(
          res,
          users[index],
          200,
          "User updated successfully",
        );
      } catch (error) {
        return formatResponse(res, 500, "Internal Server Error", error.message);
      }
    });
  }
  // Delete user
  else if (url.startsWith("/user/") && method === "DELETE") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      try {
        const id = url.split("/")[2];
        const data = await readUsers();
        const users = JSON.parse(data);
        const index = users.findIndex((user) => user.id === Number(id));
        console.log(index);
        if (index === -1) {
          return formatResponse(res, null, 404, "User not found");
        }
        users.splice(index, 1);
        await writeUsers(users);
        return formatResponse(res, null, 200, "User deleted successfully");
      } catch (error) {
        return formatResponse(res, 500, "Internal Server Error", error.message);
      }
    });
  }
  // Get all users
  else if (url === "/users" && method === "GET") {
    try {
      readUsers().then((data) => {
        const users = JSON.parse(data);
        return formatResponse(res, users, 200, "Success");
      })
    return formatResponse(res, users, 200, "Success");
    } catch (error) {
      return formatResponse(res, 500, "Internal Server Error", error.message);
    }
  }
  // Get single user
  else if (url.startsWith("/user/") && method === "GET") {
    try {
      const id = url.split("/")[2];
      readUsers().then((data) => {
        const users = JSON.parse(data);
        const user = users.find((u) => u.id === Number(id));
        if (!user) {
          return formatResponse(res, null, 404, "No User Matched the ID");
        }
        return formatResponse(res, user, 200, "Success");
      })
    } catch (error) {
      return formatResponse(res, 500, "Internal Server Error", error.message);
    }
  } else {
  }
});

httpServer.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.log(`Port ${port} is already in use.`);
    console.log("Try using a different port.");
    port++;
    listen(port);
  }
});

listen(port);
