console.log('NOWPAYMENTS_API_KEY:', process.env.NOWPAYMENTS_API_KEY ? 'SET' : 'NOT SET');
console.log('NOWPAYMENTS_IPN_SECRET:', process.env.NOWPAYMENTS_IPN_SECRET ? 'SET' : 'NOT SET');
console.log('All env vars with NOWPAYMENTS:', Object.keys(process.env).filter(k => k.includes('NOWPAYMENTS')));
