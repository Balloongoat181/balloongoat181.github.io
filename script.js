async function fetchResponses() {
    const scriptUrl = "https://script.google.com/macros/s/AKfycbwEwI8fdfPoG04yly_9NQBFtE-VP8LwLlyG9fHAWIjVcmXHovq6GtMVWGQ-SJydaFSC/exec";

    try {
        const response = await fetch(scriptUrl);
        const data = await response.json();
    
        console.log("Fetched Data:", data); // Debugging step
    
        const responseList = document.getElementById("response-list");
        responseList.innerHTML = ""; // Clear previous data
    
        data.forEach(entry => {
            let row = document.createElement("tr");
    
            row.innerHTML = `
                <td>${entry.Team_number}</td>
                <td>${entry.Team_name}</td>
                <td>${entry.Robot_problem}</td>
                <td>${entry.Timestamp}</td>
                <td><button class="delete-btn" data-row="${entry.rowNumber}">🗑 Delete</button></td>
            `;
    
            responseList.appendChild(row);
        });
    
        // Add event listeners to all delete buttons
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", async function() {
                const rowNumber = this.getAttribute("data-row");
                await deleteResponse(scriptUrl, rowNumber);
            });
        });
    } catch (error) {
        console.error("Failed to fetch data:", error);
    }
}

// Function to delete a row from Google Sheets
async function deleteResponse(scriptUrl, rowNumber) {
    const confirmDelete = confirm("Are you sure you want to delete this response?");
    if (!confirmDelete) return;

    try {
        const response = await fetch(scriptUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ command: 'delete', rowNumber: parseInt(rowNumber) })
        });
        if (response.ok) {
            alert('Response deleted successfully!');
            fetchResponses(); // Refresh list after deletion
        } else {
            alert('Failed to delete response.');
        }
    } catch (error) {
        console.error('Error deleting response:', error);
    }
}
