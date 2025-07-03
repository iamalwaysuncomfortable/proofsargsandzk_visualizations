import { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import LagrangeInterpolation from './LagrangeInterpolation'
import './App.css'

// Utility function to convert character to number (ASCII)
const charToNumber = (char) => char.charCodeAt(0)

// Utility function to convert number back to character
const numberToChar = (num) => String.fromCharCode(num)

// Calculate polynomial value at point r
const evaluatePolynomial = (coefficients, r, p) => {
  let result = 0
  for (let i = 0; i < coefficients.length; i++) {
    result = (result + coefficients[i] * Math.pow(r, i)) % p
  }
  return result
}

// Generate polynomial data points for visualization
const generatePolynomialData = (coefficients, p, numPoints = 100) => {
  const data = []
  const step = p / numPoints
  
  for (let i = 0; i < numPoints; i++) {
    const x = i * step
    const y = evaluatePolynomial(coefficients, x, p)
    data.push({ x: Math.round(x * 100) / 100, y })
  }
  
  return data
}

// Find a suitable prime number
const findPrime = (min) => {
  for (let p = min; p < min + 1000; p++) {
    if (isPrime(p)) return p
  }
  return min + 1000 // fallback
}

const isPrime = (num) => {
  if (num <= 1) return false
  if (num <= 3) return true
  if (num % 2 === 0 || num % 3 === 0) return false
  
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false
  }
  return true
}

