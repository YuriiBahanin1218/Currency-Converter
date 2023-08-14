const displayTime = () => {
  const timeContainer = document.getElementById('timeContainer');
  const now = new Date();
  const options = {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
    timeZoneName: 'short'
  };
  const formattedTime = now.toLocaleString('en-US', options);
  timeContainer.textContent = `${formattedTime} Disclaimer`;
};


displayTime();
setInterval(displayTime, 1000);


const baseCurrencySelect = document.getElementById('baseCurrency');
const targetCurrencySelect = document.getElementById('targetCurrency');
const baseInput = document.getElementById('base');
const targetInput = document.getElementById('target');
const errorMessage = document.getElementById('errorMessage');

fetch('http://data.fixer.io/api/symbols?access_key=Your_API_Access_Key')
  .then(response => response.json())
  .then(data => {
    const symbols = data.symbols;

    for (const symbol in symbols) {
      const option1 = document.createElement('option');
      option1.value = symbol;
      option1.text = symbol + ' - ' + symbols[symbol];
      baseCurrencySelect.appendChild(option1);

      const option2 = document.createElement('option');
      option2.value = symbol;
      option2.text = symbol + ' - ' + symbols[symbol];
      targetCurrencySelect.appendChild(option2);
    }

    baseCurrencySelect.value = 'EUR';
    targetCurrencySelect.value = 'USD';
  })
  .catch(error => {
    errorMessage.textContent = 'Error loading currency symbols';
  });

baseCurrencySelect.addEventListener('change', function () {
  convertCurrency(1)
});

targetCurrencySelect.addEventListener('change', function () {
  convertCurrency(2)
});

baseInput.addEventListener('input', function () {
  convertCurrency(1)
});

targetInput.addEventListener('input', function () {
  convertCurrency(2)
});

function convertCurrency(type) {
  const baseCurrency = baseCurrencySelect.value;
  const targetCurrency = targetCurrencySelect.value;
  const amount = type === 1 ? baseInput.value : targetInput.value;

  errorMessage.textContent = '';

  fetch(`http://data.fixer.io/api/latest?access_key=Your_API_Access_Key&base=${type === 1 ? baseCurrency : targetCurrency}`)
    .then(response => response.json())
    .then(data => {

      let conversionRate = data.rates[targetCurrency];

      if (conversionRate) {
        if (type === 1) {
          targetInput.value = (amount * conversionRate).toFixed(2);
        } else {
          // Use the reciprocal of the conversion rate for the reverse calculation
          baseInput.value = (amount / conversionRate).toFixed(2);
        }
        document.getElementById("fromEqual").innerText = "1 " + baseCurrencySelect.selectedOptions[0].innerText.split("-")[1] + " equals";
        document.getElementById("toEqualValue").innerText = targetInput.value;
        document.getElementById("toEqualUnit").innerText = targetCurrencySelect.selectedOptions[0].innerText.split("-")[1];
      } else {
        errorMessage.textContent = 'Invalid currency codes';
      }
    })
    .catch(error => {
      errorMessage.textContent = 'Error fetching conversion rates';
    });
}
