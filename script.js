document.getElementById("floorPlanForm").addEventListener("submit", function(e){
    e.preventDefault();

    const length = parseInt(document.getElementById("plotLength").value);
    const width = parseInt(document.getElementById("plotWidth").value);
    const bedrooms = parseInt(document.getElementById("bedrooms").value);
    const car = document.getElementById("parkingCar").checked;
    const bike = document.getElementById("parkingBike").checked;
    const staircase = document.getElementById("staircase").checked;

    const designsContainer = document.getElementById("designsContainer");
    designsContainer.innerHTML = "";

    // Convert plot dimensions to canvas scale
    const scale = Math.min(200 / length, 200 / width); // scale to fit canvas

    for(let i=1; i<=20; i++){
        const canvas = document.createElement("canvas");
        canvas.width = 250;
        canvas.height = 250;
        const ctx = canvas.getContext("2d");

        // Clear canvas and set background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1;

        // Keep track of occupied area
        let offsetX = 10;
        let offsetY = 10;
        let remainingWidth = width;
        let remainingLength = length;

        const roomPadding = 5;

        // 1. Bedrooms
        const bedroomWidth = (width / bedrooms) * scale - roomPadding;
        const bedroomLength = (length / 3) * scale - roomPadding; // 1/3 length for bedrooms

        for(let b=0; b<bedrooms; b++){
            ctx.strokeRect(offsetX + b*bedroomWidth, offsetY, bedroomWidth, bedroomLength);
            ctx.fillStyle = "#000";
            ctx.font = "10px Poppins";
            ctx.fillText(`Bedroom ${b+1}`, offsetX + b*bedroomWidth + 5, offsetY + 15);
        }

        offsetY += bedroomLength + roomPadding;

        // 2. Kitchen
        const kitchenWidth = width * scale / 2 - roomPadding;
        const kitchenLength = length * scale / 4 - roomPadding;
        ctx.strokeRect(offsetX, offsetY, kitchenWidth, kitchenLength);
        ctx.fillText("Kitchen", offsetX + 5, offsetY + 15);

        // 3. Bathroom
        const bathroomWidth = width * scale / 4 - roomPadding;
        const bathroomLength = length * scale / 4 - roomPadding;
        ctx.strokeRect(offsetX + kitchenWidth + roomPadding, offsetY, bathroomWidth, bathroomLength);
        ctx.fillText("Bathroom", offsetX + kitchenWidth + 5, offsetY + 15);

        offsetY += kitchenLength + roomPadding;

        // 4. Parking
        if(car){
            const carWidth = width * scale / 2 - roomPadding;
            const carLength = length * scale / 6;
            ctx.strokeRect(offsetX, offsetY, carWidth, carLength);
            ctx.fillText("Car Parking", offsetX + 5, offsetY + 15);
        } else if(bike){
            const bikeWidth = width * scale / 4 - roomPadding;
            const bikeLength = length * scale / 6;
            ctx.strokeRect(offsetX, offsetY, bikeWidth, bikeLength);
            ctx.fillText("Bike Parking", offsetX + 5, offsetY + 15);
        }

        // 5. Staircase
        if(staircase){
            const stairWidth = width * scale / 5 - roomPadding;
            const stairLength = length * scale / 6;
            ctx.strokeRect(offsetX + width*scale - stairWidth - 10, offsetY, stairWidth, stairLength);
            ctx.fillText("Stairs", offsetX + width*scale - stairWidth, offsetY + 15);
        }

        // Add card wrapper
        const designBox = document.createElement("div");
        designBox.className = "design";

        // Download button
        const downloadBtn = document.createElement("button");
        downloadBtn.innerText = "Download";
        downloadBtn.onclick = () => {
            const link = document.createElement("a");
            link.download = `AutoNaksha_Design_${i}.png`;
            link.href = canvas.toDataURL();
            link.click();
        };

        designBox.appendChild(canvas);
        designBox.appendChild(downloadBtn);
        designsContainer.appendChild(designBox);
    }
});
