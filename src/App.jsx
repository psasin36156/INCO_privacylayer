import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImage from './asset/images/logo.png';
import nerdImage from './asset/images/nerd.png';

// --- CUSTOM TAILWIND CONFIG & COLORS (Strictly from user's palette) ---
// We define custom utility colors based on the provided palette for clarity and consistency.
const colors = {
    // Primary/Dark Background Blue
    'inco-dark': '#1B3E86', 
    
    // Primary Accent Blue
    'inco-blue': '#3673F5',
    'inco-light-blue': '#8EB1F9',
    
    // Background light colors
    'inco-bg-light': '#E7EEFE'
};



// Mock Data structure for the privacy levels and their logic
const PRIVACY_LEVELS = [
  {
    id: 1,
    name: "1. Transparent (Current Blockchain)",
    sender: { state: "VISIBLE", label: "Public Address" },
    receiver: { state: "VISIBLE", label: "Public Address" },
    amount: { state: "VISIBLE", label: "Public Amount" },
    color: `border-[${colors['inco-dark']}]/70`,
    bgClass: `bg-[${colors['inco-dark']}]/10`, 
    description: "All transaction details are fully visible to anyone.",
  },
  {
    id: 2,
    name: "2. Anonymous (Mixers / Obfuscated Identity)",
    sender: { state: "OBFUSCATED", label: "👤 Transaction Hash" },
    receiver: { state: "OBFUSCATED", label: "👤 Transaction Hash" },
    amount: { state: "VISIBLE", label: "Public Amount" },
    color: `border-[${colors['inco-light-blue']}]/70`,
    bgClass: `bg-[${colors['inco-light-blue']}]/10`,
    description: "Identity is obscured, but the value is still public.",
  },
  {
    id: 3,
    name: "3. Confidential (Inco Layer / cERC-20)",
    sender: { state: "VISIBLE", label: "Public Address" },
    receiver: { state: "VISIBLE", label: "Public Address" },
    amount: { state: "ENCRYPTED", label: "🔒 Confidential Value" },
    color: `border-[${colors['inco-blue']}]/70`,
    bgClass: `bg-[${colors['inco-blue']}]/10`,
    description: "Parties are known for compliance; only the financial amount is hidden.",
  },
  {
    id: 4,
    name: "4. Fully Private (Maximum Secrecy)",
    sender: { state: "ENCRYPTED", label: "🔒 Encrypted Data" },
    receiver: { state: "ENCRYPTED", label: "🔒 Encrypted Data" },
    amount: { state: "ENCRYPTED", label: "🔒 Encrypted Value" },
    color: `border-[${colors['inco-light-blue']}]/70`,
    bgClass: `bg-[${colors['inco-bg-light']}]/20`,
    description: "All transaction, identity, and value data is completely concealed.",
  },
];

// Animation variants for the row entry
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

// Animation variants for individual data blocks
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

// Helper function to format long addresses
const formatAddress = (address) => {
  if (!address) return '';
  // If it's an EVM address (42 chars) or longer, truncate it
  if (address.length > 20) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
  return address;
};

// Component for rendering a data cell with animation and masking logic
const DataCell = ({ state, value, label, delay }) => {
  let content;
  let baseClass = "p-3 font-mono text-sm sm:text-base transition-all duration-300 rounded-lg h-full flex items-center justify-center text-center border-2";
  let cellStyle = {};

  switch (state) {
    case 'VISIBLE':
      const displayValue = formatAddress(value);
      const isLongAddress = value && value.length > 20;
      content = (
        <span 
          style={{ color: colors['inco-dark'] }} 
          className="font-medium break-all"
          title={isLongAddress ? value : undefined}
        >
          {displayValue}
        </span>
      );
      cellStyle = {
        backgroundColor: '#FFFFFF',
        borderColor: colors['inco-blue']
      };
      break;
    case 'OBFUSCATED':
      content = <span style={{ color: colors['inco-blue'] }} className="font-semibold">{label}</span>;
      cellStyle = {
        backgroundColor: colors['inco-bg-light'],
        borderColor: colors['inco-light-blue']
      };
      baseClass += ' text-sm';
      break;
    case 'ENCRYPTED':
      // Use Inco brand blue colors for encrypted states
      const accentColor = colors['inco-blue'];
      content = <span style={{ color: accentColor }} className="font-semibold">{label}</span>;
      cellStyle = {
        backgroundColor: colors['inco-bg-light'],
        borderColor: accentColor,
        borderStyle: 'dashed'
      };
      baseClass += ' text-sm';
      break;
      default:
      content = <span style={{ color: colors['inco-dark'] }}>N/A</span>;
      cellStyle = {
        backgroundColor: '#FFFFFF',
        borderColor: colors['inco-blue']
      };
  }

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      className={baseClass}
      style={{
        ...cellStyle,
        minWidth: 0, // Allow flex items to shrink
        overflow: 'hidden',
        wordBreak: 'break-all'
      }}
    >
      <div className="w-full overflow-hidden text-ellipsis">
        {content}
      </div>
    </motion.div>
  );
};

