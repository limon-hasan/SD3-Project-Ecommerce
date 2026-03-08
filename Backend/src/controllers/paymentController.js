const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_fake_key_for_demo_purposes_only'); // Use fake key to bypass github scanning if env missing

// @desc    Create Payment Intent
// @route   POST /api/payment/create-intent
// @access  Private
const createPaymentIntent = async (req, res) => {
    const { amount } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createPaymentIntent };
