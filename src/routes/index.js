const express= require("express");
const router= express.Router();
const userSchema= require("../model/user");

var global

//agregando la cuenta admin
const superuser= new userSchema({
    identificacion:12345678,
    tipo_identificacion: "CC",
    primer_nombre: "user",
    primer_apellido: "admin",
    telefono:987654321,
    nacimiento:"27-11-1999",
    email: "admin@gmail.com",
    password: 12345,
    admin: true
});

var consulta;
var usersup= superuser["email"];

//validando que el admin ya exista
userSchema.findOne({email:usersup}).then((data)=>{
    consulta =data;
    if( consulta== null ){
        superuser.save()
        console.log("Admin creado");
    }
});


//login usuarios 
router.get("/",(req,res)=>{
    res.render("Login");
});

router.post("/login",(req,res)=>{
    const { email ,password}  = req.body;
    userSchema.findOne({email,password}).then((data)=> {
        if (data != null){
            req.session.user= req.body.email;
            req.session.admin=data.admin;
            if(req.session.admin== true){
                global= req.session.admin;
                res.redirect("admin/home");
            }else{
                var camino= "empleado/"+req.body.email;
                global= false;
                res.redirect(camino);
            }
            
        }else{
            res.redirect("/")
        }
    });
});

//cerrar session
router.get('/logout', function (req, res) {
    req.session.destroy();
    global=0;
    res.redirect("/")
});


//permisos admin
var autorizado= function(req, res, next) {
    if (global === true)
      return next();
    else
      return res.sendStatus(401);
};


//dashboard admin
router.get("/admin/home",autorizado,function(req,res){

    userSchema.find({},(err,data)=>{
        if(err) throw err;
            res.render("Home",{
                title: "LOGIN",
                tasks: data
            });
    });
});

//guardar usuario para admin
router.get("/create",autorizado,(req,res)=>{
    res.render("Create")
});

router.post("/create/admin",autorizado,(req,res)=>{
    let body= req.body;

    const user= userSchema(req.body);
    user.save().then(()=> {
        console.log("usuario creado");
        res.redirect("/admin/home");
    }).catch((error)=>{
        console.log(error);
        console.log("No se puedo crear el usuario");
        res.redirect("/create");
    });
});

//actualizar usuario para admin
//seleccionar usuario
router.get("/update/:id",autorizado,(req,res)=>{
    let id= req.params.id;
    userSchema.findById(id, (error, data)=>{
        res.render("update",{
            title: "LOGIN",
            tasks: data
        });
    });
});

//actualizar usuario
router.post("/update/user/:id",autorizado,(req,res)=>{
    const  id = req.params.id;
    const {dui,first_name,last_name,email}= req.body;
    userSchema.findByIdAndUpdate(id,{dui,first_name,last_name,email}).then(()=>{
        res.redirect("/admin/home");
    }).catch((error)=> console.error(error));
});


//eliminar usuario
router.get("/delete/:id",autorizado,(req,res)=>{
    let id= req.params.id;
    userSchema.remove({_id: id},(error, data)=>{
        if (error) throw error;
        console.log("Eliminado");
        res.redirect("/admin/home");
    });
});

module.exports= router;