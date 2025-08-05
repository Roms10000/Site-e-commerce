import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Nav from './nav.tsx'
import ProductList from './ProductList.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Nav/>
    <div className="flex flex-wrap gap-4 p-4 bg-gray-100">
    <ProductList/>
    </div>
  </StrictMode>,
)
