import React, { useState, useEffect } from 'react';
import axios from "axios";
import "./App.css";

function App() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: 1 });
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/items');
      console.log('Items cargados:', response.data);
      setItems(response.data);
    } catch (error) {
      console.error('Error al cargar items:', error);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/items', newItem);
      setNewItem({ name: '', quantity: 1 });
      fetchItems();
    } catch (error) {
      console.error('Error al añadir item:', error);
    }
  };

  const handleUpdateItem = async (id) => {
    try {
      await axios.put(`http://localhost:3001/api/items/${id}`, editingItem);
      setEditingItem(null);
      fetchItems();
    } catch (error) {
      console.error('Error al actualizar item:', error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/items/${id}`);
      fetchItems();
    } catch (error) {
      console.error('Error al eliminar item:', error);
    }
  };

  return (
    <div className="minecraft-app">
      <h1 className="minecraft-title">Inventario de Minecraft</h1>
      
      <div className="input-container">
        <form onSubmit={handleAddItem} className="add-item-form">
          <input
            type="text"
            className="minecraft-input"
            placeholder="Nombre del item"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <input
            type="number"
            className="minecraft-input"
            placeholder="Cantidad"
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
            min="1"
          />
          <button type="submit" className="minecraft-button">
            Agregar Item
          </button>
        </form>
      </div>

      <div className="items-grid">
        {items.map((item) => (
          <div key={item.id} className="item-slot">
            {editingItem && editingItem.id === item.id ? (
              <div className="edit-form">
                <input
                  type="text"
                  className="minecraft-input"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                />
                <input
                  type="number"
                  className="minecraft-input"
                  value={editingItem.quantity}
                  onChange={(e) => setEditingItem({ ...editingItem, quantity: parseInt(e.target.value) })}
                  min="1"
                />
                <div className="edit-actions">
                  <button onClick={() => handleUpdateItem(item.id)} className="minecraft-button">
                    Guardar
                  </button>
                  <button onClick={() => setEditingItem(null)} className="minecraft-button cancel">
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="item-content">
                  <span className="item-name">{item.name}</span>
                  <span className="item-quantity">x{item.quantity}</span>
                </div>
                <div className="item-actions">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="minecraft-button small"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="minecraft-button small delete"
                  >
                    🗑️
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

