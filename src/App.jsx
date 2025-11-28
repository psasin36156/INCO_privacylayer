import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImage from './asset/images/logo.png';
import nerdImage from './asset/images/nerd.png';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Lock, Unlock, Eye, EyeOff, Zap } from 'lucide-react';

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
    name: "1. Transparency (Current Blockchain)",
    sender: { state: "VISIBLE", label: "Public Address" },
    receiver: { state: "VISIBLE", label: "Public Address" },
    amount: { state: "VISIBLE", label: "Public Amount" },
    color: `border-[${colors['inco-dark']}]/70`,
    bgClass: `bg-[${colors['inco-dark']}]/10`, 
    description: "All transaction details are fully visible to anyone.",
  },
  {
    id: 2,
    name: "2. Anonymity (Mixers / Obfuscated Identity)",
    sender: { state: "OBFUSCATED", label: "👤 Transaction Hash" },
    receiver: { state: "OBFUSCATED", label: "👤 Transaction Hash" },
    amount: { state: "VISIBLE", label: "Public Amount" },
    color: `border-[${colors['inco-light-blue']}]/70`,
    bgClass: `bg-[${colors['inco-light-blue']}]/10`,
    description: "Identity is obscured, but the value is still public.",
  },
  {
    id: 3,
    name: "3. Confidentiality (Inco Layer / cERC-20)",
    sender: { state: "VISIBLE", label: "Public Address" },
    receiver: { state: "VISIBLE", label: "Public Address" },
    amount: { state: "ENCRYPTED", label: "🔒 Confidential Value" },
    color: `border-[${colors['inco-blue']}]/70`,
    bgClass: `bg-[${colors['inco-blue']}]/10`,
    description: "Parties are known for compliance; only the financial amount is hidden.",
  },
  {
    id: 4,
    name: "4. Total privacy (Maximum Secrecy)",
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
  let icon;
  let baseClass = "p-4 font-mono text-sm sm:text-base transition-all duration-300 rounded-lg h-full flex items-center justify-center text-center border-2 relative overflow-hidden backdrop-blur-md";
  let cellStyle = {};

  switch (state) {
    case 'VISIBLE':
      const displayValue = formatAddress(value);
      const isLongAddress = value && value.length > 20;
      icon = <Eye className="w-4 h-4 mr-2 flex-shrink-0" style={{ color: colors['inco-blue'] }} />;
      content = (
        <div className="flex items-center justify-center gap-2">
          {icon}
          <span 
            className="font-semibold break-all"
            style={{ color: '#FFFFFF' }}
            title={isLongAddress ? value : undefined}
          >
            {displayValue}
          </span>
        </div>
      );
      cellStyle = {
        backgroundColor: `rgba(27, 62, 134, 0.5)`, // Darker, more opaque
        borderColor: colors['inco-blue']
      };
      break;
    case 'OBFUSCATED':
      icon = <EyeOff className="w-4 h-4 mr-2 flex-shrink-0" style={{ color: colors['inco-light-blue'] }} />;
      content = (
        <div className="flex items-center justify-center gap-2">
          {icon}
          <span style={{ color: '#FFFFFF' }} className="font-semibold">{label}</span>
        </div>
      );
      cellStyle = {
        backgroundColor: `rgba(54, 115, 245, 0.35)`, // More opaque
        borderColor: colors['inco-light-blue']
      };
      baseClass += ' text-sm';
      break;
    case 'ENCRYPTED':
      icon = <Lock className="w-4 h-4 mr-2 flex-shrink-0 animate-pulse" style={{ color: colors['inco-light-blue'] }} />;
      content = (
        <div className="flex items-center justify-center gap-2">
          {icon}
          <span style={{ color: '#FFFFFF' }} className="font-bold">{label}</span>
        </div>
      );
      cellStyle = {
        backgroundColor: `rgba(54, 115, 245, 0.5)`, // More opaque with stronger color
        borderColor: colors['inco-light-blue'],
        borderStyle: 'dashed'
      };
      baseClass += ' text-sm shadow-neon';
      break;
      default:
      content = <span style={{ color: '#FFFFFF' }}>N/A</span>;
      cellStyle = {
        backgroundColor: `rgba(27, 62, 134, 0.4)`,
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
        minWidth: 0,
        overflow: 'hidden',
        wordBreak: 'break-all'
      }}
    >
      {/* Corner decorations for futuristic look */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: colors['inco-light-blue'], opacity: 0.6 }}></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: colors['inco-light-blue'], opacity: 0.6 }}></div>
      
      {/* Animated scan line for encrypted states */}
      {state === 'ENCRYPTED' && (
        <motion.div
          className="absolute inset-x-0 h-px"
          style={{ 
            background: `linear-gradient(to right, transparent, ${colors['inco-light-blue']}, transparent)`,
            boxShadow: `0 0 10px ${colors['inco-light-blue']}`
          }}
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      )}
      
      <div className="w-full overflow-hidden text-ellipsis relative z-10">
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
      opacity: 0.25 + random(6) * 0.2,
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
      
      {/* Futuristic grid background */}
      <div className="absolute inset-0 z-0 opacity-20" style={{
        backgroundImage: `
          linear-gradient(${colors['inco-blue']}40 1px, transparent 1px),
          linear-gradient(90deg, ${colors['inco-blue']}40 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
      }}></div>

      {/* Scanning line effect */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30 animate-scan"
          style={{ boxShadow: `0 0 20px ${colors['inco-blue']}` }}
        ></div>
      </div>

      {/* Background decoration with nerd image flooding effect */}
      <div 
        className="absolute inset-0 z-0 overflow-hidden"
        style={{
          opacity: 0.25
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

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-light/20 rounded-full blur-3xl animate-pulse delay-1000 z-0"></div>


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
            className="mb-6 flex justify-center items-center relative"
        >
            {/* Glowing ring around logo */}
            <div className="absolute w-32 h-32 border-2 border-primary/30 rounded-full animate-ping"></div>
            <div className="absolute w-28 h-28 border-2 border-primary/50 rounded-full animate-pulse"></div>
            
            {/* Inco Logo Integration */}
            <motion.img 
                src={logoImage} 
                alt="Inco Logo" 
                className="h-20 w-auto object-contain relative z-10 drop-shadow-2xl"
                style={{ 
                  maxWidth: '200px',
                  filter: `drop-shadow(0 0 20px ${colors['inco-blue']}80)`
                }}
                animate={{
                  filter: [
                    `drop-shadow(0 0 20px ${colors['inco-blue']}80)`,
                    `drop-shadow(0 0 30px ${colors['inco-blue']}ff)`,
                    `drop-shadow(0 0 20px ${colors['inco-blue']}80)`,
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
            /> 
        </motion.div>
        <div className="relative">
          {/* Cyber brackets */}
          <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-primary text-2xl font-bold opacity-50 hidden md:block">[</div>
          <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-primary text-2xl font-bold opacity-50 hidden md:block">]</div>
          
          <h1 
              className={`text-4xl sm:text-5xl md:text-6xl font-black tracking-tight`}
              style={{ 
                  color: colors['inco-bg-light'],
                  fontFamily: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  textShadow: `0 0 20px ${colors['inco-blue']}80, 0 2px 4px rgba(0,0,0,0.3)`
              }}
          >
            Inco Privacy Level Playground
          </h1>
        </div>
        <motion.p 
          className="mt-4 text-lg flex items-center justify-center gap-2" 
          style={{ color: colors['inco-light-blue'] }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Lock className="w-5 h-5 animate-pulse" />
          Visualize Inco's Four Levels of Confidentiality
          <Lock className="w-5 h-5 animate-pulse" />
        </motion.p>
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
          className="mb-4 px-4 py-3 rounded-lg border-l-4 backdrop-blur-xl relative overflow-hidden"
          style={{
            backgroundColor: `${colors['inco-bg-light']}20`,
            borderLeftColor: colors['inco-light-blue'],
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-primary/10 to-transparent"></div>
          <p className="text-xs md:text-sm flex items-center gap-2" style={{ color: colors['inco-bg-light'] }}>
            <Zap className="w-4 h-4 text-primary animate-pulse" />
            <span className="font-medium">Simulation Mode:</span> Input sender and receiver details to compare blockchain transparency levels vs. Inco's confidential encryption.
          </p>
        </motion.div>

      <Card className="relative overflow-hidden">
        {/* Animated border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 animate-pulse pointer-events-none"></div>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputGroup
                label="Sender Address"
                name="sender"
                value={inputs.sender}
                onChange={handleInputChange}
                placeholder="0x742d35Cc..."
                error={errors.sender}
              />
              <InputGroup
                label="Receiver Address"
                name="receiver"
                value={inputs.receiver}
                onChange={handleInputChange}
                placeholder="0x8ba1f109..."
                error={errors.receiver}
              />
              <InputGroup
                label="Transaction Amount"
                name="amount"
                value={inputs.amount}
                onChange={handleInputChange}
                placeholder="100.5 USDC"
                error={errors.amount}
              />
            </div>
            
            <div className='flex justify-center pt-4 gap-4 flex-wrap'>
                <Button
                    type="submit"
                    size="lg"
                    disabled={isDemoActive}
                    className="relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    {submittedData ? "Re-Run Simulation" : "Run Simulation"}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-light/0 via-primary-light/50 to-primary-light/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </Button>
                {submittedData && (
                    <Button
                        type="button"
                        onClick={resetDemo}
                        variant="outline"
                        size="lg"
                        className="gap-2"
                    >
                        <Eye className="w-4 h-4" />
                        Reset
                    </Button>
                )}
            </div>
          </form>
        </CardContent>
      </Card>
      </motion.div>

      {/* Output Table */}
      <AnimatePresence mode="wait">
        {submittedData && (
          <motion.div
            key="results"
            className="relative z-10 mt-12 max-w-7xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Futuristic Header */}
            <Card className="mb-6 border-primary/60 bg-card/80">
              <CardContent className="p-5">
                <div className={`grid grid-cols-4 gap-4 text-center text-sm font-bold tracking-wider uppercase`}
                    style={{ 
                      color: '#FFFFFF',
                      gridTemplateColumns: '2fr 1fr 1fr 1fr'
                    }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-8 animate-pulse" style={{ backgroundColor: colors['inco-blue'] }}></div>
                    <span style={{ color: colors['inco-light-blue'] }}>Privacy Level</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" style={{ color: colors['inco-light-blue'] }} />
                    <span style={{ color: '#FFFFFF' }}>Sender</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" style={{ color: colors['inco-light-blue'] }} />
                    <span style={{ color: '#FFFFFF' }}>Receiver</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4" style={{ color: colors['inco-light-blue'] }} />
                    <span style={{ color: '#FFFFFF' }}>Amount</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Level Cards */}
            {PRIVACY_LEVELS.map((level, index) => (
              <motion.div
                key={level.id}
                variants={itemVariants}
                className="mb-4"
              >
                <Card 
                  className={`relative overflow-hidden hover:scale-[1.01] transition-transform duration-300 border-primary/40 bg-card/70`}
                  style={{
                    borderLeftWidth: '6px',
                    borderLeftColor: level.id === 1 ? '#EF4444' : 
                                     level.id === 2 ? colors['inco-light-blue'] :
                                     level.id === 3 ? colors['inco-blue'] : colors['inco-blue'],
                  }}
                >
                  {/* Animated gradient overlay */}
                  <div 
                    className="absolute top-0 left-0 w-2 h-full opacity-50 pointer-events-none"
                    style={{
                      background: `linear-gradient(to bottom, ${colors['inco-blue']}00, ${colors['inco-blue']}ff, ${colors['inco-blue']}00)`,
                      animation: 'scan 3s linear infinite'
                    }}
                  ></div>
                  
                  <CardContent className="p-5">
                    <div className={`grid grid-cols-4 gap-4`}
                      style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr' }}
                    >
                      {/* Level Name Column */}
                      <div className="flex flex-col justify-center items-start space-y-2 pr-4">
                        <div className="flex items-center gap-3">
                          {level.id === 1 && <Unlock className="w-5 h-5 flex-shrink-0" style={{ color: '#EF4444' }} />}
                          {level.id === 2 && <EyeOff className="w-5 h-5 flex-shrink-0" style={{ color: colors['inco-light-blue'] }} />}
                          {level.id === 3 && <Lock className="w-5 h-5 flex-shrink-0" style={{ color: colors['inco-blue'] }} />}
                          {level.id === 4 && <Lock className="w-5 h-5 flex-shrink-0 animate-pulse" style={{ color: colors['inco-blue'] }} />}
                          <span className="font-bold text-lg" style={{ color: '#FFFFFF' }}>
                            {level.name.split('(')[0].trim()}
                          </span>
                        </div>
                        <span className="text-xs italic pl-8" style={{ color: colors['inco-light-blue'] }}>
                          ({level.name.split('(')[1]?.replace(')', '').trim() || ''})
                        </span>
                        <p className="text-xs mt-1 pl-8" style={{ color: colors['inco-light-blue'], opacity: 0.8 }}>
                          {level.description}
                        </p>
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
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Signature */}
      <motion.footer
        className="relative z-10 mt-16 pb-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="relative inline-block">
          {/* Decorative lines */}
          <div className="absolute left-0 right-0 top-1/2 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
          
          <div className="relative bg-background px-6 py-3 rounded-lg border border-primary/20 backdrop-blur-sm">
            <p className="text-xs md:text-sm flex items-center gap-2 justify-center" style={{ color: colors['inco-light-blue'] }}>
              <span className="opacity-50">{'<'}</span>
              made by{' '}
              <a 
                href="https://t.me/sapiensp" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold hover:text-primary transition-colors relative group"
                style={{ color: colors['inco-light-blue'] }}
              >
                sapiensp
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </a>
              <span className="opacity-50">{'/>'}</span>
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

// Helper component for styled input with futuristic design
const InputGroup = ({ label, name, value, onChange, placeholder, error }) => {
  return (
    <div className="flex flex-col space-y-2 group">
      <Label htmlFor={name} className="flex items-center gap-2">
        <Zap className="w-3 h-3 text-primary animate-pulse" />
        {label}
      </Label>
      <div className="relative">
        <Input
          id={name}
          name={name}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder || `Enter ${label}`}
          className={error ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {/* Futuristic corner accents */}
        <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-primary opacity-60"></div>
        <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-primary opacity-60"></div>
        <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-primary opacity-60"></div>
        <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-primary opacity-60"></div>
      </div>
      {error && (
        <motion.span 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-destructive flex items-center gap-1"
        >
          <EyeOff className="w-3 h-3" />
          {error}
        </motion.span>
      )}
    </div>
  );
};

