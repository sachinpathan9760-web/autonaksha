document.getElementById('floorPlanForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const length = parseInt(document.getElementById('plotLength').value);
    const width = parseInt(document.getElementById('plotWidth').value);
    const bedrooms = parseInt(document.getElementById('bedrooms').value);
    const hasCarParking = document.getElementById('parkingCar').checked;
    const hasBikeParking = document.getElementById('parkingBike').checked;
    const hasStaircase = document.getElementById('staircase').checked;

    if (length <= 0 || width <= 0) {
        alert("Please enter valid positive dimensions for the plot.");
        return;
    }

    // Clear previous designs
    const container = document.getElementById('designsContainer');
    container.innerHTML = '';

    // --- Core Logic: Generate 20 Layouts ---
    const designs = generateFloorPlans(length, width, bedrooms, hasCarParking, hasBikeParking, hasStaircase);

    // --- Rendering ---
    designs.forEach((design, index) => {
        const designCard = createDesignCard(index + 1);
        container.appendChild(designCard);

        const canvas = designCard.querySelector('.floor-plan-canvas');
        canvas.width = 400; // Fixed canvas size for drawing
        canvas.height = Math.round(400 * (width / length)); // Maintain aspect ratio based on plot dimensions
        const ctx = canvas.getContext('2d');
        
        // Use a scale factor to fit the plot dimensions onto the canvas
        const scaleFactor = canvas.width / length;

        drawFloorPlan(ctx, design, scaleFactor);
        
        // Add download functionality
        const downloadButton = designCard.querySelector('.download-button');
        downloadButton.addEventListener('click', () => downloadCanvas(canvas, `AutoNaksha_Design_${index + 1}.png`));
    });

    if (designs.length === 0) {
        container.innerHTML = '<p class="placeholder">Could not generate designs with the current constraints. Try adjusting the plot size or features.</p>';
    }
});


/**
 * Function to generate multiple floor plan data structures. 
 * This is where the complex layout logic would live.
 */
function generateFloorPlans(L, W, B, car, bike, stairs) {
    // NOTE: This is a simplified placeholder. 
    // In a real application, this function would contain complex spatial algorithms 
    // to dynamically calculate room coordinates (x, y, w, h) for 20+ unique layouts.
    
    const designs = [];
    
    // Minimum room sizes (in feet)
    const minLiving = 10 * 10;
    const minBedroom = 10 * 12;
    const minKitchen = 8 * 10;
    const minBathroom = 5 * 8;
    const minParkingCar = 10 * 18; 
    
    // Example 1: Simple L-shaped division
    if (L * W > (minLiving + (B * minBedroom) + minKitchen + minBathroom)) {
        designs.push({
            name: "Classic Layout (L-Divide)",
            rooms: [
                { name: "Living", x: 0, y: 0, w: L * 0.4, h: W * 0.6, color: '#FCD77C' }, 
                { name: "Kitchen", x: L * 0.4, y: 0, w: L * 0.3, h: W * 0.4, color: '#C69C95' },
                { name: "Bedroom 1", x: L * 0.4, y: W * 0.4, w: L * 0.3, h: W * 0.4, color: '#9BB8D0' },
                { name: "Bathroom", x: L * 0.7, y: 0, w: L * 0.3, h: W * 0.3, color: '#A9A9A9' },
                // ... add other rooms and features dynamically based on B, car, bike, stairs
            ]
        });
    }

    // Example 2: Central Corridor
    if (L > 20 && W > 20) {
         designs.push({
            name: "Corridor Style",
            rooms: [
                { name: "Entrance", x: 0, y: W * 0.4, w: L * 0.1, h: W * 0.2, color: '#E0A9AF' },
                { name: "Living/Dining", x: L * 0.1, y: 0, w: L * 0.5, h: W * 0.5, color: '#F0E68C' }, 
                { name: "Bedroom 1", x: L * 0.6, y: 0, w: L * 0.4, h: W * 0.5, color: '#8FBC8F' },
                // ... generate more rooms for this layout
            ]
        });
    }

    // **IMPORTANT:** You need to significantly expand this array (e.g., up to 20 or more) 
    // with different calculated layout objects to meet the project goal.
    // Use loops, math, and conditional logic (B, car, bike, stairs) to create genuine variations.

    return designs;
}


/**
 * Creates the HTML structure for a single design card.
 */
function createDesignCard(index) {
    const card = document.createElement('div');
    card.className = 'design-card';
    card.innerHTML = `
        <h3>Design #${index}</h3>
        <canvas class="floor-plan-canvas"></canvas>
        <button class="download-button">Download PNG</button>
    `;
    return card;
}


/**
 * Draws the floor plan onto the Canvas element.
 */
function drawFloorPlan(ctx, design, scaleFactor) {
    // Clear canvas and set background
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Draw the entire plot boundary
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    design.rooms.forEach(room => {
        // Calculate scaled dimensions
        const x = room.x * scaleFactor;
        const y = room.y * scaleFactor;
        const w = room.w * scaleFactor;
        const h = room.h * scaleFactor;
        
        // Draw Fill
        ctx.fillStyle = room.color || '#D3D3D3'; // Use room-specific color or default
        ctx.fillRect(x, y, w, h);

        // Draw Walls (Room Boundary)
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, w, h);

        // Add Label (Name and Size)
        ctx.fillStyle = '#111';
        ctx.font = '10px Poppins';
        ctx.textAlign = 'center';

        const roomSize = `(${Math.round(room.w)}' x ${Math.round(room.h)}')`;
        
        // Center text in the room
        const centerX = x + w / 2;
        const centerY = y + h / 2;

        ctx.fillText(room.name, centerX, centerY - 5);
        ctx.fillText(roomSize, centerX, centerY + 10);
    });
}


/**
 * Handles the canvas download functionality.
 */
function downloadCanvas(canvas, filename) {
    const dataURL = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}