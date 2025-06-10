import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [monedas, setMonedas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState('');
  const [monedaOrigen, setMonedaOrigen] = useState('USD');
  const [monedaDestino, setMonedaDestino] = useState('EUR');
  const [resultado, setResultado] = useState(null);
  const [convirtiendo, setConvirtiendo] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/monedas');
        if (!response.ok) {
          throw new Error('Error al obtener las monedas');
        }
        const data = await response.json();
        setMonedas(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error('Error:', err);
      }
    };

    fetchData();
  }, []);

  const realizarConversion = async (e) => {
    e.preventDefault();
    setError(null);
    setConvirtiendo(true);

    try {
      const response = await fetch('http://localhost:5000/convertir', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cantidad: parseFloat(cantidad),
          origen: monedaOrigen,
          destino: monedaDestino
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en la conversión');
      }

      const data = await response.json();
      setResultado(data.resultado);
    } catch (err) {
      console.error('Error en la conversión:', err);
      setError(err.message);
      setResultado(null);
    } finally {
      setConvirtiendo(false);
    }
  };

  const intercambiarMonedas = () => {
    setMonedaOrigen(monedaDestino);
    setMonedaDestino(monedaOrigen);
    setResultado(null);
  };

  // Obtener monedas únicas para los selectores
  const monedasUnicas = [...new Set(monedas.map(m => m.origen))];

  if (loading) return (
    <div className="loading">
      <div className="loading-text">Cargando...</div>
      <div className="loading-spinner"></div>
    </div>
  );

  return (
    <div className="container">
      <h1>💱 Conversor de Monedas</h1>
      
      {error && <div className="error-message">❌ {error}</div>}

      <form onSubmit={realizarConversion} className="conversion-form">
        <div className="form-group">
          <label htmlFor="cantidad">💰 Cantidad:</label>
          <input
            type="number"
            id="cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            required
            min="0.01"
            step="0.01"
            placeholder="Ingrese la cantidad a convertir"
          />
        </div>

        <div className="conversion-group">
          <div className="form-group">
            <label htmlFor="monedaOrigen">De:</label>
            <select
              id="monedaOrigen"
              value={monedaOrigen}
              onChange={(e) => setMonedaOrigen(e.target.value)}
            >
              {monedasUnicas.map(moneda => (
                <option key={moneda} value={moneda}>{moneda}</option>
              ))}
            </select>
          </div>

          <button 
            type="button" 
            className="swap-button" 
            onClick={intercambiarMonedas}
            title="Intercambiar monedas"
          >
            🔄
          </button>

          <div className="form-group">
            <label htmlFor="monedaDestino">A:</label>
            <select
              id="monedaDestino"
              value={monedaDestino}
              onChange={(e) => setMonedaDestino(e.target.value)}
            >
              {monedasUnicas.map(moneda => (
                <option key={moneda} value={moneda}>{moneda}</option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" disabled={convirtiendo}>
          {convirtiendo ? 'Convirtiendo...' : 'Convertir'}
        </button>
      </form>

      {resultado !== null && (
        <div className="resultado">
          <h2>Resultado de la Conversión</h2>
          <p>
            {parseFloat(cantidad).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {monedaOrigen} = 
          </p>
          <p className="resultado-valor">
            {resultado.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {monedaDestino}
          </p>
        </div>
      )}

      <div className="tasas-container">
        <h2>📊 Tasas de Cambio Disponibles</h2>
        <div className="table-container">
          <table className="exchange-table">
            <thead>
              <tr>
                <th>Moneda Origen</th>
                <th>Moneda Destino</th>
                <th>Tasa</th>
              </tr>
            </thead>
            <tbody>
              {monedas.map((item) => (
                <tr key={item.id}>
                  <td>{item.origen}</td>
                  <td>{item.destino}</td>
                  <td>{item.valor.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default App 