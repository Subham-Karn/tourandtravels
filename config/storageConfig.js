import multer from "multer";
import path from "path";

const  __dirname = process.cwd();

const storage = multer.diskStorage({
    destination(req , file , cd){
        cd(null, path.join(process.cwd(), "public", "uploads", "gallery"));
    },

    filename(req , file , cd){
        if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
            return cd(new Error("Only image files are allowed!"));
        }
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cd(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    },

});

const fileFilter = (req, file, cb) => {

    if(file.mimetype.startsWith("image/")){
        cb(null,true);
    }else{
        cb(new Error("Only Images Allowed"),false);
    }

}

export const uploadGallery = multer({

    storage,
    fileFilter

});

