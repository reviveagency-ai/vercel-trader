const IB = require('ib');

const ib = new IB({ host: '127.0.0.1', port: 7496, clientId: 2345 });

ib.on('connected', () => {
  console.log('✅ Connected. Submitting WHAT-IF (no execution)…');

  const contract = { symbol: 'AAPL', secType: 'STK', exchange: 'SMART', currency: 'USD' };

  // two safeties:
  //  - whatIf: true  → IB simulates margin/commission
  //  - transmit: false → TWS will NOT send to market
  const order = {
    action: 'BUY',
    orderType: 'MKT',
    totalQuantity: 1,
    tif: 'DAY',
    whatIf: true,
    transmit: false
  };

  // use any integer as orderId
  ib.placeOrder(1001, contract, order);
});

ib.on('openOrder', (orderId, contract, order, state) => {
  console.log('📊 What-If state:', {
    status: state.status,
    initMargin: state.initMarginChange,
    maintMargin: state.maintMarginChange,
    equityWithLoan: state.equityWithLoanChange,
    commission: state.commission
  });
});

ib.on('error', err => console.error('Error:', err));
ib.connect();
