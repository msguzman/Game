var app={
  inicio: function(){
    DIAMETRO_BOLA = 50;
    dificultad = 0;
    velocidadX = 0;
    velocidadY = 0;
    puntuacion = 0;
    alto  = document.documentElement.clientHeight;
    ancho = document.documentElement.clientWidth;  
    app.vigilaSensores();
    app.iniciaJuego();
  },

  iniciaJuego: function(){

    function preload() {
      game.physics.startSystem(Phaser.Physics.ARCADE);

      game.load.image('bola', 'assets/ship.png');
      game.load.image('objetivo', 'assets/boom.png');
      game.load.image('wizball', 'assets/bubble.png');
      game.load.image('disk', 'assets/bubble.png');
      game.load.spritesheet('spinner', 'assets/bubble.png', 32, 32);
    }

    function create() {
      scoreText = game.add.text(16, 16, puntuacion, { fontSize: '25px', fill: '#757676' });
      objetivo = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo');
      bola = game.add.sprite(app.inicioX(), app.inicioY(), 'bola');
      game.physics.arcade.enable(bola);
      game.physics.arcade.enable(objetivo);
      bola.body.collideWorldBounds = true;
      bola.body.onWorldBounds = new Phaser.Signal();
      bola.body.onWorldBounds.add(app.decrementaPuntuacion, this);


      sprites = game.add.physicsGroup(Phaser.Physics.ARCADE);
      for (var i = 0; i < 5; i++)
      {
          var s = sprites.create(game.rnd.integerInRange(100, 700), game.rnd.integerInRange(32, 200), 'spinner');
          s.animations.add('spin', [0, 1, 2, 3]);
          s.play('spin', 20, true);
          s.body.velocity.set(game.rnd.integerInRange(-200, 200), game.rnd.integerInRange(-100, 200));
      }

      sprites.setAll('body.collideWorldBounds', true);
      sprites.setAll('body.bounce.x', 1);
      sprites.setAll('body.bounce.y', 1);

      game.physics.startSystem(Phaser.Physics.ARCADE);
      disk = game.add.sprite(80, 0, 'disk');
      ball1 = game.add.sprite(100, 240, 'wizball');
      ball2 = game.add.sprite(700, 240, 'wizball');
      game.physics.arcade.enable([disk, ball1, ball2]);
      ball1.body.setCircle(45);
      ball2.body.setCircle(45);
      ball1.body.collideWorldBounds = true;
      ball2.body.collideWorldBounds = true;
      disk.body.collideWorldBounds = true;
      ball1.body.bounce.set(1);
      ball2.body.bounce.set(1);
      disk.body.bounce.set(1);
      ball1.body.gravity.y = 100;
      ball2.body.gravity.y = 100;
      disk.body.gravity.y = 100;
      ball1.body.velocity.set(150);
      ball2.body.velocity.set(-200, 60);
      disk.body.velocity.set(50);


    }

    function update(){
      var factorDificultad = (300 + (dificultad * 100));
      bola.body.velocity.y = (velocidadY * factorDificultad);
      bola.body.velocity.x = (velocidadX * (-1 * factorDificultad));
      game.physics.arcade.overlap(bola, objetivo, app.incrementaPuntuacion, null, this);

      game.physics.arcade.collide(ball1, ball2);
      game.physics.arcade.collide(ball1, disk);
      game.physics.arcade.collide(ball2, disk);
      game.physics.arcade.collide(bola, disk);
      game.physics.arcade.collide(bola, ball1);
      game.physics.arcade.collide(bola, ball2);
      game.physics.arcade.collide(bola,sprites);
      game.physics.arcade.collide(sprites);
    }

    function render () {
      game.debug.body(disk);
      game.debug.body(ball1);
      game.debug.body(ball2);
    }

    var estados = { preload: preload, create: create, update: update };
    var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser',estados);
  },

  decrementaPuntuacion: function(){
    puntuacion = puntuacion +1;
    scoreText.text = puntuacion;
  },

  incrementaPuntuacion: function(){
    puntuacion = puntuacion+1;
    scoreText.text = puntuacion;

    objetivo.body.x = app.inicioX();
    objetivo.body.y = app.inicioY();

    if (puntuacion > 0){
      dificultad = dificultad + 1;
    }
  },

  inicioX: function(){
    return app.numeroAleatorioHasta(ancho - DIAMETRO_BOLA );
  },

  inicioY: function(){
    return app.numeroAleatorioHasta(alto - DIAMETRO_BOLA );
  },

  numeroAleatorioHasta: function(limite){
    return Math.floor(Math.random() * limite);
  },

  vigilaSensores: function(){
    
    function onError() {
        console.log('onError!');
    }

    function onSuccess(datosAceleracion){
      app.detectaAgitacion(datosAceleracion);
      app.registraDireccion(datosAceleracion);
    }

    navigator.accelerometer.watchAcceleration(onSuccess, onError,{ frequency: 10 });
  },

  detectaAgitacion: function(datosAceleracion){
    var agitacionX = datosAceleracion.x > 10;
    var agitacionY = datosAceleracion.y > 10;

    if (agitacionX || agitacionY){
      setTimeout(app.recomienza, 1000);
    }
  },

  recomienza: function(){
    document.location.reload(true);
  },

  registraDireccion: function(datosAceleracion){
    velocidadX = datosAceleracion.x ;
    velocidadY = datosAceleracion.y ;
  }

};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
}