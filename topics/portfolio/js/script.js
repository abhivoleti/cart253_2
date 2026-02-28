var txt ="............................    ...........     ...........     ...........      ...........     ...........    ...........  ...........  ........... ..........  ";    

var font;


function preload(){
font = loadFont('assets/IBMPlexSans-Bold.ttf');
}
function setup(){
    createCanvas(windowWidth,windowHeight, WEBGL);
    frameRate(55);
}

function draw(){


    let eyeX= map(mouseX,0,width,-1200,1200);
    let eyeY= map(mouseY,0,width,-1200,1200);
    let eyeZ=(height/2.0)/ tan((PI*30.0)/180.0)
    let centerX=0;
    let centerY=0;
    let centerZ=0;
    let upX=0;
    let upY=1;
    let upZ=0;
    camera(eyeX, eyeY, eyeZ, centerX,centerY, centerZ,upX,upY,upZ);
    for(let i=0;i<17;i++);{


    var last =  txt[txt.length-1];
    txt = last + txt;
    txt= txt.substr(0,txt.length-1);
       }



background("#4400FF");
fill("255");
textFont(font);
textSize(39);

textAlign(x, y);

var amp = mouseX*0.1;

       for(let i=0; i< txt.length; i++){
        
        var ch= txt[i];
        var x =sin(radians(frameCount+i*10*2))*250;
        var y =cos(radians(frameCount+i*amp*1))*250;  
        var z =cos(radians(frameCount+i*amp*1.5))*250;  



push();
translate(x,y);
text (ch,19,0); 
x +=1;
y +=1;
pop();
       }
}
