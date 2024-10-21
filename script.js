document.addEventListener("DOMContentLoaded", () => {
  const entryForm = document.getElementById("entry-form");
  const entriesList = document.getElementById("entries-list");
  const totalIncomeEl = document.getElementById("total-income");
  const totalExpensesEl = document.getElementById("total-expenses");
  const netBalanceEl = document.getElementById("net-balance");
  const filterRadios = document.querySelectorAll('input[name="filter"]');

  let entries = JSON.parse(localStorage.getItem("entries")) || [];

  // Event listener to add an entry

  function updateSummary() {
    const totalIncome = entries
      .filter((entry) => entry.type === "income")
      .reduce((sum, entry) => sum + entry.amount, 0);
    const totalExpenses = entries
      .filter((entry) => entry.type === "expense")
      .reduce((sum, entry) => sum + entry.amount, 0);
    const netBalance = totalIncome - totalExpenses;

    totalIncomeEl.textContent = totalIncome;
    totalExpensesEl.textContent = totalExpenses;
    netBalanceEl.textContent = netBalance;
  }

  //Entry with filter function

  function renderEntries(filter = "all") {
    entriesList.innerHTML = "";
    const filteredEntries =
      filter === "all"
        ? entries
        : entries.filter((entry) => entry.type === filter);
    filteredEntries.forEach((entry, index) => {
      const li = document.createElement("li");
      li.className = entry.type;
      li.innerHTML = `
              <span>${entry.description} - ₹${entry.amount}</span>
              <button onclick="editEntry(${index})">Edit</button>
              <button onclick="deleteEntry(${index})">Delete</button>
          `;
      entriesList.appendChild(li);
    });
  }

  function saveEntries() {
    localStorage.setItem("entries", JSON.stringify(entries));
  }

  // addevent listner to Entry form

  entryForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const description = document.getElementById("description").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.querySelector('input[name="type"]:checked').value;

    entries.push({ description, amount, type });
    saveEntries();
    renderEntries();
    updateSummary();
    entryForm.reset();
  });

  filterRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      renderEntries(e.target.value);
    });
  });

  // edit button
  window.editEntry = (index) => {
    const entry = entries[index];
    document.getElementById("description").value = entry.description;
    document.getElementById("amount").value = entry.amount;
    document.querySelector(
      `input[name="type"][value="${entry.type}"]`
    ).checked = true;
    entries.splice(index, 1);
    saveEntries();
    renderEntries();
    updateSummary();
  };

  // delete button

  window.deleteEntry = (index) => {
    entries.splice(index, 1);
    saveEntries();
    renderEntries();
    updateSummary();
  };

  // Initial UI setup

  renderEntries();
  updateSummary();
});
