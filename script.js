const scriptUrl = "https://script.google.com/macros/s/AKfycbyVWFJpNXSyRXstFnxE_kt0TRxwXNK1LCkID4H4MjDUiku-H27mdbrwcy7lQ6-DKYbz/exec";

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
                await deleteResponse(rowNumber); // FIXED: Removed scriptUrl
            });
        });

    } catch (error) {
        console.error("Failed to fetch data:", error);
    }
}

// ✅ FIXED: Removed scriptUrl from function
sync function deleteResponse(rowNumber) {
    console.log("Attempting to delete row:", rowNumber); // Debugging Log

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
