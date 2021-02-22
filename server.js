const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_M1L2yD2XVfjqVABGX2QlLpQD00rypjxoDi');
const app = express();
const fetch = require('node-fetch');

app.use(express.json());

app.use(cors({
  credentials: true,
}));

app.post('/checkCaptcha', (request, response) => {
  try {
    const {token} = request.body;
    const SECRET = '6Le6AtUUAAAAAHy3OuaL6CfGwveXKRkyulcEZ8R6';

    fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${SECRET}&response=${token}`, {
      method: 'POST',
    })
      .then(res => res.json())
      .then(res => {
        console.log(res);
        response.send(res);
      })
      .catch(er => {
        console.log(er);
      });
  } catch (e) {
    return response.send({error: e.message});
  }
});

app.post('/pay', (request, response) => {
  try {
    let intent = 'intend';
    const {payment_method_id, payment_intent_id} = request.body;

    if (payment_method_id) {
      intent = stripe.paymentIntents.create({
        payment_method: request.body.payment_method_id,
        amount: 1099,
        currency: 'usd',
        confirmation_method: 'manual',
        confirm: true
      });
    }

    if (payment_intent_id) {
      intent = stripe.paymentIntents.confirm(
        request.body.payment_intent_id
      );
    }

    intent
      .then(res => {
        response.send(generateResponse(res));
      })
      .catch(er => {
          response.send({error: er});
        }
      )
  } catch (e) {
    return response.send({error: e.message});
  }
});

const generateResponse = (intent) => {
  if (
    intent.status === 'requires_action' &&
    intent.next_action.type === 'use_stripe_sdk'
  ) {
    return {
      requires_action: true,
      payment_intent_client_secret: intent.client_secret
    };
  } else if (intent.status === 'succeeded') {
    return {
      success: true
    };
  } else {
    return {
      error: 'Invalid PaymentIntent status'
    }
  }
};

app.listen(4242, () => console.log(`Node server listening on port ${4242}!`));
