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

    const scale = Math.min(200 / length, 200 / width); // Scale to fit canvas

    for(let i=1; i<=20; i++){
        const canvas = document.createElement("canvas");
        canvas.width = 250;
        canvas.height = 250;
        const ctx = canvas.getContext("2d");

        // Background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1;

        // Random offset for variation
        const offsetX = 10 + Math.random()*10;
        const offsetY = 10 + Math.random()*10;
        const roomPadding = 5;

        // Function to draw room
        function drawRoom(name, x, y, w, h){
            ctx.strokeRect(x, y, w, h);
            ctx.fillStyle = "#000";
            ctx.font = "10px Poppins";
            ctx.fillText(name, x+3, y+12);
        }

        let currentY = offsetY;

        // 1. Bedrooms
        const bedroomHeight = (length/3)*scale - roomPadding;
        const bedroomWidth = ((width - roomPadding*(bedrooms-1))/bedrooms)*scale;
        for(let b=0; b<bedrooms; b++){
            let x = offsetX + b*(bedroomWidth + roomPadding);
            drawRoom(`Bedroom ${b+1}`, x, currentY, bedroomWidth, bedroomHeight);
        }
        currentY += bedroomHeight + roomPadding;

        // 2. Kitchen
        const kitchenHeight = (length/4)*scale;
        const kitchenWidth = (width/2)*scale - roomPadding;
        drawRoom("Kitchen", offsetX, currentY, kitchenWidth, kitchenHeight);

        // 3. Bathroom
        const bathroomWidth = (width/4)*scale;
        const bathroomHeight = kitchenHeight;
        drawRoom("Bathroom", offsetX + kitchenWidth + roomPadding, currentY, bathroomWidth, bathroomHeight);

        currentY += kitchenHeight + roomPadding;

        // 4. Parking
        if(car){
            const carWidth = (width/2)*scale;
            const carHeight = (length/6)*scale;
            drawRoom("Car Parking", offsetX, currentY, carWidth, carHeight);
        } else if(bike){
            const bikeWidth = (width/4)*scale;
            const bikeHeight = (length/6)*scale;
            drawRoom("Bike Parking", offsetX, currentY, bikeWidth, bikeHeight);
        }

        // 5. Staircase
        if(staircase){
            const stairWidth = (width/5)*scale;
            const stairHeight = (length/6)*scale;
            drawRoom("Stairs", offsetX + width*scale - stairWidth - 10, currentY, stairWidth, stairHeight);
        }

        // Card wrapper
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
