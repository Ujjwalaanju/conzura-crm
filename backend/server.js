const express =
  require("express");

const mongoose =
  require("mongoose");

const cors =
  require("cors");

const dotenv =
  require("dotenv");

const http =
  require("http");

const {
  Server,
} = require("socket.io");


// CONFIG
dotenv.config();


// APP
const app =
  express();


// SERVER
const server =
  http.createServer(app);


// SOCKET.IO
const io =
  new Server(server, {

    cors: {

      origin:
        "http://localhost:5173",

      methods: [

        "GET",

        "POST",

        "PUT",

        "DELETE",

      ],

    },

  });


// GLOBAL SOCKET ACCESS
app.set("io", io);


// SOCKET CONNECTION
io.on(

  "connection",

  (socket) => {

    console.log(

      "✅ User Connected"

    );

    socket.on(

      "disconnect",

      () => {

        console.log(

          "❌ User Disconnected"

        );

      }

    );

  }

);


// MIDDLEWARE
app.use(cors());

app.use(express.json());


// ROUTES
const authRoutes =
  require("./routes/authRoutes");

const leadRoutes =
  require("./routes/leadRoutes");

const taskRoutes =
  require("./routes/taskRoutes");

const ticketRoutes =
  require("./routes/ticketRoutes");

const notificationRoutes =
  require("./routes/notificationRoutes");

  const reportRoutes =
  require(
    "./routes/reportRoutes"
  );
const customerRoutes =
  require(
    "./routes/customerRoutes"
  );

  const userRoutes =
  require(
    "./routes/userRoutes"
  );

  const settingsRoutes =
  require(
    "./routes/settingsRoutes"
  );
  const projectRoutes = require("./routes/projectRoutes");
  const paymentRoutes = require("./routes/paymentRoutes");

// API ROUTES
app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/leads",
  leadRoutes
);

app.use(
  "/api/tasks",
  taskRoutes
);

app.use(
  "/api/tickets",
  ticketRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.use(

  "/api/reports",

  reportRoutes

);

app.use(

  "/api/customers",

  customerRoutes

);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/settings",
  settingsRoutes
);

app.use("/api/projects", projectRoutes);
app.use("/api/payments", paymentRoutes);
// TEST ROUTE
app.get(
  "/",
  (req, res) => {

    res.send(
      "CRM Backend Running"
    );

  }
);


// DATABASE
const User = require("./models/User");
const bcrypt = require("bcryptjs");

async function seedUsers() {
  try {
    const salt = await bcrypt.genSalt(10);

    // 1. Admin
    const adminExists = await User.findOne({ email: "admin@conzura.com" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", salt);
      await User.create({
        name: "Admin User",
        email: "admin@conzura.com",
        password: hashedPassword,
        role: "Admin",
        teamId: "admin_team",
        isActive: true
      });
      console.log("ℹ️ Admin User created (admin@conzura.com / admin123)");
    }

    // 2. Manager
    const managerExists = await User.findOne({ email: "manager@conzura.com" });
    let managerId = "";
    if (!managerExists) {
      const hashedPassword = await bcrypt.hash("manager123", salt);
      const manager = await User.create({
        name: "Manager User",
        email: "manager@conzura.com",
        password: hashedPassword,
        role: "Team Manager",
        teamId: "",
        isActive: true
      });
      manager.teamId = manager._id.toString();
      await manager.save();
      managerId = manager._id.toString();
      console.log("ℹ️ Manager User created (manager@conzura.com / manager123)");
    } else {
      managerId = managerExists._id.toString();
    }

    // 3. TL (Team Leader)
    const tlExists = await User.findOne({ email: "tl@conzura.com" });
    if (!tlExists) {
      const hashedPassword = await bcrypt.hash("tl123", salt);
      await User.create({
        name: "TL User",
        email: "tl@conzura.com",
        password: hashedPassword,
        role: "Team Leader",
        teamId: managerId,
        isActive: true
      });
      console.log("ℹ️ TL User created (tl@conzura.com / tl123)");
    }

    // 4. Team Member
    const memberExists = await User.findOne({ email: "member@conzura.com" });
    if (!memberExists) {
      const hashedPassword = await bcrypt.hash("member123", salt);
      await User.create({
        name: "Member User",
        email: "member@conzura.com",
        password: hashedPassword,
        role: "Team Member",
        teamId: managerId,
        isActive: true
      });
      console.log("ℹ️ Member User created (member@conzura.com / member123)");
    }
  } catch (error) {
    console.error("❌ Error seeding users:", error);
  }
}

mongoose.connect(

  process.env.MONGO_URI

).then(() => {

  console.log(

    "✅ MongoDB Connected"

  );
  seedUsers();

}).catch((error) => {

  console.log(error);

});


// PORT
const PORT =
  process.env.PORT || 5000;


// START SERVER
server.listen(

  PORT,

  () => {

    console.log(

      `🚀 Server Running on Port ${PORT}`

    );

  }

);