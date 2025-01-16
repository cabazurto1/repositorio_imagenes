// middlewares/authMiddleware.js

const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return res.status(401).json({ error: "No autorizado" });
  }

  // Decodificar credenciales
  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
  const [username, password] = credentials.split(":");

  // Validar credenciales
  if (username === "admin" && password === "admin123") {
    next(); // Credenciales correctas
  } else {
    return res.status(401).json({ error: "No autorizado" });
  }
};

module.exports = { authenticateAdmin };
