import React, { useState, useEffect } from 'react'; 
import { useParams  } from 'react-router-dom';

function Category() {
const { categoryName, categoryId } = useParams();
const [menuItems, setMenuItems] = useState([]);
const [name, setName] = useState('');
const [price, setPrice] = useState('');

useEffect(() => {
  const fetchMenuItems = async () => 
  {
    const token = localStorage.getItem('token');
    const backend = await fetch(`http://localhost:8000/api/menuItems/?categoryId=${categoryId}`, 
    {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
      },
    });

    if (backend.ok) {
      const data = await backend.json();
      setMenuItems(data);
    } else {
      console.error('loading error(cat)');
    }
  };

  fetchMenuItems();
}, [categoryId]);

const addMenuItem = async (e) => 
{
  e.preventDefault();
  const token = localStorage.getItem('token');

  const Data = {
    name: name,
    price: price,
    category: categoryId,
  }

  const backend = await fetch('http://localhost:8000/api/menuItems/', 
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
    body: JSON.stringify(Data),
  });

  if (backend.ok) 
  {
    const newMenutItem = await backend.json();
    setMenuItems([...menuItems, newMenutItem]); // Füge die neue Kategorie zur Liste hinzu
    setName('');
    setPrice('');
  } 
  else 
  {
    console.error('loading error (MenuItems)');
  }
  
};

  return (
    <div className='min-h-screen bg-gray-100 py-10'>
  <h1 className='text-center text-5xl mb-10'>ServeSavvy</h1>
  <div className='flex justify-center mb-10'>
    <div className='border-2 border-gray-700 p-6 text-center bg-white shadow-lg rounded-lg'>
      {categoryName}
    </div>
  </div>
  <form onSubmit={addMenuItem} className='text-center flex justify-center flex-col w-80 mx-auto mb-10'>
    <input
      className="mb-4 p-2 border-2 border-gray-200 rounded"
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Name"
      required
    />
    <input
      className="mb-4 p-2 border-2 border-gray-200 rounded"
      type="number"
      value={price}
      onChange={(e) => setPrice(e.target.value)}
      placeholder="Preis"
      required
    />
    <button className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700' >
      Add MenuItem
    </button>
  </form>
  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center'>
    {menuItems.map(menuItem => (
      <div className="w-full max-w-sm p-4 bg-blue-100 rounded-lg shadow-md transition-colors duration-200 ease-in-out"
          key={menuItem.id}>
        <h3 className="text-xl font-semibold mb-2">{menuItem.name}</h3>
        <p className="text-lg mb-2">{menuItem.price} €</p>
      </div>
    ))}
  </div>
</div>

  );
}

export default Category;

