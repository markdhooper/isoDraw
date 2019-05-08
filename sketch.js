/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/ 
/* Program:     isoDraw                                       */
/* Programmer:  Mark Hooper                                   */
/* Description: An isometric paint like application.          */
/*              Intent was to be able to generate isometric   */
/*              line drawings to serve as a template with     */
/*              which to draw buildings for an RPG campaign   */
/*              I'm making.                                   */
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

//to do: 
// add erase, add 3 view


let res = 20.0;
let numPts = 0;
let points = [];
let ptRad = 2;
let isoMetric = true;
let selPoint = -1;
let sens = 5;
let ptsz = 5;

let hOff;

let numLines = 0;
let lines = [];

let x1 = 0.0;
let y1 = 0.0;
let x2 = 0.0;
let y2 = 0.0; 

let locked = false;

let preLine;

let grid = false;
let gridLines = [];
let xgrid = 0;
let ygrid = 0;


class pt{
  constructor(x,y,radx,rady){
    this.x = x;
    this.y = y;
    this.radx = radx;
    this.rady = rady;
    this.xIso = hOff + (x-y)*res*cos(30);
    this.yIso = (x+y)*sin(30)*res;
    this.xCart = x*res;
    this.yCart = y*res;
  }
  
  drawIso(r,g,b,grow) {
    fill(r,g,b);
    stroke(r,g,b);
    strokeWeight(ptsz);
    if(grow)
      ellipse(this.xIso, this.yIso, ptsz*2, ptsz*2);
    else
      ellipse(this.xIso, this.yIso, this.radx, this.rady);
  }
  drawCart(r,g,b,grow) {
    fill(r,g,b);
    stroke(r,g,b);
    strokeWeight(ptsz);
    if(grow)
      ellipse(this.xCart, this.yCart, ptsz*2, ptsz*2);
    else
      ellipse(this.xCart, this.yCart, this.radx, this.rady);
  }
}

class ln{
  constructor(X1,Y1,X2,Y2){
    this.X1 = X1;
    this.Y1 = Y1;
    this.X2 = X2;
    this.Y2 = Y2;
    
    this.X1Cart = X1*res;
    this.Y1Cart = Y1*res;
    this.X2Cart = X2*res;
    this.Y2Cart = Y2*res;
    
    this.X1Iso = hOff + (X1-Y1)*res*cos(30);
    this.Y1Iso = (X1+Y1)*sin(30)*res;
    this.X2Iso = hOff + (X2-Y2)*res*cos(30);
    this.Y2Iso = (X2+Y2)*sin(30)*res;
    
    // console.log("norm ",this.X1,this.Y1,this.X2,this.Y2);
    // console.log("cart ",this.X1Cart,this.Y1Cart,this.X2Cart,this.Y2Cart);
    // console.log("iso ",this.X1Iso,this.Y1Iso,this.X2Iso,this.Y2Iso);
  }
  
  draw(r,g,b,s=2) {
    fill(r,g,b);
    stroke(r,g,b);
    strokeWeight(s);
    line(this.X1, this.Y1, this.X2, this.Y2);
    strokeWeight(1);
  }
  
    drawCart(r,g,b,s=2) {
    fill(r,g,b);
    stroke(r,g,b);
    strokeWeight(s);
    line(this.X1Cart, this.Y1Cart, this.X2Cart, this.Y2Cart);
    strokeWeight(1);
  }
    drawIso(r,g,b,s=2) {
    fill(r,g,b);
    stroke(r,g,b);
    strokeWeight(s);
    line(this.X1Iso, this.Y1Iso, this.X2Iso, this.Y2Iso);
    strokeWeight(1);
  }
  
}




/*  Create normalized cartesian coordinates */
function genPoints(){
  for(i = 0; i <= int(width/res); i++){
    for(j = 0; j <= int(height/res); j++){
      points[numPts++] = new pt(float(i),float(j),ptRad,ptRad);
    }
  }
} 

function genGrid(){
  for(i = 0; i <= int(width/res); i++){
    gridLines[xgrid++] = new ln(i,0,i,int(height/res));
  }
  for(j = 0; j <= int(height/res); j++){
    gridLines[xgrid + ygrid++] = new ln(0,j,int(width/res),j);
  }
}

function setup() {
  createCanvas(800, 600);
  hOff = width/2;
  angleMode(DEGREES);
  genPoints();
  preLine = new ln(-1,-1,-1,-1);
  genGrid();
}

function draw(){
  background(220);
  if(isoMetric){
      if(grid){
      //Draw isometric grid
      for(i = 0; i < xgrid; i++){
        gridLines[i].drawIso(255,200,200,1);
      }
      for(i = xgrid; i < xgrid+ygrid; i++){
        gridLines[i].drawIso(200,255,200,1);
      }
      
    }
    updatePointsIso();
    //draw lines in isometric 
    for(i = 0; i < numLines; i++){
      lines[i].drawIso(0,0,0,2);
    }

    
  }else{
      if(grid){
      //Draw cartesian grid
      for(i = 0; i < xgrid; i++){
        gridLines[i].drawCart(255,200,200,1);
      }
      for(i = xgrid; i < xgrid+ygrid; i++){
        gridLines[i].drawCart(200,255,200,1);
      }
    }
    updatePointsCart();
    //draw lines in cartesian 
    for(i = 0; i < numLines; i++){
      lines[i].drawCart(0,0,0,2);
    }


    
  }
  
  //draw preview lines
  if(locked){
    stroke(128,128,128)
    strokeWeight(2);
    preLine.draw(128,128,128,2);
  }
}

function keyTyped(){
  if(key == 'i'){
    isoMetric = true;
  }else if(key == 'c'){
    isoMetric = false;
  }else if(key == 'g'){
    grid = !grid;
  }
}


function mousePressed() {
  if(selPoint != -1){
    locked = true;
    x1 = points[selPoint].x;
    y1 = points[selPoint].y; 
    preLine.X1 = isoMetric ? points[selPoint].xIso : points[selPoint].xCart;
    preLine.Y1 = isoMetric ? points[selPoint].yIso : points[selPoint].yCart;
    preLine.X2 = preLine.X1;
    preLine.Y2 = preLine.Y1;
  }else{
    locked = false;
  }
}

function mouseDragged() {
  if (locked) {
    preLine.X2 = mouseX;
    preLine.Y2 = mouseY;
  }
}

function mouseReleased() {
  x2 = points[selPoint].x;
  y2 = points[selPoint].y;
  lines[numLines++] = new ln(x1,y1,x2,y2);
  locked = false;
}

function updatePointsIso(){
 //display mode is set to ISOMETRIC
    for(i = 0; i < numPts; i++){
      //draw the isometric points
      if((mouseX + sens >= points[i].xIso)&&
         (mouseX -sens <= points[i].xIso)&&
         (mouseY + sens >= points[i].yIso)&&
         (mouseY -sens <= points[i].yIso)){
          points[i].drawIso(0,0,0,1);
          selPoint = i;
      }else{
          points[i].drawIso(255,255,255,0);
      }
    }
}

function updatePointsCart(){
 //display Mode is CARTESIAN
    for(i = 0; i < numPts; i++){
      //draw the cartesian points
      if((mouseX + sens >= points[i].xCart)&&
         (mouseX -sens <= points[i].xCart)&&
         (mouseY + sens >= points[i].yCart)&&
         (mouseY -sens <= points[i].yCart)){
          points[i].drawCart(0,0,0,1);
          selPoint = i;
      }else{
          points[i].drawCart(255,255,255,0);
      }
    } 
}
