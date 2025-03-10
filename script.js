const scriptUrl = "https://script.google.com/macros/s/AKfycbzU1cooi6aCKoftclvNP8NlePv2c_axE9brO6FF1JJYCIACbsYVC3CG8Z-YbpujteHe/exec";

// ✅ Load completed rows from localStorage (ensure they persist)
let completedRows = new Set(JSON.parse(localStorage.getItem("completedRows")) || []);

async function fetchResponses() {
    try {
        console.log("Fetching data from:", scriptUrl);
        const response = await fetch(scriptUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched Data:", data); // Debugging log

        const responseList = document.getElementById("response-list");
        responseList.innerHTML = ""; // Clear previous data

        data.forEach((entry, index) => {
            let rowNumber = index + 2; // Ensure correct row mapping

            let row = document.createElement("tr");

            // ✅ Check if row is marked as completed (from localStorage)
            let isCompleted = completedRows.has(rowNumber);
            let statusText = isCompleted ? "Completed" : "Pending";
            let buttonHTML = isCompleted
                ? "<td><span class='completed-text'>✔ Completed</span></td>" 
                : `<td><button class="complete-btn" data-row="${rowNumber}">✔ Mark as Completed</button></td>`;

            row.innerHTML = `
                <td>${entry.Team_number || "N/A"}</td>
                <td>${entry.Team_name || "N/A"}</td>
                <td>${entry.Robot_problem || "N/A"}</td>
                <td>${entry.Timestamp || "N/A"}</td>
                <td>${statusText}</td>
                ${buttonHTML}
            `;

            responseList.appendChild(row);
        });

        // ✅ Restore event listeners for new buttons
        document.querySelectorAll(".complete-btn").forEach(button => {
            button.addEventListener("click", function() {
                const rowNumber = this.getAttribute("data-row");
                markAsCompleted(rowNumber, this);
            });
        });

        console.log("Completed Rows After Refresh:", completedRows); // Debugging log

    } catch (error) {
        console.error("Failed to fetch data:", error);
    }
}

// ✅ Function to Mark a Response as Completed (Local Storage Only)
function markAsCompleted(rowNumber, buttonElement) {
    console.log("Marking row as completed:", rowNumber);

    if (!rowNumber) {
        console.error("Error: rowNumber is undefined or null");
        return;
    }

    // ✅ Store completed row in localStorage
    completedRows.add(rowNumber);
    localStorage.setItem("completedRows", JSON.stringify([...completedRows])); // Save to localStorage

    let row = buttonElement.closest("tr");
    row.querySelector("td:nth-child(5)").textContent = "Completed"; // Update status column

    buttonElement.outerHTML = "<span class='completed-text'>✔ Completed</span>"; // Replace button with text

    console.log("Updated Completed Rows:", completedRows); // Debugging log
}

// ✅ Ensure completed rows persist after a page refresh
document.addEventListener("DOMContentLoaded", () => {
    console.log("Restoring Completed Rows from Local Storage:", completedRows);
    fetchResponses();
});
setInterval(fetchResponses, 10000); // Auto-refresh every 10 seconds
