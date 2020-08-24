pi = Math.PI
pi2 = pi*2
pid2 = pi/2

dir = (p1,p2)=>{
  return Math.atan2(p2.y-p1.y,p2.x-p1.x)
}
dist = (p1,p2)=>{
  return Math.hypot(p2.y-p1.y,p2.x-p1.x)
}

flex={}
flex.quality = 10

class Point{
  constructor(x=0,y=0){
	this.x = x
	this.y = y
	
	//Кусок кода для отладки
	/*
	ctx.fillStyle = 'rgba(0,100,255,0.1)'
	ctx.beginPath()
	ctx.arc(W/2+x,H/2+y,3,0,7)
	ctx.closePath()
	ctx.fill()
	ctx.fillStyle = '#000'
	*/
  }
}


class Brush{
  constructor(x,y){
	this.x = x
	this.y = y
	this.path = []
	this.path.push(new Point(x,y))
  }
  move(x,y){
	this.x+=x
	this.y+=y
	this.path.push(new Point(this.x,this.y))
  }
  moveDistDir(dist,dir){
	this.x+=dist*Math.cos(dir)
	this.y+=dist*Math.sin(dir)
	this.path.push(new Point(this.x,this.y))
  }
  moveTo(x,y){
	this.x=x
	this.y=y
	this.path.push(new Point(this.x,this.y))
  }
}


Shape = {
  draw(ctx){
	ctx.beginPath()
	for(let i = 0; i < this.path.length; i++){
ctx.lineTo(this.x+this.path[i].x,this.y+this.path[i].y)
	}
	ctx.closePath()
  },
  fill(ctx){
	this.draw(ctx)
	ctx.fill()
  },
  stroke(ctx){
	this.draw(ctx)
	ctx.stroke()
  },
  
  
  
  translateX(r=0){
	this.path = this.path.map(p=>new Point(p.x+r,p.y))
  },
  translateY(r=0){
	this.path = this.path.map(p=>new Point(p.x,p.y+r))
  },
  translate(rx,ry){
	this.path = this.path.map(p=>new Point(p.x+rx,p.y+ry))
  },
  sqewX(r){
	let h = this.h||this.r2||this.r
	if(this instanceof Star){
	  h = this.r1>this.r2?this.r1:this.r2
	}
	this.path = this.path.map(p=>new Point(p.x+r*p.y/h,p.y))
  },
  sqewY(r){
	let w = this.w||this.r1||this.r
	if(this instanceof Star){
	  w = this.r1>this.r2?this.r1:this.r2
	}
	this.path = this.path.map(p=>new Point(p.x,p.y+r*p.x/w))
  },
  rotate(d){
	let Dir = 0
	let Dist = 0

	this.path = this.path.map(p=>{
	  Dir = dir(new Point(0,0),new Point(p.x,p.y))
	  Dist = dist(new Point(0,0),new Point(p.x,p.y))
	  
	  return new Point(Math.cos(Dir+d)*Dist,Math.sin(Dir+d)*Dist)
	})
  },
  inflate(r=0,c=0){
	let Dir = 0
	let Dist = 0
	let R = r
	
	this.path = this.path.map(p=>{
	
	  Dir = dir(new Point(0,0),new Point(p.x,p.y))
	  Dist = dist(new Point(0,0),new Point(p.x,p.y))
	  R = c?r * (this.R/2/Dist):r
	  
	  return new Point(Math.cos(Dir)*(Dist+R),Math.sin(Dir)*(Dist+R))
	})
  },
  twist(r){
	let Dir = 0
	let Dist = 0
	let R = r / this.R
	
	this.path = this.path.map(p=>{
	
	  Dir = dir(new Point(0,0),new Point(p.x,p.y))
	  Dist = dist(new Point(0,0),new Point(p.x,p.y))
	  
	  return new Point(Math.cos((Dir)+R*Dist)*Dist,Math.sin((Dir)+R*Dist)*Dist)
	})
  },
  scaleX(s){
	this.path = this.path.map(p=>new Point(p.x*s,p.y))
  },
  scaleY(s){
	this.path = this.path.map(p=>new Point(p.x,p.y*s))
  },
  scale(s){
	this.path = this.path.map(p=>new Point(p.x*s,p.y*s))
  },
  reset(){
    this.build(flex.quality)
  }
}




class Ellipse{
  constructor(x=0,y=0,r1=0,r2=0){
	this.x = x
	this.y = y
	
	this.r1 = r1
	this.r2 = r2
	
	this.R = r1>r2?r1:r2
	
	this.P = pi2*Math.sqrt((this.r1**2+this.r2**2)/2)
	
	this.path = []
	this.build(flex.quality)
  }
  build(q=1){
	this.path = []
	let P = Math.floor(this.P/q)
	P = P<12?12:P
	
	for(let i = 0; i < P; i++){
	  this.path.push(new Point(Math.cos(i/P*pi2)*this.r1,Math.sin(i/P*pi2)*this.r2))
	}
  }
}
Object.assign(Ellipse.prototype,Shape)


