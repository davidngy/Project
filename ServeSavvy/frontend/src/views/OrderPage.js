import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function OrderPage() {
  const { boxId, boxNumber } = useParams(); 
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [addedMenuItems, setAddedMenuItems] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [hasItemsAdded, setHasItemsAdded] = useState(false);


  useEffect(() => {
    const fetchCategories = async () => 
    {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/categories/', 
      {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
  
      if (response.ok) 
      {
        const fetchedCategories = await response.json();
        setCategories(fetchedCategories);
      } 
      else 
      {
        console.error('Fehler beim Laden der Kategorien');
      }
    };
  
    fetchCategories();
  }, []);

  useEffect(() => 
  {
    const fetchAddedMenuItems = async () => 
    {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/tables/${boxId}/menu_items/`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
  
      if (response.ok) 
      {
        const data = await response.json();
        console.log(data);
        setAddedMenuItems(data);
      } 
      else 
      {
        console.error('Fehler beim Laden der hinzugefügten Menüpunkte');
      }
    };
  
    fetchAddedMenuItems();
  }, [boxId]);
  

  // Logik zum Laden der MenuItems für die ausgewählte Kategorie

  useEffect(() =>
  {
    if (selectedCategoryId) 
    {
      fetchMenuItems(selectedCategoryId);
    }
  }, [selectedCategoryId]);

  const fetchMenuItems = async (categoryId) => 
  {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8000/api/menuItems/?categoryId=${categoryId}`, 
    {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
      },
    });
  
    if (response.ok) 
    {
      const data = await response.json();
      setMenuItems(data);
    }
    else 
    {
      console.error('Fehler beim Laden der MenuItems');
    }
  };

  const addMenuItemToTable = async (menuItemId) => 
  {
    const menuItem = menuItems.find(item => item.id === menuItemId);
    if (menuItem) 
    {
      let newQuantity = 1;
      const existingItemIndex = addedMenuItems.findIndex(item => item.menuItem.id === menuItemId);
      
      // Wenn MenuItem bereits hinzugefügt, erhöhe nur die Quantität
      if (existingItemIndex !== -1) 
      {
        newQuantity = addedMenuItems[existingItemIndex].quantity + 1;
        // Aktualisiere den Zustand für das existierende MenuItem
        setAddedMenuItems(addedMenuItems.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: newQuantity } : item
        ));
      } 
      else 
      {
        // Wenn nein, füge das neue MenuItem hinzu mit Quantität 1
        setAddedMenuItems([...addedMenuItems, { menuItem, quantity: newQuantity }]);
      }
    
      const token = localStorage.getItem('token');
      const backend = await fetch(`http://localhost:8000/api/tables/${boxId}/addMenuItem`, 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({ menuItemId, quantity: newQuantity }),
      });
  
      if (backend.ok)
      {
        console.log("MenuItem erfolgreich zum Tisch hinzugefügt oder aktualisiert.");
        localStorage.setItem(`table_${boxId}_hasItems`, 'true');
        setHasItemsAdded(true);
      }
      else 
      {
        console.error("Fehler beim Hinzufügen des MenuItems zum Tisch.");
      }
    }
};

const resetTable = async () => 
{
  const token = localStorage.getItem('token');
  try 
  {
    const response = await fetch(`http://localhost:8000/api/tables/${boxId}/menu_items/`, 
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`,
      },
    });

    if (response.ok) 
    {
      // Lokalen Zustand zurücksetzen
      localStorage.setItem(`table_${boxId}_hasItems`, 'false');
      setAddedMenuItems([]);
      alert("Table successfully reseted!");
    } 
    else 
    {
      console.error("Error deleting MenuItem");
      alert("Error deleting MenuItem");
    }
  } 
  catch (error) 
  {
    console.error(error);
  }
};

  
const calculateTotal = () => 
{
  return addedMenuItems.reduce((acc, item) => acc + (item.menuItem.price * item.quantity), 0).toFixed(2);
};

  
const handleCategoryChange = (e) =>
{
  setSelectedCategoryId(e.target.value);
};
  
    return (
      <div className='min-h-screen bg-gray-100 py-10'>
      <h1 className='text-center text-5xl mb-10'>ServeSavvy - table {boxNumber}</h1>

      <div className='flex justify-center mb-10'>
        <select
          className="p-2 border-2 border-gray-200 rounded"
          value={selectedCategoryId}
          onChange={handleCategoryChange}
        >
          <option value="">choose a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className='flex justify-between'>
        <div className='w-1/2 pr-2'>
          {/* Menüpunkte zur Auswahl */}
          {menuItems.map((menuItem) => (
            <div className="mb-4 p-4 bg-blue-100 rounded-lg shadow-md transition-colors duration-200 ease-in-out"
                key={menuItem.id}>
              <h3 className="text-xl font-semibold mb-2">{menuItem.name}</h3>
              <p className="text-lg mb-2">{menuItem.price} €</p>
              <button 
                onClick={() => addMenuItemToTable(menuItem.id)} 
                className='mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700'
              >
                add to table {boxNumber}
              </button>
            </div>
          ))}
        </div>
        <div className='w-1/2 pl-2'>
          {/* Angezeigte hinzugefügte Menüpunkte */}
          <h2 className='text-xl font-bold mb-4'>Order:</h2>
          {addedMenuItems.map((item, index) => (
            <div className="mb-4 p-4 bg-green-100 rounded-lg shadow-md" key={index}>
              <p className="text-lg">{item.menuItem.name} - {item.menuItem.price} € x {item.quantity}</p>
            </div>
          ))}

          <div className="mt-4 p-4 bg-yellow-100 rounded-lg shadow-md">
            <h3 className="text-xl font-bold">total: {calculateTotal()} €</h3>
          </div>
        
          <div className="flex justify-center mt-4">
            <button onClick={resetTable} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
              done
            </button>
          </div>

        </div>
      </div>

    </div>
    );
}

export default OrderPage;