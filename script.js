const transactionsEl = document.querySelector('.transactions');
const balanceNumberEl = document.querySelector('.balance-number');
const numberIncomeEl = document.querySelector('.number--income');
const numberExpensesEl = document.querySelector('.number--expenses');
const formEl = document.querySelector('.form');
const inputDescriptionEl = document.querySelector('.input--description');
const inputAmountEl = document.querySelector('.input--amount');
const inputBalanceEl = document.querySelector('.input--balance');
const setBalanceBtn = document.getElementById('set-balance-btn');

let fixedIncome = 0;     
let totalExtraIncome = 0; 
let totalExpenses = 0;    

//  Format number as ₦ with commas
function formatNaira(amount) {
  return `₦${amount.toLocaleString('en-NG')}`;
}

//  Set starting balance (fixed income)
setBalanceBtn.addEventListener('click', () => {
  const startBalance = Number(inputBalanceEl.value);
  if (!Number.isFinite(startBalance) || startBalance <= 0) return;

  fixedIncome = startBalance;
  totalExtraIncome = 0;
  totalExpenses = 0;

  // Reset UI
  numberIncomeEl.textContent = formatNaira(fixedIncome);
  numberExpensesEl.textContent = formatNaira(0);
  balanceNumberEl.textContent = formatNaira(fixedIncome);
  balanceNumberEl.style.color = fixedIncome < 0 ? 'red' : 'black';
  transactionsEl.innerHTML = '';

  // Clear & lock input
  inputBalanceEl.value = '';
  inputBalanceEl.disabled = true;
  setBalanceBtn.disabled = true;
});

//  Add transaction (positive = top-up, negative = expense)
formEl.addEventListener('submit', (e) => {
  e.preventDefault();

  const desc = inputDescriptionEl.value.trim();
  const rawAmount = Number(inputAmountEl.value);

  if (!desc || !Number.isFinite(rawAmount) || rawAmount === 0) return;

  // Create transaction item
  const li = `
    <li class="transaction transaction--${rawAmount > 0 ? 'income' : 'expense'}">
      <span class="transaction__text">${desc}</span>
      <span class="transaction__amount">${rawAmount > 0 ? '+' : '-'}${formatNaira(Math.abs(rawAmount))}</span>
      <button class="transaction__btn">X</button>
    </li>
  `;
  transactionsEl.insertAdjacentHTML('beforeend', li);

  // Update totals
  if (rawAmount > 0) {
    totalExtraIncome += rawAmount;
  } else {
    totalExpenses += Math.abs(rawAmount);
  }

  // Refresh UI
  numberIncomeEl.textContent = formatNaira(fixedIncome);
  numberExpensesEl.textContent = formatNaira(totalExpenses);

  const newBalance = fixedIncome + totalExtraIncome - totalExpenses;
  balanceNumberEl.textContent = formatNaira(newBalance);
  balanceNumberEl.style.color = newBalance < 0 ? 'red' : 'black';

  // Clear inputs
  inputDescriptionEl.value = '';
  inputAmountEl.value = '';
});

//  Delete transaction (reverse its effect)
transactionsEl.addEventListener('click', (e) => {
  if (!e.target.classList.contains('transaction__btn')) return;

  const li = e.target.closest('.transaction');
  if (!li) return;

  const amountText = li.querySelector('.transaction__amount')?.textContent || '';
  const amt = Number(amountText.replace(/[₦,+-]/g, '').replace(/,/g, ''));

  if (amountText.trim().startsWith('+')) {
    totalExtraIncome -= amt;
  } else {
    totalExpenses -= amt;
  }

  // Refresh UI
  numberIncomeEl.textContent = formatNaira(fixedIncome);
  numberExpensesEl.textContent = formatNaira(totalExpenses);

  const newBalance = fixedIncome + totalExtraIncome - totalExpenses;
  balanceNumberEl.textContent = formatNaira(newBalance);
  balanceNumberEl.style.color = newBalance < 0 ? 'red' : 'black';

  li.remove();
});
