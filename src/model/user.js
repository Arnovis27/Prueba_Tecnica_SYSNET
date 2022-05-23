const mongosee= require("mongoose");

const userSchema= mongosee.Schema({
    identificacion:{
        type: Number,
        unique: true,
        required:true
    },
    tipo_identificacion: {
        type: String,
        required:true
    },
    primer_nombre: {
        type: String,
        required:true
    },
    segundo_nombre: {
        type: String,
        default: ""
    },
    primer_apellido: {
        type: String,
        required:true
    },
    segundo_apellido: {
        type: String,
        default: ""
    },
    direccion:{
        type: String,
        default: ""
    },
    telefono:{
        type: Number,
        required:true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    ocupacion:{
        type: String,
        default: ""
    },
    nacimiento:{
        type: String,
        required:true
    },
    password:{
        type: String
    },
    admin:{
        type: Boolean,
        default: 'false'
    },
});

module.exports= mongosee.model("User",userSchema);