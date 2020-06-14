const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const ProductsController = require('../controllers/products');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if(file.mimeType === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null,true);
    } else{
        cb(null,false);
    }
};
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

router.get('/', ProductsController.products_get_all);

router.post('/', checkAuth, upload.single('productImage'), ProductsController.create_product);

router.get('/:productId', ProductsController.products_get_one);

router.patch('/:productId', checkAuth, ProductsController.update_product);

router.delete('/:productId', checkAuth, ProductsController.delete_product);

module.exports = router;
