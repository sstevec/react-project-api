const express = require("express");
const routes = require("./routes");

const app = express();
const PORT = 8000;

// Middleware
app.use(express.json());

// Routes
app.use("/api", routes);


// Start the server only if this file is executed directly (not imported elsewhere)
// This prevents potential port conflicts during testing or when the file is used as a module
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
