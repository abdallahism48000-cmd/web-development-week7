const transactions = [
  { name: 'Whole Foods Market', category: 'Food', date: 'Nov 24, 2026', amount: -86.42, icon: 'WF', color: '#e8f1ec' },
  { name: 'Salary deposit', category: 'Salary', date: 'Nov 22, 2026', amount: 3200, icon: 'S', color: '#eaf0f7' },
  { name: 'Uber', category: 'Transport', date: 'Nov 21, 2026', amount: -24.80, icon: 'U', color: '#edf0f4' },
  { name: 'Apple Store', category: 'Shopping', date: 'Nov 20, 2026', amount: -129.00, icon: 'A', color: '#f2ece8' },
  { name: 'Netflix', category: 'Entertainment', date: 'Nov 18, 2026', amount: -15.49, icon: 'N', color: '#f4e9e8' }
];

const iconColors = { Food:'#e8f1ec', Salary:'#eaf0f7', Transport:'#edf0f4', Shopping:'#f2ece8', Entertainment:'#f4e9e8', Home:'#eeeafa' };

function money(value) {
  return `${value < 0 ? '-' : ''}$${Math.abs(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function renderTransactions(items, targetId) {
  const target = document.getElementById(targetId);
  target.innerHTML = items.map(item => `
    <div class="transaction-row">
      <div class="merchant-icon" style="background:${item.color}">${item.icon}</div>
      <div class="transaction-name"><strong>${item.name}</strong><small>${item.category}</small></div>
      <span class="transaction-category">${item.category}</span>
      <span class="transaction-date">${item.date}</span>
      <span class="transaction-amount ${item.amount >= 0 ? 'income' : 'expense'}">${money(item.amount)}</span>
    </div>`).join('');
}

renderTransactions(transactions.slice(0, 4), 'transaction-list');
renderTransactions(transactions, 'all-transactions');

const chartData = [
  [5.2,3.8],[6.1,4.2],[5.7,4.0],[7.0,5.1],[6.4,4.5],[7.2,5.4],[6.8,4.7],[7.6,5.6],[6.9,4.4],[7.4,5.2],[6.2,4.1],[6.8,4.8]
];
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const chart = document.getElementById('cash-chart');
chart.innerHTML = chartData.map((pair, i) => `
  <div class="month-bars" title="${months[i]}: income $${pair[0]}k, expenses $${pair[1]}k">
    <i style="height:${pair[0]/8*100}%"></i><i style="height:${pair[1]/8*100}%"></i><span class="month-name">${months[i]}</span>
  </div>`).join('');

const budgets = [
  ['Housing', 1450, 1600], ['Food', 620, 800], ['Transport', 390, 500], ['Shopping', 480, 650], ['Entertainment', 210, 300]
];
document.getElementById('budget-categories').innerHTML = budgets.map(([name, spent, limit]) => {
  const percent = Math.round(spent / limit * 100);
  return `<div class="budget-category"><strong>${name}</strong><div class="progress-track"><i style="width:${percent}%"></i></div><span>$${spent} / $${limit}</span></div>`;
}).join('');

const navItems = document.querySelectorAll('.nav-item[data-view]');
const views = ['dashboard','transactions','budgets'];
navItems.forEach(item => item.addEventListener('click', () => {
  navItems.forEach(nav => nav.classList.remove('active'));
  item.classList.add('active');
  views.forEach(view => document.getElementById(`${view}-view`).classList.toggle('hidden', view !== item.dataset.view));
  const titles = { dashboard:'Good morning, Alex', transactions:'Transactions', budgets:'Your budgets' };
  document.getElementById('page-title').textContent = titles[item.dataset.view];
}));

document.getElementById('view-all').addEventListener('click', () => document.querySelector('[data-view="transactions"]').click());

const modal = document.getElementById('transaction-modal');
document.getElementById('open-modal').addEventListener('click', () => modal.showModal());
document.getElementById('close-modal').addEventListener('click', () => modal.close());

const toast = document.getElementById('toast');
document.getElementById('transaction-form').addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('transaction-name').value.trim();
  const amount = Number(document.getElementById('transaction-amount').value);
  const type = document.getElementById('transaction-type').value;
  const category = document.getElementById('transaction-category').value;
  if (!name || !amount) return;

  transactions.unshift({
    name, category, date: 'Nov 25, 2026', amount: type === 'income' ? amount : -amount,
    icon: name.charAt(0).toUpperCase(), color: iconColors[category] || '#edf0f4'
  });
  renderTransactions(transactions.slice(0, 4), 'transaction-list');
  renderTransactions(transactions, 'all-transactions');
  event.target.reset();
  modal.close();
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2600);
});
