
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");


/* ================= TOKEN ================= */

const generateToken = (admin) => {

  return jwt.sign(
    {
      id: admin._id,
      role: admin.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

};



/* ================= REGISTER ================= */

exports.registerAdmin = async (req,res)=>{

  try{

    const {name,email,password} = req.body;

    if(!name || !email || !password){
      return res.status(400).json({
        success:false,
        message:"All fields required"
      });
    }

    const exist = await Admin.findOne({email});

    if(exist){
      return res.status(400).json({
        success:false,
        message:"Admin already exists"
      });
    }

    const admin = await Admin.create({
      name,
      email,
      password
    });

    res.status(201).json({
      success:true,
      message:"Admin registered successfully",
      token:generateToken(admin),
      admin:{
        id:admin._id,
        name:admin.name,
        email:admin.email,
        role:admin.role
      }
    });

  }catch(err){

    res.status(500).json({
      success:false,
      message:err.message
    });

  }

};



/* ================= LOGIN ================= */

exports.loginAdmin = async (req,res)=>{

  try{

    const {email,password} = req.body;

    const admin = await Admin.findOne({email});

    if(!admin){
      return res.status(400).json({
        success:false,
        message:"Invalid email"
      });
    }

    const match = await admin.matchPassword(password);

    if(!match){
      return res.status(400).json({
        success:false,
        message:"Wrong password"
      });
    }

    res.json({
      success:true,
      message:"Login successful",
      token:generateToken(admin),
      admin:{
        id:admin._id,
        name:admin.name,
        email:admin.email,
        role:admin.role
      }
    });

  }catch(err){

    res.status(500).json({
      success:false,
      message:err.message
    });

  }

};



/* ================= GET PROFILE ================= */

exports.getProfile = async (req,res)=>{

  res.json({
    success:true,
    admin:req.admin
  });

};



/* ================= UPDATE PROFILE ================= */

exports.updateProfile = async (req,res)=>{

  try{

    const admin = await Admin.findById(req.admin._id);

    if(!admin){
      return res.status(404).json({
        success:false,
        message:"Admin not found"
      });
    }

    const {name,email} = req.body;

    if(name) admin.name = name;
    if(email) admin.email = email;

    const updated = await admin.save();

    res.json({
      success:true,
      message:"Profile updated",
      admin:{
        id:updated._id,
        name:updated.name,
        email:updated.email,
        role:updated.role
      }
    });

  }catch(err){

    res.status(500).json({
      success:false,
      message:err.message
    });

  }

};



/* ================= CHANGE PASSWORD ================= */

exports.changePassword = async (req,res)=>{

  try{

    const {oldPassword,newPassword} = req.body;

    const admin = await Admin.findById(req.admin._id);

    const match = await admin.matchPassword(oldPassword);

    if(!match){
      return res.status(400).json({
        success:false,
        message:"Old password incorrect"
      });
    }

    admin.password = newPassword;

    await admin.save();

    res.json({
      success:true,
      message:"Password updated"
    });

  }catch(err){

    res.status(500).json({
      success:false,
      message:err.message
    });

  }

};