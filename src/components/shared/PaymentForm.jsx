import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import { CreditCard, Calendar, Lock } from '@mui/icons-material';

export default function PaymentForm() {
  const [card, setCard] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [paid, setPaid] = useState(false);
  const [focused, setFocused] = useState('');
  const [errors, setErrors] = useState({});

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Format expiry date
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  // Handle card input change
  const handleCardChange = (e) => {
    const value = e.target.value;
    const formatted = formatCardNumber(value);
    setCard(formatted);
  };

  // Handle expiry input change
  const handleExpiryChange = (e) => {
    const value = e.target.value;
    const formatted = formatExpiry(value);
    setExpiry(formatted);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Cardholder name is required';
    }
    
    if (card.replace(/\s/g, '').length !== 16) {
      newErrors.card = 'Card number must be 16 digits';
    }
    
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
      newErrors.expiry = 'Invalid expiry date';
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
      setPaid(true);
    }
  };

  // Get card type
  const getCardType = () => {
    const number = card.replace(/\s/g, '');
    if (number.startsWith('4')) return 'visa';
    if (number.startsWith('5')) return 'mastercard';
    if (number.startsWith('3')) return 'amex';
    return 'default';
  };

  if (paid) {
    return (
      <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Payment Successful!</h3>
        <p className="text-gray-600 mb-4">Your payment has been processed successfully.</p>
        <Button onClick={() => setPaid(false)}>Make Another Payment</Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <form className="bg-white rounded-xl shadow-lg overflow-hidden" onSubmit={handlePay}>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Payment Details</h3>
          <p className="text-gray-600 text-sm mb-6">Enter your card information to complete the payment</p>
          
          {/* Card Preview */}
          <div className={`mb-6 p-4 rounded-xl bg-gradient-to-r ${getCardType() === 'visa' ? 'from-blue-600 to-blue-800' : getCardType() === 'mastercard' ? 'from-red-600 to-red-800' : 'from-gray-700 to-gray-900'} text-white relative overflow-hidden transition-all duration-300 ${focused ? 'ring-2 ring-yellow-400' : ''}`}>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs opacity-80 mb-1">Card Number</div>
                <div className="font-mono tracking-wider">
                  {card ? card.replace(/\d(?=\d{4})/g, '•') : '•••• •••• •••• ••••'}
                </div>
              </div>
              <div className="text-2xl">
                {getCardType() === 'visa' && 'VISA'}
                {getCardType() === 'mastercard' && 'MC'}
                {getCardType() === 'amex' && 'AMEX'}
                {getCardType() === 'default' && 'CARD'}
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <div>
                <div className="text-xs opacity-80 mb-1">Cardholder Name</div>
                <div className="font-medium">{name || 'YOUR NAME'}</div>
              </div>
              <div>
                <div className="text-xs opacity-80 mb-1">Expires</div>
                <div className="font-medium">{expiry || 'MM/YY'}</div>
              </div>
            </div>
            <div className="absolute bottom-2 right-2 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <CreditCard className="text-white" />
            </div>
          </div>
          
          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  className={`border ${errors.name ? 'border-red-500' : 'border-gray-300'} p-3 pl-10 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors`}
                  placeholder="John Doe"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused('')}
                  required
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  className={`border ${errors.card ? 'border-red-500' : 'border-gray-300'} p-3 pl-10 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors font-mono`}
                  placeholder="1234 5678 9012 3456"
                  value={card}
                  onChange={handleCardChange}
                  onFocus={() => setFocused('card')}
                  onBlur={() => setFocused('')}
                  maxLength={19}
                  required
                />
              </div>
              {errors.card && <p className="mt-1 text-sm text-red-500">{errors.card}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    className={`border ${errors.expiry ? 'border-red-500' : 'border-gray-300'} p-3 pl-10 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors`}
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={handleExpiryChange}
                    onFocus={() => setFocused('expiry')}
                    onBlur={() => setFocused('')}
                    maxLength={5}
                    required
                  />
                </div>
                {errors.expiry && <p className="mt-1 text-sm text-red-500">{errors.expiry}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    className={`border ${errors.cvv ? 'border-red-500' : 'border-gray-300'} p-3 pl-10 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors`}
                    placeholder="123"
                    value={cvv}
                    onChange={e => setCvv(e.target.value.replace(/[^0-9]/g, '').slice(0, 3))}
                    onFocus={() => setFocused('cvv')}
                    onBlur={() => setFocused('')}
                    maxLength={3}
                    required
                  />
                </div>
                {errors.cvv && <p className="mt-1 text-sm text-red-500">{errors.cvv}</p>}
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Button type="submit" className="w-full py-3">
              Pay Now
            </Button>
          </div>
          
          <div className="mt-4 text-center text-xs text-gray-500">
            <p>Your payment information is encrypted and secure</p>
          </div>
        </div>
      </form>
    </div>
  );
}