async function getBankName() {
  try {
    const response = await fetch("../bankname.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const selectElement = document.getElementById("bankSelect");
    for (const [code, name] of Object.entries(data)) {
      const option = document.createElement("option");
      option.value = code;
      option.textContent = name;
      selectElement.appendChild(option);
    }
    console.log("Bank data loaded:", data);
  } catch (error) {
    console.error("Failed to fetch bank names:", error);
  }
}

getBankName();