// EVM Address Validation Function
const isValidEVMAddress = (address) => {
  if (!address) return false;
  // EVM addresses are 42 characters: 0x + 40 hex characters
  if (address.length !== 42) return false;
  // Must start with 0x
  if (!address.startsWith('0x') && !address.startsWith('0X')) return false;
  // Check if remaining characters are valid hexadecimal
  const hexPart = address.slice(2);
  const hexRegex = /^[0-9A-Fa-f]{40}$/;
  return hexRegex.test(hexPart);
};

// Generate nerd background items with fixed positions for stability
const generateNerdBackgroundItems = (count = 30) => {
  const items = [];
  for (let i = 0; i < count; i++) {
    // Use a simple seeded random based on index for consistency
    const seed = i * 123.456;
    const random = (offset) => {
      const x = Math.sin(seed + offset) * 10000;
      return x - Math.floor(x);
    };
    
    items.push({
      id: i,
      size: 60 + random(1) * 100,
      left: random(2) * 100,
      top: random(3) * 100,
      duration: 20 + random(4) * 40,
      delay: random(5) * 5,
      opacity: 0.1 + random(6) * 0.2,
      moveX: [
        0,
        (random(7) - 0.5) * 200,
        (random(8) - 0.5) * 200,
        (random(9) - 0.5) * 200,
        0
      ],
      moveY: [
        0,
        (random(10) - 0.5) * 200,
        (random(11) - 0.5) * 200,
        (random(12) - 0.5) * 200,
        0
      ],
      rotation: [
        0,
        (random(13) - 0.5) * 10,
        (random(14) - 0.5) * 10,
        (random(15) - 0.5) * 10,
        0
      ]
    });
  }
  return items;
};

const nerdBackgroundItems = generateNerdBackgroundItems(30);

