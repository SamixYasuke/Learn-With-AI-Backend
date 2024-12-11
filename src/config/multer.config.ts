import multer from "multer";
import path from "path";

const fileFilter = (req, file, cb) => {
  const filetypes = /.pdf|.txt|.doc/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (extname) {
    return cb(null, true);
  } else {
    cb("Error: Videos Only!");
  }
};

const upload = multer({
  dest: "uploads/",
  fileFilter,
  limits: { fileSize: 10485760 },
});

export default upload;
