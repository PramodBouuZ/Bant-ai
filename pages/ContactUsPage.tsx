import React, { useState } from 'react';

const ContactUsPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setFormMessage(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In a real application, you would send formData to your backend here
    console.log('Contact form submitted:', formData);

    const success = Math.random() > 0.1; // Simulate 90% success rate

    if (success) {
      setStatus('success');
      setFormMessage('Thank you for your message! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
    } else {
      setStatus('error');
      setFormMessage('Failed to send message. Please try again later.');
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Contact Us</h1>
      <p className="text-lg text-gray-700 text-center mb-8">
        Have questions, feedback, or need support? Reach out to us!
      </p>

      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-xl p-8 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              aria-label="Your Name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              aria-label="Your Email"
            />
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Subject of your message"
              value={formData.subject}
              onChange={handleChange}
              required
              aria-label="Subject of your message"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your message..."
              value={formData.message}
              onChange={handleChange}
              required
              aria-label="Your message"
            ></textarea>
          </div>
          {formMessage && (
            <p className={`text-center text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`} role="status">
              {formMessage}
            </p>
          )}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={status === 'submitting'}
            aria-live="polite"
          >
            {status === 'submitting' ? 'Sending...' : 'Send Message'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">You can also email us directly:</p>
          <a href="mailto:support@bantconfirm.com" className="text-blue-600 hover:underline font-medium">
            support@bantconfirm.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;