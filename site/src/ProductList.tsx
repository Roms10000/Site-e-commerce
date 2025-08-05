import axios from 'axios';
import { useEffect, useState } from 'react';
import ProductsCard from './ProductsCard';
import { Button, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

interface Product {
  _id: number;
  images: string;
  title: string;
  category: string;
  price: number;
}

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function ProductList () {
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({ title: '', price: '' });
  const [formMode, setFormMode] = useState<'add' | 'update' | 'delete'>('add');
  const [addProducts,setAddProducts] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const [open, setOpen] =useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


const refreshProducts = async () => {
  const url = 'http://localhost:8000/products';
  const response = await axios.get(url);
  setProducts(response.data);
};

useEffect(() => {
  refreshProducts();
}, []);

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value
  }));
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    if (formMode === 'add') {
      const response = await axios.post('http://localhost:8000/products/add', {
        title: formData.title,
        price: parseFloat(formData.price)
      });
      setAddProducts(response.data);
      refreshProducts();
    } 
  } catch (error) {
    console.error('Erreur lors de la soumission du formulaire :', error);
  } finally {
    handleClose();
  }
};

  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + productsPerPage);

return (
  <div>
    <div>
      <button
      className="rounded-md bg-zinc-400 p-2 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-zinc-600 focus:shadow-none active:bg-zinc-600 hover:bg-zinc-600 active:shadow-none   disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
      onClick={() => { setFormMode('add'); handleOpen(); }}>Ajouter un produit</button>
      <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
        <Box sx={style}>
          <form onSubmit={handleSubmit}>
            <div>
              <label>
                Titre du produit :
              <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}/>
              </label>
            </div>
            <div>
              <label>
                Prix du produit :
              <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleInputChange}/>
              </label>
              <button className="rounded-md bg-zinc-400 p-2 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-zinc-600 focus:shadow-none active:bg-zinc-600 hover:bg-zinc-600 active:shadow-none   disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="submit">Enregistrer</button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
    <div className="flex flex-wrap bg-gray-100">
      {currentProducts.map((product) => ( 
        <ProductsCard
        _id={product._id}
        image={product.thumbnail}
        title={product.title}
        category={product.category}
        price={product.price}
        refreshProducts={refreshProducts}/>
      ))}
    </div>
    <div className="flex items-center gap-4 justify-center my-4">
      <Button
      variant="text"
      className="flex items-center gap-2"
      onClick={prevPage}
      disabled={currentPage === 1}>
        <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
      </Button>
      <Button
      variant="text"
      className="flex items-center gap-2"
      onClick={nextPage}
      disabled={currentPage === totalPages}>
        Next
        <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
      </Button>
    </div>
  </div>
);
}

export default ProductList;

