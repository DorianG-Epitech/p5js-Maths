import P5 from "p5";

type MassPoint = {
  position: { x: number, y: number },
  velocity: { x: number, y: number },
  Force: { x: number, y: number },
  mass: number,
}
type Spring = {
  points: MassPoint[],
  stiffness: number,
  restLength: number,
  damping: number,
}

const sketch = (p5: P5) => {
    var MassPoints: MassPoint[] = [];
    var Springs: Spring[] = [];
    const Gravity = 9.8;
    const SquareSize = 10;
    const MassPointsGap = 30;
    const TimeSpeed = 0.1;
    var paused = false;
    var time = 0;
    
    p5.setup = () => {
      var resetButton = p5.createButton('Reset');
      resetButton.position(10, 10);
      resetButton.mousePressed(() => {
        paused = false;
        initMassPoints();
        initSpring();
        time = 0;
      });
      var pauseButton = p5.createButton('Pause');
      pauseButton.position(10, 35);
      pauseButton.mousePressed(() => {
        paused = !paused;
        pauseButton.html(paused ? 'Resume' : 'Pause');
      });
      p5.createCanvas(600, 600);
      p5.frameRate(60);
    
      initMassPoints();
      initSpring();
    }
    
    p5.draw = () => {
      if (paused) return;
      time += TimeSpeed * (1 / 60);
      p5.background(0);
      updateMassPoints();
      drawSprings();
      drawMassPoints();
    }
    
    function initMassPoints() {
      MassPoints = [];
      for (var x = 0; x < SquareSize; x++) {
        for (var y = 0; y < SquareSize; y++) {
          MassPoints.push({
            position: { x: x * MassPointsGap + 50, y: y * MassPointsGap + 50 },
            velocity: { x: 0, y: 0 },
            Force: { x: 0, y: 0 },
            mass: 1,
          });
        }
      }
    }
    
    function initSpring() {
      Springs = [];
      MassPoints.forEach((massPoint, index) => {
        // right
        if (index % SquareSize !== SquareSize - 1) {
          Springs.push({
            points: [massPoint, MassPoints[index + 1]],
            stiffness: 0.5,
            restLength: MassPointsGap,
            damping: 0.5,
          });
        }
        // bottom
        if (index < MassPoints.length - SquareSize) {
          Springs.push({
            points: [massPoint, MassPoints[index + SquareSize]],
            stiffness: 0.5,
            restLength: MassPointsGap,
            damping: 0.5,
          });
        }
        // bottom right
        if (index < MassPoints.length - SquareSize && index % SquareSize !== SquareSize - 1) {
          Springs.push({
            points: [massPoint, MassPoints[index + SquareSize + 1]],
            stiffness: 0.5,
            restLength: MassPointsGap * Math.sqrt(2),
            damping: 0.5,
          });
        }
        // bottom left
        if (index < MassPoints.length - SquareSize && index % SquareSize !== 0) {
          Springs.push({
            points: [massPoint, MassPoints[index + SquareSize - 1]],
            stiffness: 0.5,
            restLength: MassPointsGap * Math.sqrt(2),
            damping: 0.5,
          });
        }
      });
    }
    
    function updateMassPoints() {
      Springs.forEach((spring) => {
        var Fs = spring.stiffness * (Math.abs(p5.dist(
          spring.points[0].position.x, spring.points[0].position.y,
          spring.points[1].position.x, spring.points[1].position.y,
        )) - spring.restLength)
      });
    
      MassPoints.forEach((massPoint) => {
        massPoint.velocity = {
          x: massPoint.velocity.x + (massPoint.Force.x * time) / massPoint.mass,
          y: massPoint.velocity.y + (massPoint.Force.y * time) / massPoint.mass,
        };
        massPoint.position = {
          x: massPoint.position.x + massPoint.velocity.x * time,
          y: massPoint.position.y + massPoint.velocity.y * time,
        };
    
        if (massPoint.position.y > 592) {
          massPoint.position.y = 592;
          massPoint.velocity.y = 0;   
        }
      });
    }
    
    function drawMassPoints() {
      MassPoints.forEach((massPoint) => {
        p5.fill(255, 0, 0);
        p5.noStroke();
        p5.ellipse(massPoint.position.x, massPoint.position.y, 16);
      });
    }
    
    function drawSprings() {
      Springs.forEach((spring) => {
        p5.stroke(255);
        p5.strokeWeight(2);
        p5.line(
          spring.points[0].position.x,
          spring.points[0].position.y,
          spring.points[1].position.x,
          spring.points[1].position.y
        );
      });
    }
}

export default sketch;