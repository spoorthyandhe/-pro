var dog,happydog,foodS, database;
var foodstock;
var dogImg;
var feed,addfood;
var fedTime,lastFed;
var gameState;
var gameState , readState

function preload(){

dogImg=loadImage("dogImg.png");
doghappy=loadImage("dogImg1.png");
washroom=loadImage("Wash Room.png");
bedroom=loadImage("Bed Room.png");
garden=loadImage("Garden.png");
}

function setup(){

  database = firebase.database();
  console.log(database);
 
readState=database.ref('gameState');
readState.on("value",function(data){
  gameState=data.val();
})

  createCanvas(1000,400);

  dog=createSprite(800,200,150,150);
  dog.addImage(dogImg);
   dog.scale=0.15;

  var foodstock = database.ref('food');
  foodstock.on("value", readStock);

  foodobj=new Food();

  feed = createButton('Feed the dog');
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addfood  = createButton('Add the Food');
  addfood.position(800, 95);
addfood.mousePressed(addFood);
}

function draw(){
  background(46,139,87);

currentTime=hour();
if(currentTime==(lastFed+1)){
  update("playing");
  foodobj.garden();
}else if(currentTime==(lastFed+2)){
  update("sleeping");
  foodobj.bedroom();
}else if(currentTime>(lastFed+2) && currentTime <=(lastFed+4)){
  update("bathing");
  foodobj.washroom();
} else{
  update("hungry")
  foodobj.display();
}

if(gameState!="hungry"){
feed.hide();
addfood.hide();
dog.remove();
} 
else{
feed.show();
addfood.show();
dog.addImage(dogImg);
}

drawSprites();

    foodobj.display();

}

function readStock(data){
foodS=data.val();
foodobj.updateFoodStock(foodS)
}

function addFood(){
  foodS++;
  database.ref('/').update({
    food:foodS
  })
}

function feedDog(){
  dog.addImage(doghappy);

  foodobj.updateFoodStock(foodobj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodobj.getFoodStock(),
    fedTime:hour(),
gameState:"hungry"
  })
}

function update(state){
 database.ref('/').update({
gameState:state
})
}