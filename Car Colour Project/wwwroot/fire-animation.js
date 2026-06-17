class FireAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.isActive = false;
        
        // Handle resize
        window.addEventListener('resize', () => this.resize());
        this.resize();
    }

    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    ignite() {
        this.isActive = true;
        this.loop();
    }

    extinguish() {
        this.isActive = false;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles = [];
    }

    loop() {
        if (!this.isActive) return;

        requestAnimationFrame(() => this.loop());

        // Darken canvas slowly to leave trails
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.globalCompositeOperation = 'lighter';

        // Add new particles at the bottom center, spread across the width
        for (let i = 0; i < 40; i++) { // Spawn a massive amount of particles
            this.particles.push({
                x: this.canvas.width / 2 + (Math.random() - 0.5) * (this.canvas.width * 0.9),
                y: this.canvas.height + 20, // Starts slightly below the bottom
                vx: (Math.random() - 0.5) * 3, // Drift sideways
                vy: -(Math.random() * 10 + 5), // Shoots upwards extremely fast
                radius: Math.random() * 50 + 20, // Massive flames to hide the box
                life: 1,
                decay: Math.random() * 0.01 + 0.005, // Dies much slower to reach the top
                colorR: 255,
                colorG: Math.floor(Math.random() * 180) + 20, // Deep red to bright yellow
                colorB: 0
            });
        }

        // Update and draw
        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];
            
            p.x += p.vx;
            p.y += p.vy;
            p.radius *= 0.98; // Shrink slightly slower
            p.life -= p.decay;

            if (p.life <= 0 || p.radius < 1) {
                this.particles.splice(i, 1);
                i--;
                continue;
            }

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            // More opaque center, fading out to edges
            this.ctx.fillStyle = `rgba(${p.colorR}, ${p.colorG}, ${p.colorB}, ${p.life * 1.5})`; 
            this.ctx.fill();
        }
    }
}

// Global instance to be used by app.js
window.loginFire = null;
document.addEventListener('DOMContentLoaded', () => {
    // Only init if canvas exists
    if (document.getElementById('fireCanvas')) {
        window.loginFire = new FireAnimation('fireCanvas');
    }
});
