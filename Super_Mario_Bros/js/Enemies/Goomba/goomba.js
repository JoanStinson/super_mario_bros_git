marioBros.goombaPrefab = function(game,x,y,level)
{
    Phaser.Sprite.call(this,game,x,y,'goomba');
    this.animations.add('walk',[0,1],10,true);
    this.deadAnimationGoomba = this.animations.add('died',[2],15);
    this.game.physics.arcade.enable(this);
    this.animations.play('walk');
    //this.body.immovable = true;
    this.speed = 30;
    this.direction = -1;
    this.level = level;
    this.dieGoomba = false;
    this.dieStarOrOnBrickGoomba = false;
    this.body.gravity.y = gameOptions.playerGravity;
    this.body.collideWorldBounds = true;
    this.checkWorldBounds = true;
    this.playerVisible = false;
    this.collPlayerGoomba;
    this.timeCheck;
    this.timeInit;
    this.timeInitChangeToSmall;
    this.timeInitChangeToBig;
    this.changeToSmall = false;
    this.changeToBig = false;
    this.collBrick;
    this.collBrickCoin;
    this.collBrickCoins;
    this.collBrickFlowerOrMushroom;
    this.collBrickStar;
    this.collGraphicLayer;
    this.diedOnBrick = false;
    this.touchBrick = false;
    this.score;
};
marioBros.goombaPrefab.prototype = Object.create(Phaser.Sprite.prototype);
marioBros.goombaPrefab.prototype.constructor = marioBros.goombaPrefab;

function collisionBricksGoomba(player, brick) {
    this.touchBrick = true;
    if((brick.body.touching.down && player.body.touching.up) && (this.touchBrick)){
        this.diedOnBrick = true;
        console.log("mggfgol");
    }
    
}

marioBros.goombaPrefab.prototype.update = function(){
    this.timeCheck = this.game.time.now;    
    
    if(!this.dieStarOrOnBrickGoomba){
       this.collGraphicLayer = this.game.physics.arcade.collide(this,this.level.graphicLayer);
    }
    else{
        //tiempo que tarda en morir (animacion)
        if(this.timeCheck>= this.timeInit + 300){
            this.kill();
        }
    }
    
    if(!this.dieGoomba){
        if(!this.dieStarGoomba){
           this.collPlayerGoomba = this.game.physics.arcade.collide(this, this.level.player,this.collisionPlayerGoomba, null, this);
        }

        this.collBrick = this.game.physics.arcade.collide(this, this.level.brick, collisionBricksGoomba,null,this);
        this.collBrickCoin = this.game.physics.arcade.collide(this, this.level.brickCoin);
        this.collBrickCoins = this.game.physics.arcade.collide(this, this.level.brickCoinsA);
        this.collBrickFlowerOrMushroom = this.game.physics.arcade.collide(this, this.level.brickFlowerOrMushroom);
        this.collBrickStar = this.game.physics.arcade.collide(this, this.level.brickStar);
    }else{
        if(this.timeCheck>= this.timeInit + 150){
            this.kill();
        }
    }
    
    //tiempo de invulnerabilidad al pasar de grande a pequeño
    if(this.timeCheck>= this.timeInitChangeToSmall + 2000 && this.changeToSmall){
        this.changeToSmall = false;
    }
    
    //tiempo de invulnerabilidad al pasar de fier mario a big mario
    else if(this.timeCheck>= this.timeInitChangeToBig + 2000 && this.changeToBig){
        this.changeToBig = false;
    }
    
    if(this.body.blocked.right || this.body.blocked.left){
        this.direction *= -1;        
    }
    
    if(this.game.physics.arcade.distanceBetween(this, this.level.player) < 400 || this.playerVisible){
        if(!this.playerVisible){
           this.playerVisible = true;
        }
        this.body.velocity.x = this.speed * this.direction;
    }
};



marioBros.goombaPrefab.prototype.collisionPlayerGoomba = function() {
    if(this.body.touching.up && this.level.player.body.touching.down){
        this.level.player.body.velocity.y -= 200; //mini jump al matar al goomba
        this.dieGoomba = true;
        this.animations.stop();
        this.deadAnimationGoomba = this.animations.play('died');
        this.timeInit = this.game.time.now;
    }
    else{
        //daño al jugador
        if(!this.level.player.bigMario && !this.level.player.marioStar && !this.changeToSmall){
           this.level.player.die = true;
        }
        else if(this.level.player.bigMario && !this.level.player.marioStar && !this.level.player.marioFlower && !this.changeToBig){
            this.level.player.bigMario = false; 
            this.level.player.animations.stop();
            this.level.player.loadTexture('marioSmall');
            this.level.player.body.setSize(16, 16);
            this.timeInitChangeToSmall = this.game.time.now;
            this.changeToSmall = true;
        }
        else if(this.level.player.marioFlower && !this.level.player.marioStar)
        {
            this.level.player.marioFlower = false;
            this.level.player.bigMario = true;
            this.level.player.animations.stop();
            this.level.player.loadTexture('marioBig');
            this.level.player.body.setSize(16, 32);
            this.timeInitChangeToBig = this.game.time.now;
            this.changeToBig = true;
        }
        if(this.level.player.marioStar || this.diedOnBrick){
            //tiempo en morir
            this.timeInit = this.game.time.now;
            this.dieStarOrOnBrickGoomba = true;
            this.angle = -180;
        }
    }
};