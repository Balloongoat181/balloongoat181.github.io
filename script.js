const scriptUrl = "https://script.google.com/macros/s/AKfycbwkj-6UnO1fiAtNjbJ4Ph8NAuk9vbgg3bpNZ0PWMY1AjpqKm016w0McVH1mKMNkD4a7/exec";

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

        data.forEach(entry => {
            console.log("Entry Data:", entry); // Debugging - Check structure of data

            let row = document.createElement("tr");

            row.innerHTML = `
                <td>${entry.Team_number || "N/A"}</td>
                <td>${entry.Team_name || "N/A"}</td>
                <td>${entry.Robot_problem || "N/A"}</td>
                <td>${entry.Timestamp || "N/A"}</td>
                <td><button class="delete-btn" data-row="${entry.rowNumber}">🗑 Delete</button></td>
            `;

            responseList.appendChild(row);
        });

        // Attach event listeners to delete buttons
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", async function() {
                const rowNumber = this.getAttribute("data-row");
                console.log("Delete button clicked for row:", rowNumber); // Debugging
                await deleteResponse(rowNumber);
            });
        });

    } catch (error) {
        console.error("Failed to fetch data:", error);
    }
}

// ✅ FIXED: Changed `sync` to `async`
async function deleteResponse(rowNumber) {
    console.log("Attempting to delete row:", rowNumber); // Debugging Log

    if (!rowNumber) {
        console.error("Error: rowNumber is undefined or null");
        return;
    }

    const confirmDelete = confirm("Are you sure you want to delete this response?");
    if (!confirmDelete) return;

    try {
        const response = await fetch(scriptUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ command: "delete", rowNumber: parseInt(rowNumber) })
        });

        const result = await response.json();
        console.log("Delete Response:", result); // Debugging Log

        if (result.status === "success") {
            alert("Response deleted successfully!");
            fetchResponses(); // Refresh list after deletion
        } else {
            alert("Failed to delete response.");
        }
    } catch (error) {
        console.error("Error deleting response:", error);
    }
}

// Load responses when the page loads
fetchResponses();
setInterval(fetchResponses, 10000); // Auto-refresh every 10 seconds
