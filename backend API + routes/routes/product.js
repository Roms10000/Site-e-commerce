const express = require ('express')
let router = express.Router();
const  Product  = require ('../models/products.js');

router.get('/', async (req,res) => {
let allProducts = await Product.find();
return res.json(allProducts);
});

router.get('/:id',async (req,res)=> {
const { id } = req.params;
const product = await Product.findById(id);
return res.json(product);
})


router.post('/add',async (req,res)=> {
const newProduct = new Product ({...req.body});
await newProduct.save();
return res.json({message: 'Produit sauvegardé'});
})

router.put('/update/:id',async (req,res) => {
const { id } = req.params;
await Product.updateOne({_id:id} ,req.body);
return res.json({message:'Produit modifié'});
});

router.delete('/delete/:id',async (req,res) => {
const { id } = req.params;
await Product.deleteOne({_id:id});
return res.json({message:'Produit supprimé'});
});

module.exports = router ;