// Main Application Component
export default function App() {
  const [inputs, setInputs] = useState({
    sender: '',
    receiver: '',
    amount: '',
  });
  const [submittedData, setSubmittedData] = useState(null);
  const [isDemoActive, setIsDemoActive] = useState(false);
  const [errors, setErrors] = useState({
    sender: '',
    receiver: '',
    amount: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Reset errors
    const newErrors = {
      sender: '',
      receiver: '',
      amount: ''
    };
    
    // Validate sender address
    if (!inputs.sender) {
      newErrors.sender = 'Sender address is required';
    } else if (!isValidEVMAddress(inputs.sender)) {
      newErrors.sender = 'Invalid EVM address format (must be 42 characters, starting with 0x)';
    }
    
    // Validate receiver address
    if (!inputs.receiver) {
      newErrors.receiver = 'Receiver address is required';
    } else if (!isValidEVMAddress(inputs.receiver)) {
      newErrors.receiver = 'Invalid EVM address format (must be 42 characters, starting with 0x)';
    }
    
    // Validate amount
    if (!inputs.amount) {
      newErrors.amount = 'Transaction amount is required';
    }
    
    setErrors(newErrors);
    
    // If there are errors, don't submit
    if (newErrors.sender || newErrors.receiver || newErrors.amount) {
      return;
    }

    setSubmittedData(null);
    setIsDemoActive(true);

    setTimeout(() => {
        setSubmittedData(inputs);
    }, 50); 
  };
  
  const resetDemo = () => {
    setSubmittedData(null);
    setIsDemoActive(false);
    setInputs({
        sender: '',
        receiver: '',
        amount: '',
      });
    setErrors({
      sender: '',
      receiver: '',
      amount: ''
    });
  }

  return (
    // Apply dark blue background and ensure text is visible
    <div className={`min-h-screen font-sans p-4 sm:p-8 relative overflow-hidden`} style={{ backgroundColor: colors['inco-dark'] }}>
      
      {/* Background decoration with nerd image flooding effect */}
      <div 
        className="absolute inset-0 z-0 overflow-hidden"
        style={{
          opacity: 0.4
        }}
      >
        {nerdBackgroundItems.map((item) => (
          <motion.img
            key={item.id}
            src={nerdImage}
            alt="Nerd character"
            className="absolute"
            style={{
              width: `${item.size}px`,
              height: 'auto',
              opacity: item.opacity,
              left: `${item.left}%`,
              top: `${item.top}%`,
              pointerEvents: 'none'
            }}
            initial={{ opacity: 0 }}
            animate={{
              x: item.moveX,
              y: item.moveY,
              rotate: item.rotation,
              opacity: item.opacity
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              ease: "linear",
              delay: item.delay
            }}
          />
        ))}
      </div>


      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
        className="relative z-10 text-center mb-10"
      >
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 150, delay: 0.3 }}
            className="mb-4 flex justify-center items-center"
        >
            {/* Inco Logo Integration */}
            <motion.img 
                src={logoImage} 
                alt="Inco Logo" 
                className="h-20 w-auto object-contain"
                style={{ maxWidth: '200px' }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 150, delay: 0.3 }}
            /> 
        </motion.div>
        <h1 
            className={`text-4xl sm:text-5xl font-black tracking-tight`}
            style={{ 
                color: colors['inco-bg-light'],
                fontFamily: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                fontWeight: 900,
                letterSpacing: '-0.02em',
                textShadow: `0 2px 4px rgba(0,0,0,0.3)`
            }}
        >
          Inco Privacy Level Playground
        </h1>
        <p className="mt-2 text-lg" style={{ color: colors['inco-light-blue'] }}>
          Visualize Inco's Four Levels of Confidentiality
        </p>
      </motion.header>

      {/* Input Form */}
      <motion.div
        className="relative z-10 max-w-4xl mx-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Instruction Message */}
        <motion.div
          className="mb-3 px-3 py-2 rounded border"
          style={{
            backgroundColor: colors['inco-bg-light'],
            borderColor: colors['inco-light-blue'],
            opacity: 0.8
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs md:text-sm text-center" style={{ color: colors['inco-dark'] }}>
            💡 Simulation: Input any sender and receiver details to compare standard transparency vs. Inco's confidential encryption.
          </p>
        </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        className={`p-6 backdrop-blur-sm rounded-xl shadow-2xl space-y-4`}
        style={{
          border: `2px solid ${colors['inco-blue']}`,
          backgroundColor: colors['inco-bg-light']
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputGroup
            label="Sender Address"
            name="sender"
            value={inputs.sender}
            onChange={handleInputChange}
            placeholder="e.g., 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
            error={errors.sender}
          />
          <InputGroup
            label="Receiver Address"
            name="receiver"
            value={inputs.receiver}
            onChange={handleInputChange}
            placeholder="e.g., 0x8ba1f109551bD432803012645Hac136c22C1727"
            error={errors.receiver}
          />
          <InputGroup
            label="Transaction Amount"
            name="amount"
            value={inputs.amount}
            onChange={handleInputChange}
            placeholder="e.g., 100.5 USDC"
            error={errors.amount}
          />
        </div>
        <div className='flex justify-center pt-2 gap-4'>
            <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ 
                    backgroundColor: colors['inco-blue'],
                    color: '#FFFFFF'
                }}
                className={`w-full md:w-auto px-8 py-3 hover:opacity-90 rounded-lg font-semibold shadow-lg transition-colors disabled:opacity-50`}
                disabled={isDemoActive}
            >
                {submittedData ? "Re-Run Simulation" : "Run Simulation"}
            </motion.button>
            {submittedData && (
                <motion.button
                    type="button"
                    onClick={resetDemo}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ 
                        backgroundColor: colors['inco-light-blue'],
                        color: colors['inco-dark']
                    }}
                    className={`w-full md:w-auto px-8 py-3 hover:opacity-90 rounded-lg font-semibold shadow-lg transition-colors`}
                >
                    Reset
                </motion.button>
            )}
        </div>
      </motion.form>
      </motion.div>

      {/* Output Table */}
      <AnimatePresence mode="wait">
        {submittedData && (
          <motion.div
            key="results"
            className="relative z-10 mt-12 max-w-6xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <div className={`grid grid-cols-4 gap-4 text-center text-sm font-bold tracking-wider uppercase pb-3 border-b-2 sticky top-0 z-20 rounded-t-lg px-3 py-2`}
                style={{ 
                  color: colors['inco-dark'],
                  backgroundColor: colors['inco-bg-light'],
                  borderColor: colors['inco-blue'],
                  gridTemplateColumns: '2fr 1fr 1fr 1fr' // Give more space to Privacy Level column
                }}
            >
              <div>Privacy Level</div>
              <div>Sender</div>
              <div>Receiver</div>
              <div>Amount</div>
            </div>

            {PRIVACY_LEVELS.map((level, index) => (
              <motion.div
                key={level.id}
                variants={itemVariants}
                className={`grid grid-cols-4 gap-4 py-4 px-3 mt-2 rounded-xl border-l-4 shadow-lg`}
                style={{
                  borderLeftColor: level.id === 1 ? colors['inco-dark'] : 
                                   level.id === 2 ? colors['inco-light-blue'] :
                                   level.id === 3 ? colors['inco-blue'] : colors['inco-light-blue'],
                  backgroundColor: colors['inco-bg-light'],
                  gridTemplateColumns: '2fr 1fr 1fr 1fr' // Match header column widths
                }}
              >
                {/* Level Name Column */}
                <div className="flex flex-col justify-center items-start space-y-1">
                  <span className="font-bold text-lg" style={{ color: colors['inco-dark'] }}>{level.name.split('(')[0].trim()}</span>
                  <span className="text-xs italic" style={{ color: colors['inco-blue'] }}>({level.name.split('(')[1].replace(')', '').trim()})</span>
                  <p className="text-xs mt-1" style={{ color: colors['inco-dark'], opacity: 0.8 }}>{level.description}</p>
                </div>
                
                {/* Data Columns */}
                <DataCell
                  state={level.sender.state}
                  value={submittedData.sender}
                  label={level.sender.label}
                  delay={index * 0.15 + 0.5}
                />
                <DataCell
                  state={level.receiver.state}
                  value={submittedData.receiver}
                  label={level.receiver.label}
                  delay={index * 0.15 + 0.6}
                />
                <DataCell
                  state={level.amount.state}
                  value={submittedData.amount}
                  label={level.amount.label}
                  delay={index * 0.15 + 0.7}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Signature */}
      <motion.footer
        className="relative z-10 mt-12 pb-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-xs md:text-sm" style={{ color: colors['inco-light-blue'], opacity: 0.7 }}>
          made by{' '}
          <a 
            href="https://t.me/sapiensp" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline hover:opacity-80 transition-opacity"
            style={{ color: colors['inco-light-blue'] }}
          >
            sapiensp
          </a>
        </p>
      </motion.footer>
    </div>
  );
}

// Helper component for styled input
const InputGroup = ({ label, name, value, onChange, placeholder, error }) => {
  const borderColor = error ? '#EF4444' : colors['inco-blue'];
  const focusBorderColor = error ? '#EF4444' : colors['inco-light-blue'];
  
  return (
    <div className="flex flex-col space-y-1">
      <label htmlFor={name} className="text-sm font-medium" style={{ color: colors['inco-dark'] }}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        value={value}
        onChange={onChange}
        className="p-3 rounded-lg focus:ring-2 outline-none transition-all border-2"
        style={{ 
          color: colors['inco-dark'],
          backgroundColor: '#FFFFFF',
          borderColor: borderColor,
          focusRingColor: focusBorderColor,
          focusBorderColor: focusBorderColor
        }}
        placeholder={placeholder || `Enter ${label}`}
        onFocus={(e) => {
          e.target.style.borderColor = focusBorderColor;
          e.target.style.boxShadow = `0 0 0 2px ${focusBorderColor}40`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = borderColor;
          e.target.style.boxShadow = 'none';
        }}
      />
      {error && (
        <span className="text-xs mt-1" style={{ color: '#EF4444' }}>
          {error}
        </span>
      )}
    </div>
  );
};

