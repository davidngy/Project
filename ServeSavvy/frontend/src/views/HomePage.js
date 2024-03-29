import React, { useState, useEffect } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';

function HomePage() {
    const [boxes, setBoxes] = useState([]);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      //display the tables
      const fetchUserTables = async () => {
        const token = localStorage.getItem('token'); // get token of local storage
        const backend = await fetch('http://localhost:8000/api/tables/', 
        {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
          },
        });
  
        if (backend.ok) {
          let tables = await backend.json();
          setBoxes(tables); // update the tables
        } else {
          console.error('loading error(tables)');
        }
       
      }
      const userIdFromStorage = localStorage.getItem('userId');
      setUserId(userIdFromStorage); 

      fetchUserTables();
    }, []); 
    
    const navigateOrderPage = (boxId, boxNumber) => 
    {
      navigate(`/OrderPage/${boxId}/${boxNumber}`)
    }

    const logout = () => {
      localStorage.removeItem('userId');
      console.log('removed userId');
      localStorage.removeItem('token');
      console.log('removed token');
      navigate('/login'); 
    };
    
    const addBox = async () => 
    {
      const token = localStorage.getItem('token');

      const backend = await fetch('http://localhost:8000/api/tables/', 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({})
      });
      if(backend.ok)
      {
        const newBox = await backend.json();
        setBoxes([...boxes, newBox]);
      }
    };

    const deleteBox = async () => 
    {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/tables/', {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`, 
        },
      });
  
      if (response.ok) {
        setBoxes(prevBoxes => prevBoxes.slice(0, -1));
      } else {
        alert('couldnt delete table.');
      }
    };
    
    
    return (
      <div className='min-h-screen bg-gray-100 p-4 md:p-10'>
        <h1 className='text-center text-3xl md:text-5xl mt-5 mb-10'>ServeSavvy</h1>
        <div className='flex flex-col md:flex-row md:justify-between items-center'>
          <Link to={`/menu`} className='bg-blue-500 text-white text-sm md:text-base px-4 py-2 rounded hover:bg-blue-700 mb-2 md:mb-0 transition-colors'>
            Menu
          </Link>
          <div className='flex'>
            {!userId && (
              <>
                <Link to={`/register`} className='bg-blue-500 text-white text-sm md:text-base px-4 py-2 rounded hover:bg-blue-700 mr-2 transition-colors'>
                  Register
                </Link>
                <Link to={`/login`} className='bg-blue-500 text-white text-sm md:text-base px-4 py-2 rounded hover:bg-blue-700 transition-colors'>
                  Log In
                </Link>
              </>
            )}
            {userId && (
              <button onClick={logout} className='bg-blue-500 text-white text-sm md:text-base px-4 py-2 rounded hover:bg-blue-700 transition-colors'>
                Logout
              </button>
            )}
          </div>
        </div>
    
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 justify-center mt-5'>
          {boxes.map((box, index) => {
            const isActive = localStorage.getItem(`table_${box.id}_hasItems`) === 'true';
            return (
              <div 
                className={`w-full h-32 border-4 ${isActive ? 'bg-red-500' : 'border-gray-400'} flex justify-center items-center cursor-pointer`}
                onClick={() => navigateOrderPage(box.id, index + 1)}
                key={box.id}
              >
                {`table ${index + 1}`}
              </div>
            );
          })}
        </div>
    
        <div className='flex justify-center mt-4 space-x-2'>
          <button className='bg-blue-500 text-white text-sm md:text-base px-4 py-2 rounded hover:bg-blue-700 transition-colors' onClick={addBox}>
            add table
          </button>
          <button className='bg-blue-500 text-white text-sm md:text-base px-4 py-2 rounded hover:bg-blue-700 transition-colors' onClick={deleteBox}>
            delete table
          </button>
        </div>
      </div>
    );    
        
}

export default HomePage;