// fireworks.js
(function() {
  const canvas = document.getElementById('fireworks-canvas');
  if (!canvas) return;
  let ctx, W, H, fireworks = [], particles = [], timer = null, autoTimer = null;

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
    this.vy = -3 - Math.random()*1.2; // 放慢上升速度
  }
  Firework.prototype.update = function() {
    if (!this.exploded) {
      this.y += this.vy;
      if (this.y <= this.targetY) {
        this.exploded = true;
        for (let i=0;i<64;i++) { // 增加煙火粒子數
          this.particles.push(new Particle(this.x, this.y, this.color));
        }
      }
    }
  };
  Firework.prototype.draw = function(ctx) {
    if (!this.exploded) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, 7, 0, 2*Math.PI); // 增加煙火主體大小
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.restore();
    }
  };

  function Particle(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = 4 + Math.random()*4; // 增加粒子大小
    this.angle = Math.random()*2*Math.PI;
    this.speed = 1.2 + Math.random()*2.5; // 放慢粒子速度
    this.alpha = 1;
    this.decay = 0.008 + Math.random()*0.008; // 放慢消失速度
  }
  Particle.prototype.update = function() {
    this.x += Math.cos(this.angle)*this.speed;
    this.y += Math.sin(this.angle)*this.speed + 0.3;
    this.alpha -= this.decay;
  };
  Particle.prototype.draw = function(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(this.alpha,0);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 12;
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
    requestAnimationFrame(animate);
  }

  function launchFireworks() {
    resize();
    canvas.style.display = 'block';
    ctx = canvas.getContext('2d');
    // 每次多放幾組煙火
    for (let i=0;i<8+Math.floor(Math.random()*3);i++) {
      fireworks.push(new Firework());
    }
  }

  function autoFireworks() {
    launchFireworks();
    autoTimer = setTimeout(autoFireworks, 1200); // 每1.2秒自動施放
  }

  function stopAutoFireworks() {
    if (autoTimer) {
      clearTimeout(autoTimer);
      autoTimer = null;
    }
  }

  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      stopAutoFireworks();
    } else {
      if (!autoTimer) autoFireworks();
    }
  });

  window.addEventListener('resize', resize);
  // 自動施放煙火
  function autoFireworks() {
    launchFireworks();
    autoTimer = setTimeout(autoFireworks, 1200); // 每1.2秒自動施放
  }

  resize();
  canvas.style.display = 'block';
  ctx = canvas.getContext('2d');
  animate();
  autoFireworks();
})();
