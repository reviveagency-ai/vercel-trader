const IB = require('ib');

const ib = new IB({
  host: '127.0.0.1',
  port: 7496,          // live port
  clientId: 2225
});

let nextOrderId = null;

function stock(symbol) {
  return { symbol, secType: 'STK', exchange: 'SMART', currency: 'USD' };
}
function whatIfBuy(qty = 1) {
  return {
    action: 'BUY',
    orderType: 'MKT',
    totalQuantity: qty,
    tif: 'DAY',
    whatIf: true,
    transmit: true      // required even for whatIf
  };
}
function placeWithNextId(contract, order) {
  const oid = nextOrderId++;
  ib.placeOrder(oid, contract, order);
  console.log(`➡️  Placed WHAT-IF with orderId ${oid} (${contract.symbol} ${order.action} ${order.totalQuantity})`);
}

ib.on('connected', () => {
  console.log('✅ Connected. Asking TWS for nextValidId…');
  ib.reqIds(1);                 // ask ONCE
});

// 🔒 handle the nextValidId ONLY ONCE
ib.once('nextValidId', (id) => {
  nextOrderId = id;
  console.log('🆔 nextValidId from TWS:', nextOrderId);

  // place exactly one what-if
  placeWithNextId(stock('AAPL'), whatIfBuy(1));

  // example to place another later (uses +1 automatically):
  // setTimeout(() => placeWithNextId(stock('MSFT'), whatIfBuy(2)), 1500);
});

ib.on('openOrder', (orderId, contract, order, state) => {
  if (order.whatIf) {
    console.log('📊 What-If result:', {
      orderId,
      status: state.status,
      initMargin: state.initMarginChange,
      maintMargin: state.maintMarginChange,
      equityWithLoan: state.equityWithLoanChange,
      commission: state.commission
    });
  }
});

ib.on('error', (err) => console.error('❌ Error:', err.message || err));
ib.on('disconnected', () => console.log('🔌 Disconnected'));

ib.connect();
setTimeout(() => { try { ib.disconnect(); } catch {} }, 10000);