function App() {
  const [aliceMessage, setAliceMessage] = useState('HELLO')
  const [bobMessage, setBobMessage] = useState('HELLO')
  const [selectedR, setSelectedR] = useState(5)
  const [showGraph, setShowGraph] = useState(false)

  // Calculate parameters based on messages
  const params = useMemo(() => {
    const n = Math.max(aliceMessage.length, bobMessage.length)
    const m = 128 // ASCII characters
    const minP = Math.max(m, n * n)
    const p = findPrime(minP)
    
    return { n, m, p }
  }, [aliceMessage, bobMessage])

  // Convert messages to coefficient arrays
  const aliceCoefficients = useMemo(() => {
    return aliceMessage.split('').map(charToNumber)
  }, [aliceMessage])

  const bobCoefficients = useMemo(() => {
    return bobMessage.split('').map(charToNumber)
  }, [bobMessage])

  // Calculate polynomial values at selected r
  const aliceValue = evaluatePolynomial(aliceCoefficients, selectedR, params.p)
  const bobValue = evaluatePolynomial(bobCoefficients, selectedR, params.p)
  const areEqual = aliceValue === bobValue

  // Generate data for graphing
  const aliceData = generatePolynomialData(aliceCoefficients, params.p)
  const bobData = generatePolynomialData(bobCoefficients, params.p)
  
  // Combine data for visualization
  const combinedData = aliceData.map((point, index) => ({
    x: point.x,
    alice: point.y,
    bob: bobData[index]?.y || 0
  }))

  // Calculate error probability
  const errorProbability = (params.n - 1) / params.p

  return (
    <div className="app">
      <header className="app-header">
        <h1>Reed-Solomon Fingerprinting Visualization</h1>
        <p>Interactive visualization of the communication protocol from Section 2.1</p>
      </header>

      <div className="main-content">
        <div className="input-section">
          <div className="message-input">
            <h3>Alice's Message</h3>
            <input
              type="text"
              value={aliceMessage}
              onChange={(e) => setAliceMessage(e.target.value.toUpperCase())}
              placeholder="Enter Alice's message..."
              maxLength={20}
            />
            <div className="coefficients">
              <strong>Coefficients:</strong> [{aliceCoefficients.join(', ')}]
            </div>
            <div className="polynomial">
              <strong>Polynomial:</strong> P<sub>a</sub>(x) = {aliceCoefficients.map((coeff, i) => 
                `${coeff}${i > 0 ? `x^${i}` : ''}`
              ).join(' + ')}
            </div>
          </div>

          <div className="message-input">
            <h3>Bob's Message</h3>
            <input
              type="text"
              value={bobMessage}
              onChange={(e) => setBobMessage(e.target.value.toUpperCase())}
              placeholder="Enter Bob's message..."
              maxLength={20}
            />
            <div className="coefficients">
              <strong>Coefficients:</strong> [{bobCoefficients.join(', ')}]
            </div>
            <div className="polynomial">
              <strong>Polynomial:</strong> P<sub>b</sub>(x) = {bobCoefficients.map((coeff, i) => 
                `${coeff}${i > 0 ? `x^${i}` : ''}`
              ).join(' + ')}
            </div>
          </div>
        </div>

        <div className="protocol-section">
          <h3>Communication Protocol</h3>
          <div className="protocol-steps">
            <div className="step">
              <strong>Step 1:</strong> Choose prime p = {params.p} (≥ max({params.m}, {params.n}²))
            </div>
            <div className="step">
              <strong>Step 2:</strong> Alice picks random r ∈ F<sub>p</sub>
              <input
                type="range"
                min="1"
                max={params.p - 1}
                value={selectedR}
                onChange={(e) => setSelectedR(parseInt(e.target.value))}
                className="r-slider"
              />
              <span>r = {selectedR}</span>
            </div>
            <div className="step">
              <strong>Step 3:</strong> Alice computes h<sub>r</sub>(a) = P<sub>a</sub>({selectedR}) = {aliceValue}
            </div>
            <div className="step">
              <strong>Step 4:</strong> Bob computes h<sub>r</sub>(b) = P<sub>b</sub>({selectedR}) = {bobValue}
            </div>
            <div className="step">
              <strong>Step 5:</strong> Bob compares: {aliceValue} {areEqual ? '=' : '≠'} {bobValue}
            </div>
            <div className="result">
              <strong>Result:</strong> 
              <span className={areEqual ? 'equal' : 'not-equal'}>
                {areEqual ? 'EQUAL' : 'NOT EQUAL'}
              </span>
            </div>
          </div>

          <div className="analysis">
            <h4>Analysis</h4>
            <div className="analysis-item">
              <strong>Error Probability:</strong> ≤ (n-1)/p = {errorProbability.toFixed(6)} ≤ 1/n = {(1/params.n).toFixed(6)}
            </div>
            <div className="analysis-item">
              <strong>Communication Cost:</strong> O(log p) = O(log n + log m) bits instead of n characters
            </div>
            <div className="analysis-item">
              <strong>Fact 2.1:</strong> Two distinct polynomials of degree ≤ n can agree on at most n points
            </div>
          </div>
        </div>

        <div className="visualization-section">
          <h3>Polynomial Visualization</h3>
          <button 
            onClick={() => setShowGraph(!showGraph)}
            className="toggle-button"
          >
            {showGraph ? 'Hide' : 'Show'} Polynomial Graphs
          </button>

          {showGraph && (
            <div className="graph-container">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={combinedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="x" 
                    label={{ value: 'x', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis 
                    label={{ value: 'P(x) mod p', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value, name) => [value, name === 'alice' ? 'Alice' : 'Bob']}
                    labelFormatter={(label) => `x = ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="alice" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    name="Alice's Polynomial P<sub>a</sub>(x)"
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="bob" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    name="Bob's Polynomial P<sub>b</sub>(x)"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
              
              <div className="graph-legend">
                <div className="legend-item">
                  <div className="legend-color alice"></div>
                  <span>Alice's Polynomial P<sub>a</sub>(x)</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color bob"></div>
                  <span>Bob's Polynomial P<sub>b</sub>(x)</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color intersection"></div>
                  <span>Intersection Points (where P<sub>a</sub>(r) = P<sub>b</sub>(r))</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <LagrangeInterpolation />
    </div>
  )
}

export default App
