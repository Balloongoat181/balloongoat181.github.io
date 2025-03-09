const scriptUrl = "https://script.google.com/macros/s/AKfycbzXXUnd--XmJb0bLKXWQej1GrzSnG7BCd4VmFY4fh49_R5GLvdyEJXqDOlSsTgLh73U/exec";

const completedRows = new Set(); // Stores completed row numbers

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
            console.log("Entry Data:", entry); // Debugging - Check structure of data

            let rowNumber = index + 2; // Ensure correct row mapping

            let row = document.createElement("tr");

            let statusText = completedRows.has(rowNumber) ? "Completed" : "Pending";
            let buttonHTML = completedRows.has(rowNumber) 
                ? "<td><span class='completed-text'>✔ Completed</span></td>" 
                : `<td><button class="complete-btn" data-row="${rowNumber}">✔ Mark as Completed</button></td>`;

            row.innerHTML = `
                <td>${entry.Team_number || "N/A"}</td>
                <td>${entry.Team_name || "N/A"}</td>
                <td>${entry.Robot_problem || "N/A"}</td>
                <td>${entry.Timestamp || "N/A"}</td>
                <td>${Status}</td>
                ${buttonHTML}
            `;

            responseList.appendChild(row);
        });

        // Attach event listeners to "Mark as Completed" buttons
        document.querySelectorAll(".complete-btn").forEach(button => {
            button.addEventListener("click", function() {
                const rowNumber = this.getAttribute("data-row");
                markAsCompleted(rowNumber, this);
            });
        });

    } catch (error) {
        console.error("Failed to fetch data:", error);
    }
}

function markAsCompleted(rowNumber, buttonElement) {
    console.log("Marking row as completed:", rowNumber);

    if (!rowNumber) {
        console.error("Error: rowNumber is undefined or null");
        return;
    }

    completedRows.add(rowNumber);
    localStorage.setItem("completedRows", JSON.stringify([...completedRows])); // Save progress

    let row = buttonElement.closest("tr");
    row.querySelector("td:nth-child(5)").textContent = "Completed";

    buttonElement.outerHTML = "<span class='completed-text'>✔ Completed</span>";
}
