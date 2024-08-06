import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { Input, Button, TablePagination, Modal, Box } from '@mui/material';
import NavBar from '../components/NavBar';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function HomePage() {
  const [productName, setProductName] = useState("")
  const [productPrice, setProductPrice] = useState("")

  const[productNameEdit, setProductNameEdit] = useState("")
  const[productPriceEdit, setProductPriceEdit] = useState("")

  const [productImage, setProductImage] = useState()

  const [products, setProducts] = useState([])

  const[modal, setModal] = useState(false)

  const addProduct = () => {
    const productRequest = {
      product_price: productPrice,
      product_name: productName
    }
    if(productPrice != null && productName != null){
      window.ipc.send('add-products', productRequest)
      setProducts([...products, productRequest])
    }
  }

  const removeProduct = (index: number) => {
    window.ipc.send('remove-products', index)
    setProducts(products.filter((_, i) => i !== index))
  }

  useEffect(() => {
    window.ipc.on('products', (products: Object[]) => {
      setProducts(products)
    })

    window.ipc.send('get-products', null)
  }, [])

  return (
    <div>
      <NavBar></NavBar>
      <Head>
        <title>Vendas</title>
      </Head>
      <div>
        <h2 >Nome do produto</h2>
        <Input type="text" value={productName} onChange={(e)=>{setProductName(e.target.value)}}></Input>
        <h2 >Preço do produto</h2>
        <Input type="text" value={productPrice} onChange={(e)=>{setProductPrice(e.target.value)}}></Input>
        <Button className='bg-green-500 text-white' onClick={addProduct}>Adicionar novo produto</Button>
        <h2>Produtos</h2>
        <ul>
          {products.map((product, index) => (
            <li key={index}>
              <h6>{index}</h6>
              <h3>{product.product_name}</h3>
              <p>{product.product_price}</p>
              <Button className='bg-orange-500 text-white' onClick={() => {setModal(true)}}>Editar</Button>
              <Modal
              open={modal}
              onClose={()=>{setModal(false)}}
              >
                <Box sx={style} className="bg-purple-500">
                  <h2>Editar Produto</h2>
                  <h4>Nome do produto</h4>
                  <h5>{product.product_name}</h5>
                  <Input type="text" value={productNameEdit} onChange={(e)=>{setProductNameEdit(e.target.value)}}></Input>
                  <h4>Preço do produto</h4>
                  <h5>{product.product_price}</h5>
                  <Input type="text" value={productPriceEdit} onChange={(e)=>{setProductPriceEdit(e.target.value)}}></Input>
                  <Button className='bg-white text-black hover:bg-gray-300'>Editar o produto</Button>
                </Box>
              </Modal>
              <Button className='bg-red-500 text-white' onClick={() => removeProduct(index)}>Remover</Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
