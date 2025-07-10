// fireworks.js
(function() {
  const canvas = document.getElementById('fireworks-canvas');
  if (!canvas) return;
  let ctx, W, H, fireworks = [], particles = [], timer = null;

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
  }

  function randomColor() {
    const colors = ['#ff6f61','#ffe082','#00b894','#00B7FF','#fda085','#f6d365'];
    return colors[Math.floor(Math.random()*colors.length)];
  }

  function Firework() {
    this.x = Math.random() * W;
    this.y = H;
    this.targetY = 150 + Math.random() * (H/2-150);
    this.color = randomColor();
    this.exploded = false;
    this.particles = [];
    this.vy = -7 - Math.random()*2;
  }
  Firework.prototype.update = function() {
    if (!this.exploded) {
      this.y += this.vy;
      if (this.y <= this.targetY) {
        this.exploded = true;
        for (let i=0;i<32;i++) {
          this.particles.push(new Particle(this.x, this.y, this.color));
        }
      }
    }
  };
  Firework.prototype.draw = function(ctx) {
    if (!this.exploded) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, 2*Math.PI);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.restore();
    }
  };

  function Particle(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = 2 + Math.random()*2;
    this.angle = Math.random()*2*Math.PI;
    this.speed = 2 + Math.random()*4;
    this.alpha = 1;
    this.decay = 0.012 + Math.random()*0.012;
  }
  Particle.prototype.update = function() {
    this.x += Math.cos(this.angle)*this.speed;
    this.y += Math.sin(this.angle)*this.speed + 0.5;
    this.alpha -= this.decay;
  };
  Particle.prototype.draw = function(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(this.alpha,0);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();
  };

  function animate() {
    ctx.clearRect(0,0,W,H);
    for (let i=fireworks.length-1;i>=0;i--) {
      let f = fireworks[i];
      f.update();
      f.draw(ctx);
      if (f.exploded) {
        for (let j=f.particles.length-1;j>=0;j--) {
          let p = f.particles[j];
          p.update();
          p.draw(ctx);
          if (p.alpha <= 0) f.particles.splice(j,1);
        }
        if (f.particles.length === 0) fireworks.splice(i,1);
      }
    }
    if (fireworks.length > 0) {
      requestAnimationFrame(animate);
    } else {
      canvas.style.display = 'none';
      timer = null;
    }
  }

  function launchFireworks() {
    resize();
    canvas.style.display = 'block';
    ctx = canvas.getContext('2d');
    fireworks.length = 0;
    for (let i=0;i<4+Math.floor(Math.random()*2);i++) {
      fireworks.push(new Firework());
    }
    if (!timer) animate();
    setTimeout(()=>{canvas.style.display='none';}, 2200);
  }

  window.addEventListener('resize', resize);
  document.getElementById('celebrate-btn').onclick = function() {
    launchFireworks();
  };
})();

