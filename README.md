# Reed-Solomon Fingerprinting Visualization

An interactive web application that visualizes the Reed-Solomon fingerprinting communication protocol described in Section 2.1 of the book. This app demonstrates how Alice and Bob can efficiently determine if their files are equal using polynomial evaluation over finite fields.

## Features

### 🎯 **Interactive Message Input**
- Type messages for Alice and Bob (up to 20 characters)
- Real-time conversion of messages to polynomial coefficients
- Visual display of the polynomial equations

### 🔢 **Protocol Visualization**
- Step-by-step demonstration of the communication protocol
- Interactive slider to choose the random value `r`
- Real-time calculation of polynomial evaluations
- Clear comparison of results (EQUAL vs NOT EQUAL)

### 📊 **Mathematical Analysis**
- Automatic prime number selection based on message length
- Error probability calculations
- Communication cost analysis
- Reference to Fact 2.1 about polynomial intersections

### 📈 **Polynomial Graphing**
- Interactive graphs showing both Alice's and Bob's polynomials
- Visualization of polynomial evaluations modulo p
- Clear legend and tooltips for better understanding

## How It Works

### The Protocol (Section 2.1.2)

1. **Setup**: Choose a prime number p ≥ max(m, n²) where m=128 (ASCII) and n is the message length
2. **Random Selection**: Alice picks a random value r ∈ Fₚ
3. **Polynomial Evaluation**: Alice computes hᵣ(a) = Pₐ(r) where Pₐ(x) is the polynomial with coefficients from her message
4. **Communication**: Alice sends r and hᵣ(a) to Bob
5. **Comparison**: Bob computes hᵣ(b) = Pᵦ(r) and compares with hᵣ(a)

### The Mathematics

- **Polynomial Construction**: Each message (a₁, a₂, ..., aₙ) becomes coefficients of polynomial P(x) = a₁ + a₂x + a₃x² + ... + aₙxⁿ⁻¹
- **Hash Function**: hᵣ(x) = Σᵢ₌₁ⁿ aᵢ·rⁱ⁻¹ (mod p)
- **Error Probability**: ≤ (n-1)/p ≤ 1/n when p ≥ n²

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd reed-solomon-fingerprint
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Basic Operation

1. **Enter Messages**: Type different messages for Alice and Bob in the input fields
2. **Adjust Random Value**: Use the slider to change the random value `r`
3. **Observe Results**: Watch how the protocol determines if messages are equal
4. **View Graphs**: Click "Show Polynomial Graphs" to visualize the polynomials

### Example Scenarios

- **Equal Messages**: Try "HELLO" for both Alice and Bob - should show EQUAL
- **Different Messages**: Try "HELLO" for Alice and "WORLD" for Bob - should show NOT EQUAL
- **Similar Messages**: Try "HELLO" and "HELLP" to see how small differences are detected

### Understanding the Visualization

- **Coefficients**: Shows the ASCII values of each character as polynomial coefficients
- **Polynomial**: Displays the mathematical form P(x) = a₀ + a₁x + a₂x² + ...
- **Protocol Steps**: Shows each step of the communication protocol with current values
- **Analysis**: Provides mathematical insights about error probability and communication cost

## Technical Details

### Implementation Notes

- **Prime Selection**: The app automatically finds a suitable prime number p ≥ max(128, n²)
- **Modular Arithmetic**: All calculations are performed modulo p to keep numbers manageable
- **Polynomial Evaluation**: Uses Horner's method for efficient polynomial evaluation
- **Graphing**: Uses Recharts library for smooth, interactive polynomial visualization

### Mathematical Accuracy

The implementation follows the exact protocol described in the book:
- Uses the hash function family H = {hᵣ : r ∈ Fₚ} where hᵣ(a₁,...,aₙ) = Σᵢ₌₁ⁿ aᵢ·rⁱ⁻¹
- Maintains the error probability bound of ≤ (n-1)/p
- Respects the communication complexity of O(log p) bits

## Educational Value

This visualization helps understand:

1. **Randomness in Algorithms**: How random choices can dramatically improve efficiency
2. **Polynomial Properties**: The relationship between polynomial evaluation and equality testing
3. **Finite Field Arithmetic**: Working with modular arithmetic and prime fields
4. **Communication Complexity**: Trade-offs between communication cost and error probability
5. **Hash Functions**: How hash functions can provide "fingerprints" for large data

## Contributing

Feel free to contribute improvements, bug fixes, or additional features. Some ideas:

- Add more detailed mathematical explanations
- Include additional visualization options
- Add support for different character encodings
- Implement the full Reed-Solomon error correction algorithm

## License

This project is open source and available under the MIT License.
