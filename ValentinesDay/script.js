let heartsInterval;

document.getElementById('yesBtn').onclick = function() {
    if (!heartsInterval) { // Only start the interval if it hasn't been started yet
        generateHearts
        heartsInterval = setInterval(generateHearts, 100); // Generate hearts every 200 milliseconds
    }

    displayMessage(); // Display and keep the message on the screen
};

document.getElementById('noBtn').onclick = function() {
    alert('Try again dummy');
};

function generateHearts() {

    const heart = document.createElement('div');
    heart.innerHTML = '💖';
    heart.classList.add('heart');
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.top = Math.random() * 100 + 'vh';
    document.body.appendChild(heart);

    // Schedule the fade-out effect before removing the heart
    setTimeout(() => heart.classList.add('fade-out'), 100); // Start fading out after 3 seconds
    setTimeout(() => heart.remove(), 5000); // Remove heart after fade-out completes

}

function displayMessage() {
    let messageDiv = document.getElementById('confirmationMessage');
    if (!messageDiv) { // Only create the message div if it does not already exist
        messageDiv = document.createElement('div');
        messageDiv.id = 'confirmationMessage';
        messageDiv.innerHTML = `<p>Yayyy! 💖</p>`;
        messageDiv.style.position = 'fixed';
        messageDiv.style.top = '80%'; // Adjust position as needed
        messageDiv.style.left = '50%';
        messageDiv.style.transform = 'translate(-50%, -50%)';
        messageDiv.style.zIndex = '1000';
        messageDiv.style.fontSize = '10px';
        messageDiv.style.color = 'white';
        messageDiv.style.backgroundColor = 'rgba(255, 20, 147, 0.85)';
        messageDiv.style.padding = '10px';
        messageDiv.style.borderRadius = '10px';
        messageDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        document.body.appendChild(messageDiv);
    }
}
