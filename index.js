const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0,0,canvas.width, canvas.height);
const gravity = 0.1;

const background = new Sprite({position: {x: 0, y: 0}, imageSrc: './img/background_layer_1.png'})
const background2 = new Sprite({position: {x: 0, y: 0}, imageSrc: './img/background_layer_2.png'})
const background3 = new Sprite({position: {x: 0, y: 0}, imageSrc: './img/background_layer_3.png'})
const player = new Fighter({position:{x:0, y:0 },velocity: {x:0, y:0} ,imageSrc: './img/player/Idle.png',scale: 3.5,framesMax: 8,offset:{x:50,y:220},
sprites:{idle: {imageSrc: './img/player/Idle.png',framesMax:8},run: {imageSrc: './img/player/Run.png',framesMax:8},
jump: {imageSrc:'./img/player/Jump.png',framesMax:2},fall: {imageSrc:'./img/player/Fall.png',framesMax: 2}, 
attack1: {imageSrc:'./img/player/Attack1.png', framesMax: 4}},attackBox:{offset:{x:270,y:20},width: 200, height: 50}});

player.draw();

const enemy = new Fighter({position:{x:400, y:100 },velocity: {x:0, y:0} ,imageSrc: './img/Enemy/Idle.png',scale: 3.5,framesMax: 10,offset:{x:50,y:153},
sprites:{idle: {imageSrc: './img/Enemy/Idle.png',framesMax:10},run: {imageSrc: './img/Enemy/Run.png',framesMax:6},
jump: {imageSrc:'./img/Enemy/Jump.png',framesMax:2}, fall: {imageSrc:'./img/Enemy/Fall.png',framesMax: 2}, 
attack1: {imageSrc:'./img/Enemy/Attack1.png', framesMax: 4}},attackBox:{offset:{x:-20,y:20},width: 170, height: 50}});

enemy.draw();

const keys = {
    a:{pressed: false},
    d:{pressed: false},
    ArrowRight:{pressed: false},
    ArrowLeft: {pressed: false}
}



decreaseTimer()

function animate(){
window.requestAnimationFrame(animate)
c.fillStyle = 'black';
c.fillRect(0,0,canvas.width, canvas.height);
background.update();
background2.update();
background3.update();
player.update();
enemy.update();

player.velocity.x = 0;
enemy.velocity.x = 0;


if(keys.a.pressed && player.lastKey === 'a'){
    player.velocity.x = -1
    player.switchSprite('run');
}else if(keys.d.pressed && player.lastKey === 'd'){
    player.velocity.x = 1;
    player.switchSprite('run');
}else{
    player.switchSprite('idle');
}

if(player.velocity.y<0){
player.switchSprite('jump');
}else if(player.velocity.y > 0){
    player.switchSprite('fall')
}




if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
    enemy.velocity.x = -1
    enemy.switchSprite('run')
}else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
    enemy.velocity.x = 1;
    enemy.switchSprite('run')

}else{
    enemy.switchSprite('idle')
}

if(enemy.velocity.y<0){
    enemy.switchSprite('jump');
    }else if(enemy.velocity.y > 0){
        enemy.switchSprite('fall')
    }

//detect collolision
if(rectangularCollision({rectangle1: player,
rectangle2: enemy})
    && player.isAttacking
    &&player.framesCurrent===2){
    player.isAttacking = false;
    enemy.health -= 20;
    document.querySelector('#enemyHealth').style.width = enemy.health + '%'
}

if(player.isAttacking && player.framesCurrent === 2){
    player.isAttacking = false;
}

if(rectangularCollision({rectangle1: enemy,
    rectangle2: player})
        && enemy.isAttacking
        &&enemy.framesCurrent===1){
        enemy.isAttacking = false;
        player.health -= 20;
    document.querySelector('#playerHealth').style.width = player.health + '%'
}

if(enemy.isAttacking && enemy.framesCurrent === 1){
        enemy.isAttacking = false;
}

if(enemy.health<= 0|| player.health <= 0){
determineWinner({player,enemy},timerId)
}
}



animate();

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd';
        break;
        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a';
        break;
        case 'w':
            player.velocity.y = -6;
        break;
        case 'y': 
            player.attack();
            break;


        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
        break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
        break;
        case 'ArrowUp':
            enemy.velocity.y = -6;
        break;
        case 'o': 
            enemy.attack();
            break;
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false;
        break;
        case 'a':
        keys.a.pressed = false;
        break;

        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
        break;
        case 'ArrowLeft':
        keys.ArrowLeft.pressed = false;
        break;
    }
})