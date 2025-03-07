async function fetchResponses() {
    const scriptUrl = "https://script.googleusercontent.com/macros/echo?user_content_key=jtFHA4mjQLfoW-_GwRFvWmFlmCK16nQrWypsens3Csihmlrn2TL8xMdcQRTQOZUgoujHan94SQZvt_kYZo-STiH96A1IPJiGm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnB7kDV9VCt2wLFr7OKt4SL8Zyx2kWv2t-pX3WgeJFE3zL3cEWn43aZKtaYsTQd2arjEoqeHD7vsXbxQrIZCalhCCLzpNCvGnyQ&lib=M2gkHwL3gTSGLM09msNVm60zN9sd4IQmq"; // Replace with actual URL

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

        // Attach event listeners to delete buttons
        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", async function() {
                const rowNumber = this.getAttribute("data-row");
                await deleteResponse(scriptUrl, rowNumber);
            });
        });

    } catch (error) {
        console.error("Error fetching responses:", error);
    }
}

// Call the function on page load
fetchResponses();
setInterval(fetchResponses, 10000); // Auto-refresh every 10 seconds
