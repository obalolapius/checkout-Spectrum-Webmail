import React, { useState } from 'react';
import { CreditCard, Lock, Check } from 'lucide-react';

interface FormData {
  email: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  cardholderName: string;
  country: string;
  postalCode: string;
}

const StripeCheckout: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardholderName: '',
    country: 'US',
    postalCode: ''
  });

  const [focusedField, setFocusedField] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      // Format card number with spaces
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) return;
    } else if (field === 'expiryDate') {
      // Format expiry date MM/YY
      formattedValue = value.replace(/\D/g, '').replace(/^(\d{2})(\d{1,2})/, '$1/$2');
      if (formattedValue.length > 5) return;
    } else if (field === 'cvc') {
      // Only allow numbers for CVC
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 4) return;
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }));
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    alert('Payment processed successfully! (This is a demo)');
  };

  const getCardType = (number: string): string => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'visa';
    if (cleaned.startsWith('5') || cleaned.startsWith('2')) return 'mastercard';
    if (cleaned.startsWith('3')) return 'amex';
    return 'generic';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete your order</h1>
          <p className="text-gray-600">Enter your payment details below</p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium text-gray-900">Order total</span>
            <span className="text-2xl font-bold text-gray-900">$99.99</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Lock className="w-4 h-4 mr-2" />
            Secured by 256-bit SSL encryption
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField('')}
                className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ${
                  focusedField === 'email'
                    ? 'border-blue-500 ring-2 ring-blue-100 outline-none'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="your@email.com"
              />
            </div>

            {/* Card Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card information
              </label>
              
              {/* Card Number */}
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                  onFocus={() => setFocusedField('cardNumber')}
                  onBlur={() => setFocusedField('')}
                  className={`w-full px-4 py-3 border border-b-0 rounded-t-lg transition-all duration-200 ${
                    focusedField === 'cardNumber'
                      ? 'border-blue-500 ring-2 ring-blue-100 outline-none'
                      : 'border-gray-300'
                  }`}
                  placeholder="1234 1234 1234 1234"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className={`w-8 h-5 rounded border-2 flex items-center justify-center text-xs font-bold ${
                    getCardType(formData.cardNumber) === 'visa' ? 'bg-blue-600 text-white border-blue-600' :
                    getCardType(formData.cardNumber) === 'mastercard' ? 'bg-red-600 text-white border-red-600' :
                    'bg-gray-200 text-gray-600 border-gray-300'
                  }`}>
                    {getCardType(formData.cardNumber) === 'visa' ? 'V' :
                     getCardType(formData.cardNumber) === 'mastercard' ? 'MC' : '•••'}
                  </div>
                </div>
              </div>

              {/* Expiry and CVC */}
              <div className="flex">
                <input
                  type="text"
                  required
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  onFocus={() => setFocusedField('expiryDate')}
                  onBlur={() => setFocusedField('')}
                  className={`flex-1 px-4 py-3 border border-r-0 transition-all duration-200 ${
                    focusedField === 'expiryDate'
                      ? 'border-blue-500 ring-2 ring-blue-100 outline-none'
                      : 'border-gray-300'
                  }`}
                  placeholder="MM / YY"
                />
                <input
                  type="text"
                  required
                  value={formData.cvc}
                  onChange={(e) => handleInputChange('cvc', e.target.value)}
                  onFocus={() => setFocusedField('cvc')}
                  onBlur={() => setFocusedField('')}
                  className={`flex-1 px-4 py-3 border rounded-br-lg transition-all duration-200 ${
                    focusedField === 'cvc'
                      ? 'border-blue-500 ring-2 ring-blue-100 outline-none'
                      : 'border-gray-300'
                  }`}
                  placeholder="CVC"
                />
              </div>
            </div>

            {/* Cardholder Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder name
              </label>
              <input
                type="text"
                required
                value={formData.cardholderName}
                onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                onFocus={() => setFocusedField('cardholderName')}
                onBlur={() => setFocusedField('')}
                className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ${
                  focusedField === 'cardholderName'
                    ? 'border-blue-500 ring-2 ring-blue-100 outline-none'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="Full name on card"
              />
            </div>

            {/* Country and Postal Code */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  onFocus={() => setFocusedField('country')}
                  onBlur={() => setFocusedField('')}
                  className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ${
                    focusedField === 'country'
                      ? 'border-blue-500 ring-2 ring-blue-100 outline-none'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal code
                </label>
                <input
                  type="text"
                  required
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  onFocus={() => setFocusedField('postalCode')}
                  onBlur={() => setFocusedField('')}
                  className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 ${
                    focusedField === 'postalCode'
                      ? 'border-blue-500 ring-2 ring-blue-100 outline-none'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="12345"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isProcessing}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                isProcessing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:transform active:scale-[0.98]'
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Lock className="w-5 h-5 mr-2" />
                  Pay $99.99
                </div>
              )}
            </button>

            {/* Security Notice */}
            <div className="flex items-start space-x-3 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-700 mb-1">Your payment information is secure</p>
                <p>We use industry-standard encryption to protect your card details. Your information is never stored on our servers.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Powered by Stripe • <span className="text-blue-600 hover:underline cursor-pointer">Terms</span> • <span className="text-blue-600 hover:underline cursor-pointer">Privacy</span></p>
        </div>
      </div>
    </div>
  );
};

export default StripeCheckout;