const Stripe = require('stripe');
require('dotenv').config();
exports.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
