import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface ProductProps {
  _id: number;
  title: string;
  image: string;
  category: string;
  price: number;
  refreshProducts: () => void;
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

export default function ProductsCard({ _id, title, image, category, price, refreshProducts }: ProductProps) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [addProducts,setAddProducts] = useState();
  const [deleteProducts, setDeleteProducts] = useState();
  const [modifProducts, setModifProducts] = useState();
  const [formMode, setFormMode] = useState<'add' | 'update' | 'delete'>('add');
  const [formData, setFormData] = useState({ title: '', price: '' });

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    if (formMode === 'update') {
      const productId = _id;
      const response = await axios.put(`http://localhost:8000/products/update/${productId}`, {
        title: formData.title,
        price: parseFloat(formData.price)
      });
      setModifProducts(response.data);
      refreshProducts();
    } else if (formMode === 'delete') {
      const productId = _id; 
      const response = await axios.delete(`http://localhost:8000/products/delete/${productId}`);
      setDeleteProducts(response.data);
      refreshProducts();
    }
  } catch (error) {
    console.error('Erreur lors de la soumission du formulaire :', error);
  } finally {
    handleClose();
  }
};


const handleEditClick = () => {
  setFormData({ title, price: price.toString() });
  setFormMode('update');
  handleOpen();
};

const handleDeleteClick = async () => {
  try {
    const response = await axios.delete(`http://localhost:8000/products/delete/${_id}`);
    refreshProducts();
    setDeleteProducts(response.data);
    handleClose();
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
  }
};

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value
  }));
};


return (
  <div className="flex justify-center items-start bg-gray-100 p-10">
    <div className="relative flex flex-col bg-white shadow-sm border border-zinc-200 rounded-lg w-96">
      <div className="relative h-56 m-2.5 overflow-hidden text-white rounded-md">
        <img className="w-full h-full object-cover" src={image} alt="card-image"/>
      </div>
      <div className="p-4">
        <h6 className="mb-2 text-zinc-800 text-xl font-semibold">
        {title}
        </h6>
        <p className="text-zinc-600 leading-normal font-light">
        {category}
        </p>
        <p className="mb-2 text-zinc-800 text-xl font-semibold">
        {price}€
        </p>
      </div>
      <div className="px-4 pb-4 pt-0 mt-2">
        <button className="rounded-md bg-zinc-400 p-2 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-zinc-600 focus:shadow-none active:bg-zinc-600 hover:bg-zinc-600 active:shadow-none   disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button">
        Achetter
        </button>
        <button className='rounded-md bg-green-400 p-2 ml-15 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-green-600 focus:shadow-none active:bg-green-600 hover:bg-green-600 active:shadow-none   disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none' onClick={handleEditClick}>Modifier</button>
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
          <Box sx={style}>
          {formMode === 'update' && (
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
              </div>
              <button
              type="submit"
              className="rounded-md bg-zinc-400 p-2 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-zinc-600 focus:shadow-none active:bg-zinc-600 hover:bg-zinc-600 active:shadow-none     disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
              Enregistrer
             </button>
            </form>
          )}
          {formMode === 'delete' && (
            <div>
              <p className="mb-4 text-zinc-800 font-semibold">
                Es-tu sûr de vouloir supprimer ce produit ?
              </p>
              <button
              onClick={handleDeleteClick}
              className="rounded-md bg-red-400 p-2 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-red-600 focus:shadow-none active:bg-red-600 hover:bg-red-600 active:shadow-none   disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
                Supprimer
              </button>
              <button
              onClick={handleClose}
              className="rounded-md bg-zinc-400 p-2 ml-10 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-zinc-600 focus:shadow-none active:bg-zinc-600 hover:bg-zinc-600 active:shadow-none   disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
                Annuler
              </button>
            </div>
          )}
          </Box>
        </Modal>
        <button className='rounded-md bg-red-400 p-2 ml-15 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-red-600 focus:shadow-none active:bg-red-600 hover:bg-red-600 active:shadow-none   disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'   onClick={() => {
        setFormMode('delete');
        handleOpen();}}>Supprimer</button>
      </div>
    </div>
  </div>
  );
}


