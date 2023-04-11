import express from "express"
import cors from "cors"
import mongoose from "mongoose"

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/myLoginRegisterDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("DB connected")
})
.catch((err) => {
    console.log("DB connection error:", err)
})

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const User = new mongoose.model("User", userSchema)

//Routes login/register

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email: email });
      if (user) {
        if (password === user.password) {
          res.send({ message: "Login Successfully", user: user });
        } else {
          res.send({ message: "Password didn`t match", user: user });
        }
      } else {
        res.send({ message: "User not registered" });
      }
    } catch (error) {
      res.send(error);
    }
  });

let isRegistered = false;

app.post("/register", async (req, res) => {
    const { userName, email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            if (isRegistered) {
                res.send({ message: "User already registered" });
            } else {
                isRegistered = true;
                res.send({ message: "Successfully registered" });
            }
        } else {
            const newUser = new User({
                userName,
                email,
                password,
            });
            await newUser.save();
            isRegistered = true;
            res.send({ message: "Successfully registered" });
        }
    } catch (error) {
        res.send(error);
    }
});

app.listen(9003, () =>{
    console.log('DB started at port 9003')
})
