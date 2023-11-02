const serv=require('node-windows').Service

const ser=new serv({name:"ytb_auto2",description:"sever of ytb_auto",script:"C:\\Users\\ilias\\OneDrive\\Bureau\\projects\\extensions\\ytb_downloader\\server.js"})
ser.on("install",function(params) {
    console.log("ooky")
    
})
// or install
ser.install()