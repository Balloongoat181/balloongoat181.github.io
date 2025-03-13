const scriptUrl = "https://sparkling-bonus-4190.balloongoat181.workers.dev/";

async function fetchResponses() {
    try {
        console.log("Fetching data from:", scriptUrl);
        const response = await fetch(scriptUrl, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched Data:", data); // Debugging log

        const responseList = document.getElementById("response-list");
        responseList.innerHTML = ""; // Clear previous data

        if (!Array.isArray(data) || data.length === 0) {
            console.warn("No responses found or incorrect format.");
            responseList.innerHTML = "<tr><td colspan='5'>No responses found</td></tr>";
            return;
        }

        data.forEach((entry, index) => {
            let rowNumber = entry.rowNumber; // Use correct row number from Google Sheets

            let row = document.createElement("tr");

            let statusText = entry.Status === "Completed" ? "Completed" : "Pending";
            let buttonHTML = entry.Status === "Completed"
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

        // Attach event listeners to "Mark as Completed" buttons
        document.querySelectorAll(".complete-btn").forEach(button => {
            button.addEventListener("click", async function() {
                const rowNumber = this.getAttribute("data-row");
                await markAsCompleted(rowNumber, this);
            });
        });

    } catch (error) {
        console.error("Failed to fetch data:", error);
    }
}

// ✅ Function to Send "Mark as Completed" Request to Google Sheets
async function markAsCompleted(rowNumber, buttonElement) {
    console.log("Marking row as completed in Google Sheets:", rowNumber);

    if (!rowNumber) {
        console.error("Error: rowNumber is undefined or null");
        return;
    }

    const confirmMark = confirm("Are you sure you want to mark this as completed?");
    if (!confirmMark) return;

    try {
        const response = await fetch(scriptUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ command: "markComplete", rowNumber: parseInt(rowNumber) })
        });

        const result = await response.json();
        console.log("Update Response:", result); // Debugging Log

        if (result.status === "success") {
            alert("Response marked as completed!");
            fetchResponses(); // Refresh list after update
        } else {
            alert("Failed to mark response as completed.");
        }
    } catch (error) {
        console.error("Error updating response:", error);
    }
}

// ✅ Load responses when the page loads
fetchResponses();
setInterval(fetchResponses, 10000); // Auto-refresh every 10 seconds
