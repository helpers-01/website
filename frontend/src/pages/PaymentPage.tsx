import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import axios from 'axios';

const PaymentPage: React.FC = () => {
  const { bookingId } = useParams();
  const [amount, setAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const paypalClientId = 'YOUR_PAYPAL_CLIENT_ID';
  const upiLinkBase = 'https://your-upi-gateway.com/pay?amount=';

  useEffect(() => {
    const fetchAmount = async () => {
      try {
        const res = await axios.get(`/api/booking/${bookingId}/price`);
        setAmount(res.data.amount);
      } catch (error) {
        console.error('Failed to fetch amount:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAmount();
  }, [bookingId]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!amount) return <p className="text-center mt-10 text-red-500">Amount not found</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Pay ₹{amount}</h1>

        {/* PayPal */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Pay with PayPal</h2>
          <PayPalScriptProvider options={{ "client-id": paypalClientId }}>
            <PayPalButtons
              style={{ layout: 'vertical' }}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [{
                    amount: { value: amount.toString() }
                  }]
                });
              }}
              onApprove={(data, actions) => {
                return actions.order.capture().then(details => {
                  alert(`Payment completed by ${details.payer.name.given_name}`);
                  // Update backend with payment success
                });
              }}
            />
          </PayPalScriptProvider>
        </div>

        {/* UPI */}
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-3">Pay via UPI/Netbanking</h2>
          <a
            href={`${upiLinkBase}${amount}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300"
          >
            Pay Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;