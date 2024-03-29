import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Menu() {
    const[categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const navigate = useNavigate();

    useEffect(() => 
    {
      const fetchCategories = async () => 
      {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/api/categories/', 
        {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`, // Angenommen, der Token wird im Local Storage gespeichert
          },
        });
  
        if (response.ok) 
        {
          const data = await response.json();
          setCategories(data);
        } 
        else 
        {
          console.error('loading error(categories)');
        }
      };
  
      fetchCategories();
    }, []);

    const navigateCategoryPage = (categoryId, categoryName) => 
    {
      navigate(`/Category/${categoryId}/${categoryName}`);
    }

    const addCategory = async (e) => 
    {
      e.preventDefault();
      const token = localStorage.getItem('token');
      const backend = await fetch('http://localhost:8000/api/categories/', 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ name: newCategoryName }),
      });
  
      if (backend.ok) 
      {
        const newCategory = await backend.json();
        setCategories([...categories, newCategory]); // Füge die neue Kategorie zur Liste hinzu
        setNewCategoryName(''); // Setze das Formular zurück
      } 
      else 
      {
        console.error('couldnt add!');
      }
      
    };

    return(
        <div className='min-h-screen bg-gray-100'>
          <h1 className='text-center text-5xl mt-10 mb-5'>ServeSavvy</h1>
          <h2 className='text-center text-5xl mt-10 mb-5'>Menü</h2>
          <form onSubmit={addCategory} className='text-center'>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="new category"
              required
            />
            <button type="submit" className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700' >
              add category
            </button>
          </form>
          <div className='text-center mt-5'>
              {categories.map(category => (
                  <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-lg shadow-md cursor-pointer hover:bg-blue-200 transition-colors duration-200 ease-in-out"
                      onClick={() => navigateCategoryPage(category.id, category.name)}
                      key={category.id}>
                      {category.name}
                  </div>
              ))}
          </div>
        </div>
      );
    }

export default Menu;