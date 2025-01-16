// middlewares/authMiddleware.js

const authenticateAdmin = (req, res, next) => {
  const { username, password } = req.headers;

  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
    return next();
  }

  return res.status(403).json({ error: "No autorizado" });
};

module.exports = { authenticateAdmin };