class Rect{
  constructor(x=0,y=0,w=0,h=0,r=0){
	this.x = x
	this.y = y
	
	this.w = w
	this.h = h
	
	this.r = r
	
	this.R = Math.hypot(w,h)/2
	
	this.path = []
	this.build(flex.quality)
  }
  build(q=1){
	let b = new Brush(this.w/2,this.h/2)
	let Px = Math.floor(this.w/q)
	let Py = Math.floor(this.h/q)
	Px = Px<3?3:Px
	Py = Py<3?3:Py
	for(let i = 0; i < Px; i++){
	  b.moveDistDir(this.w/Px,pi)
	}
	for(let i = 0; i < Py; i++){
	  b.moveDistDir(this.h/Py,pi+pid2)
	}
	for(let i = 0; i < Px; i++){
	  b.moveDistDir(this.w/Px,0)
	}
	for(let i = 0; i < Py; i++){
	  b.moveDistDir(this.h/Py,pid2)
	}
	this.path = b.path
  }
}
Object.assign(Rect.prototype,Shape)


class Triangle{
  constructor(x,y,w,h){
	this.x = x
	this.y = y
	
	this.w = w
	this.h = h
	
	this.R = h/2>Math.hypot(h/2,w/2)?h/2:Math.hypot(h/2,w/2)
	
	this.path = []
	this.build(flex.quality)
  }
  build(q){
	let b = new Brush(this.h/2,0)
	let asside = dist(new Point(this.h/2,0),new Point(-this.h/2,this.w/2))
	let Pa = Math.floor(asside/q)
	let Pb = Math.floor(this.w/q)
	
	Pa = Pa<3?3:Pa
	Pb = Pb<3?3:Pb
	
	for(let i = 0; i < Pa; i++){
	  b.moveDistDir(asside/Pa,dir(new Point(this.h/2,0),new Point(-this.h/2,this.w/2)))
	}
	for(let i = 0; i < Pb; i++){
	  b.moveDistDir(this.w/Pb,-pid2)
	}
	for(let i = 0; i < Pa; i++){
	  b.moveDistDir(asside/Pa,dir(new Point(-this.h/2,-this.w/2),new Point(this.h/2,0)))
	}
	
	this.path = b.path
  }
}
Object.assign(Triangle.prototype,Shape)



class Polygone{
  constructor(x,y,r,n){
	this.x = x
	this.y = y
	
	this.r = r
	this.n = n<3?3:n
	
	this.R = r
	
	this.path = []
	this.build(flex.quality)
  }
  build(q){
	let b = new Brush(this.r,0)
	let asside = this.r*Math.sin(pi/this.n)*2
	let Pa = Math.floor(asside/q)
	Pa = Pa<3?3:Pa
	for(let i = 0; i < this.n; i++){
	  for(let j = 0; j < Pa; j++){
		b.moveDistDir(asside/Pa,dir(
		new Point(this.r*Math.cos(i*pi2/this.n),this.r*Math.sin(i*pi2/this.n)),
	   new Point(this.r*Math.cos((i+1)*pi2/this.n),this.r*Math.sin((i+1)*pi2/this.n))
		))
	  }
	}
	this.path = b.path
  }
}
Object.assign(Polygone.prototype,Shape)

class Star{
  constructor(x,y,r1,r2,n){
	this.x = x
	this.y = y
	
	this.r1 = r1
	this.r2 = r2
	
	this.R = r1>r2?r1:r2
	
	this.n = n<2?2:n
	
	this.path = []
	this.build(flex.quality)
  }
  build(q){
	let b = new Brush(this.r1,0)
	let asside = dist(
		new Point(this.r1*Math.cos(0*pi2/this.n),this.r1*Math.sin(0*pi2/this.n)),
	   new Point(this.r2*Math.cos(0.5*pi2/this.n),this.r2*Math.sin(0.5*pi2/this.n)))
	let Pa = Math.floor(asside/q)
	Pa = Pa<3?3:Pa
	for(let i = 0; i < this.n; i++){
	  for(let j = 0; j < Pa; j++){
		b.moveDistDir(asside/Pa,
		dir(
		new Point(this.r1*Math.cos(i*pi2/this.n),this.r1*Math.sin(i*pi2/this.n)),
	   new Point(this.r2*Math.cos((i+0.5)*pi2/this.n),this.r2*Math.sin((i+0.5)*pi2/this.n)))
	   )
	  }
	  for(let j = 0; j < Pa; j++){
		b.moveDistDir(asside/Pa,
		
		dir(
		new Point(this.r2*Math.cos((i+0.5)*pi2/this.n),this.r2*Math.sin((i+0.5)*pi2/this.n)),
	   new Point(this.r1*Math.cos((i+1)*pi2/this.n),this.r1*Math.sin((i+1)*pi2/this.n))
		)
		
		)
	  }
	}
	this.path = b.path
  }
}
Object.assign(Star.prototype,Shape)
