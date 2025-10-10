import React, { useState } from 'react';
import { CreditCard, CalendarDays, LockKeyhole, CheckCircle, User } from 'lucide-react';

// --- Custom Button Component (for single-file app requirement) ---
const Button = ({ children, className = '', ...props }) => (
  <button
    {...props}
    className={`bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-6 rounded-xl shadow-lg transition duration-200 ease-in-out transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);

// --- Main Payment Form Component (renamed to App) ---
export default function App() {
  const [card, setCard] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [paid, setPaid] = useState(false);
  const [focused, setFocused] = useState('');
  const [errors, setErrors] = useState({});

  // Format card number with spaces (4-4-4-4 pattern)
  const formatCardNumber = (value) => {
    // Remove all non-digit characters
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{1,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.join(' ');
  };

  // Format expiry date (MM/YY pattern)
  const formatExpiry = (value) => {
    // Remove all non-digit characters
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length > 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  // Handle card input change and formatting
  const handleCardChange = (e) => {
    const value = e.target.value;
    const formatted = formatCardNumber(value);
    setCard(formatted);
  };

  // Handle expiry input change and formatting
  const handleExpiryChange = (e) => {
    const value = e.target.value;
    const formatted = formatExpiry(value);
    setExpiry(formatted);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    const currentYear = new Date().getFullYear() % 100;

    if (!name.trim()) {
      newErrors.name = 'Cardholder name is required';
    }

    if (card.replace(/\s/g, '').length !== 16) {
      newErrors.card = 'Card number must be 16 digits';
    }

    const expiryRegex = /^(0[1-9]|1[0-2])\/(\d{2})$/;
    if (!expiryRegex.test(expiry)) {
      newErrors.expiry = 'Invalid expiry date (MM/YY)';
    } else {
      const [monthStr, yearStr] = expiry.split('/');
      const month = parseInt(monthStr, 10);
      const year = parseInt(yearStr, 10);

      if (year < currentYear || (year === currentYear && month < (new Date().getMonth() + 1))) {
        newErrors.expiry = 'Card is expired';
      }
    }

    if (cvv.length !== 3) {
      newErrors.cvv = 'CVV must be 3 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePay = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Simulate API call delay
      setTimeout(() => {
        setPaid(true);
      }, 500);
    }
  };

  // Get card type for visual feedback
  const getCardType = () => {
    const number = card.replace(/\s/g, '');
    if (number.startsWith('4')) return 'visa';
    if (number.startsWith('5')) return 'mastercard';
    if (number.startsWith('3')) return 'amex';
    return 'default';
  };
  
  // Dynamic Card Styling
  const cardStyles = {
    visa: 'from-blue-600 to-blue-800',
    mastercard: 'from-red-600 to-orange-500',
    amex: 'from-green-600 to-green-800',
    default: 'from-gray-700 to-gray-900',
  };

  if (paid) {
    return (
      <div className="max-w-sm mx-auto p-10 bg-white rounded-2xl shadow-2xl text-center border-t-8 border-green-500 animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        <h3 className="text-2xl font-extrabold text-gray-800 mb-2">Payment Successful!</h3>
        <p className="text-gray-600 mb-6">Your transaction was processed securely. Thank you for your purchase.</p>
        <Button onClick={() => setPaid(false)} className="bg-blue-500 hover:bg-blue-600 text-white">
          Start New Payment
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4 font-sans">
      <div className="w-full max-w-lg mx-auto">
        <form className="bg-white rounded-2xl shadow-xl overflow-hidden" onSubmit={handlePay}>
          <div className="p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Checkout</h3>
            <p className="text-gray-500 text-sm mb-8">Secure payment powered by Gemini.</p>

            {/* Card Preview */}
            <div 
              className={`mb-8 p-6 rounded-xl shadow-2xl bg-gradient-to-r ${cardStyles[getCardType()]} text-white relative overflow-hidden transition-all duration-300 ${focused === 'card' || focused === 'expiry' || focused === 'cvv' || focused === 'name' ? 'ring-4 ring-yellow-400/70 scale-[1.01]' : 'shadow-lg'}`}
              style={{ minHeight: '150px' }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full transform translate-x-12 -translate-y-12"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full transform -translate-x-1/3 translate-y-1/3"></div>

              <div className="flex justify-end mb-8 relative z-10">
                <div className="text-3xl font-extrabold tracking-wider">
                  {getCardType() === 'visa' && 'VISA'}
                  {getCardType() === 'mastercard' && 'MC'}
                  {getCardType() === 'amex' && 'AMEX'}
                  {getCardType() === 'default' && 'GEMINI'}
                </div>
              </div>

              <div className="text-xl font-mono tracking-widest mb-4 relative z-10">
                {/* Mask card number, showing last 4 digits */}
                {card ? card.replace(/\d(?=\d{4})/g, '•') : '•••• •••• •••• ••••'}
              </div>

              <div className="flex justify-between items-end relative z-10">
                <div>
                  <div className="text-xs opacity-70 mb-1 font-light">Cardholder Name</div>
                  <div className="font-medium tracking-wide text-sm uppercase transition-colors duration-200">
                    {name || 'YOUR NAME'}
                  </div>
                </div>
                <div>
                  <div className="text-xs opacity-70 mb-1 font-light">Expires</div>
                  <div className="font-medium tracking-wide text-sm transition-colors duration-200">
                    {expiry || 'MM/YY'}
                  </div>
                </div>
              </div>
              <div className="absolute bottom-4 right-4 text-white/50">
                <CreditCard className="w-10 h-10"/>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
              
              {/* Cardholder Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Cardholder Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    className={`border ${errors.name ? 'border-red-500' : 'border-gray-300'} p-3 pl-10 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors placeholder:text-gray-400`}
                    placeholder="Jane Doe"
                    value={name}
                    onChange={e => setName(e.target.value.toUpperCase())}
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused('')}
                    required
                  />
                </div>
                {errors.name && <p className="mt-1 text-xs text-red-500 font-medium">{errors.name}</p>}
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Card Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    className={`border ${errors.card ? 'border-red-500' : 'border-gray-300'} p-3 pl-10 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors font-mono placeholder:text-gray-400`}
                    placeholder="1234 5678 9012 3456"
                    value={card}
                    onChange={handleCardChange}
                    onFocus={() => setFocused('card')}
                    onBlur={() => setFocused('')}
                    maxLength={19}
                    inputMode="numeric"
                    required
                  />
                </div>
                {errors.card && <p className="mt-1 text-xs text-red-500 font-medium">{errors.card}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Expiry Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Expiry Date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CalendarDays className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      className={`border ${errors.expiry ? 'border-red-500' : 'border-gray-300'} p-3 pl-10 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors placeholder:text-gray-400`}
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={handleExpiryChange}
                      onFocus={() => setFocused('expiry')}
                      onBlur={() => setFocused('')}
                      maxLength={5}
                      inputMode="numeric"
                      required
                    />
                  </div>
                  {errors.expiry && <p className="mt-1 text-xs text-red-500 font-medium">{errors.expiry}</p>}
                </div>

                {/* CVV */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">CVV</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockKeyhole className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      className={`border ${errors.cvv ? 'border-red-500' : 'border-gray-300'} p-3 pl-10 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors placeholder:text-gray-400`}
                      placeholder="123"
                      value={cvv}
                      type="password"
                      onChange={e => setCvv(e.target.value.replace(/[^0-9]/g, '').slice(0, 3))}
                      onFocus={() => setFocused('cvv')}
                      onBlur={() => setFocused('')}
                      maxLength={3}
                      inputMode="numeric"
                      required
                    />
                  </div>
                  {errors.cvv && <p className="mt-1 text-xs text-red-500 font-medium">{errors.cvv}</p>}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button type="submit" className="w-full py-3 text-lg">
                Confirm & Pay
              </Button>
            </div>

            <div className="mt-6 text-center text-xs text-gray-500 flex items-center justify-center">
              <LockKeyhole className="h-4 w-4 mr-1 text-green-500" />
              <p>Your payment information is end-to-end encrypted and secure</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
