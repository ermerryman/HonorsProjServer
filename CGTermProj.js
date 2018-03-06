"use strict";

var canvas;
var gl;

var NumVertices  = 36;

var texSize = 64;

var program;

var pointsArray = [];
var colorsArray = [];
var imageArray = [];
var texCoordsArray = [];

var texture;
var currText = 0;

var texCoord = [
    vec2(0, 1),
    vec2(0, 0),
    vec2(1, 0),
    vec2(1, 1),
];

var vertices = [
    vec4( -0.75, -0.75,  0.75, 1.0 ),
    vec4( -0.75,  0.75,  0.75, 1.0 ),
    vec4( 0.75,  0.75,  0.75, 1.0 ),
    vec4( 0.75, -0.75,  0.75, 1.0 ),
    vec4( -0.75, -0.75, -0.75, 1.0 ),
    vec4( -0.75,  0.75, -0.75, 1.0 ),
    vec4( 0.75,  0.75, -0.75, 1.0 ),
    vec4( 0.75, -0.75, -0.75, 1.0 )
];

var vertexColors = [
    vec4( 1.0, 1.0, 1.0, 1.0 ), 
    vec4( 1.0, 1.0, 1.0, 1.0 ), 
    vec4( 1.0, 1.0, 1.0, 1.0 ),
    vec4( 1.0, 1.0, 1.0, 1.0 ), 
    vec4( 1.0, 1.0, 1.0, 1.0 ),  
    vec4( 1.0, 1.0, 1.0, 1.0 ),  
    vec4( 1.0, 1.0, 1.0, 1.0 ),  
    vec4( 1.0, 1.0, 1.0, 1.0 )   
];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var axis = 0;
var theta = [ 0, 0, 0 ];

var thetaLoc;

function configureTexture( image ) {
    texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}

function quad(a, b, c, d) {
     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[b]);
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[1]);

     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[2]);

     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[2]);

     pointsArray.push(vertices[d]);
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[3]);
}

function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
	
	colorCube();

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );
	
	var image1 = document.getElementById("i1");
	var image2 = document.getElementById("i2");
	var image3 = document.getElementById("i3");
	imageArray.push(image1);
	imageArray.push(image2);
	imageArray.push(image3);
    
    configureTexture( imageArray[currText] );
 
    thetaLoc = gl.getUniformLocation(program, "theta");

    render();
	
	document.getElementById( "left" ).onclick = function () {
        console.log(currText);
		if(currText==2){currText=0;}
		else{currText+=1;}
		configureTexture( imageArray[currText] );
		render();
    };
	document.getElementById( "right" ).onclick = function () {
        console.log(currText);
		if(currText==0){currText=2;}
		else{currText-=1;}
		configureTexture( imageArray[currText] );
		render();
    };
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    theta[axis] += 0.0;
    gl.uniform3fv(thetaLoc, theta);

    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    requestAnimFrame( render );
}
