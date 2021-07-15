import nc from "next-connect";


const multer = require("multer");
const cloudinary = require("cloudinary").v2
const streamifier = require("streamifier");

const storage = multer.memoryStorage();
const upload = multer({storage});

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const handler = nc()
    .use(upload.single("image"))
    .post(async (req,res) =>{
        try{
            if(req.file){
                let upload_stream = cloudinary.uploader.upload_stream({}, (error, result)=>{
                    if(error){
                        console.log("UPLOAD ERROR", error);
                        res.json({status:0, message: "Upload error."});
                        res.end()
                    }else{
                        console.log(result);
                        res.send({status: 1, link: result.secure_url});
                        res.end();
                    }
                })
                streamifier.createReadStream(req.file.buffer).pipe(upload_stream);
                
            }else{
                res.json({status: 0, message: "Must be an image"});
                res.end();
            }
        }catch(err){
            res.json({status:0, message: "Server Error"});
            res.end();
        }
    })  

export default handler;

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
};