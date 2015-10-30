var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameContainer');




var mainState = {
  shoot: function(){
    var bullet = this.game.add.sprite(this.player.x, this.player.y, 'bullet');
    game.physics.arcade.enable(bullet);
    bullet.scale.setTo(0.08, 0.08);
    bullet.body.velocity.x = 450;
    this.bullets.push(bullet);
  },
  takeDamage: function(key){
    this.enemies[key].destroy();
    this.enemies[key].x = 100;
    this.player.health--;
    console.log(this.player.health)
    if ( this.player.health === 0 ) {
      this.player.destroy();
      alert('you ded bruh');
    }
  },
  spawn: function () {
    var enemy = this.game.add.sprite(750, Math.floor(Math.random()*500)+50, 'enemy');
    game.physics.arcade.enable(enemy);
    enemy.body.collideWorldBounds = true;
    enemy.scale.setTo(1, 1);
    enemy.health = 3;
    enemy.body.velocity.x = -250;
    this.enemies[this.enemyId] = enemy;
    this.enemyId++;
  },

  preload: function () {
    game.stage.backgroundColor = '#666';
    game.load.image('player', 'assets/hrlogo.png'); 
    game.load.image('ground', 'assets/ground.png');
    game.load.image('bullet', 'assets/player.png');
    game.load.image('enemy', 'assest/wall.png');
  },

  create: function () {
    pewPew = _.throttle(this.shoot.bind(this), 100);
    takeOneDamage = _.throttle(this.takeDamage.bind(this), 50);

    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.bullets = [];
    this.enemies = {};
    this.enemyId = 0;

    this.player = this.game.add.sprite(100, 245, 'player');
    game.physics.arcade.enable(this.player);
    //this.player.body.gravity.y = 1000; 
    //this.player.body.bounce.y = 0.5;
    this.player.body.collideWorldBounds = true;
    this.player.scale.setTo(0.2, 0.2);
    this.player.health = 10;

    // this.enemy = this.game.add.sprite(300, 400, 'enemy');
    // game.physics.arcade.enable(this.enemy);
    // this.enemy.body.collideWorldBounds = true;
    // this.enemy.scale.setTo(1, 1);
    // this.enemy.health = 3;
    // this.enemy.velocity.x = 300;

    var spawnEnemies = setInterval(this.spawn.bind(this), 500);

    // this.platforms = game.add.group();
    // this.platforms.enableBody = true;
    // this.ground = [];
    // for (var i = 0; i < game.world.width; i+=70) {
    //   this.ground.push(this.platforms.create(i, game.world.height - 70, 'ground'));
    // }
    // this.platforms.forEach(function(platform) {
    //   platform.body.immovable = true;
    // });
    
  },
  update: function () {
    for (var i = 0; i < this.bullets.length; i++) {
      for ( var key in this.enemies ) {
        game.physics.arcade.collide(this.enemies[key], this.bullets[i], function () {
          this.bullets[i].destroy();
          this.enemies[key].health--;
          if ( this.enemies[key].health === 0 ) {
            this.enemies[key].destroy();
          }
        }.bind(this));
      }
    }
    for( var key in this.enemies){
      if ( this.enemies[key].x === 0 ) {
        takeOneDamage(key);
      }
    }

    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;

    var cursors = game.input.keyboard.createCursorKeys();
    var shootKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    if (cursors.left.isDown)
    {
        this.player.body.velocity.x = -300;
    }
    else if (cursors.right.isDown)
    {
        this.player.body.velocity.x = 300;
    }
    if (cursors.up.isDown)
    {
        this.player.body.velocity.y = -300;
    } else if (cursors.down.isDown){
      this.player.body.velocity.y = 300;
    }
    
    if ( shootKey.isDown ) {
      console.log(this.player.x);
      console.log('first enemy x = ' + this.enemies[0].x);
      pewPew();
    }


  }
};

game.state.add('main', mainState);
game.state.start('main');