import React, { useState } from 'react';
import Button from '../common/Button';
import StarRating from '../common/StarRating';

export default function FeedbackForm() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Thank you for your feedback!</h3>
        <p className="text-gray-600">We appreciate your input and will use it to improve our service.</p>
      </div>
    );
  }

  return (
    <form className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100" onSubmit={handleSubmit}>
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-1">Rate your experience</h3>
        <p className="text-gray-500 text-sm">Your feedback helps us improve our service</p>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-center mb-3">
          <StarRating rating={rating} />
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Poor</span>
          <span>Excellent</span>
        </div>
        <input
          type="range"
          min="1"
          max="5"
          value={rating}
          onChange={e => setRating(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
        />
        <div className="flex justify-center mt-2">
          <span className="text-sm font-medium text-gray-700">Your rating: {rating}/5</span>
        </div>
      </div>
      
      <div className="mb-6">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Additional comments
        </label>
        <textarea
          id="comment"
          className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-yellow-300 focus:border-yellow-400 transition-all duration-200"
          rows={4}
          placeholder="Tell us about your experience..."
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
      </div>
      
      <div className="flex justify-center">
        <Button type="submit" className="px-6 py-3">
          Submit Feedback
        </Button>
      </div>
    </form>
  );
}