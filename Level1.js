Game.Level1 = function(game) {};

var map;
var layer;
var player;
var controls = {};
var playerSpeed = 150;
var jumpTimer = 0;
var button;

Game.Level1.prototype = {
    create: function() {
        this.stage.backgroundColor = '#3A5963';
        this.physics.arcade.gravity.y = 1400;
        map = this.add.tilemap('map');
        map.addTilesetImage('tileset');
        layer = map.createLayer(0);
        layer.resizeWorld();

        map.setCollisionBetween(1, 3);
        //Tạo va cham của người chơi với bẫy
        map.setTileIndexCallback(6, this.resetPlayer, this);

        //Tạo ca chạm của người chơi với Coins
        map.setTileIndexCallback(7, this.getCoin, this);

        player = this.add.sprite(100, 550, 'player');
        player.anchor.setTo(0.5, 0.5);

        //Tao chuyen dong cho nguoi choi
        player.animations.add('idle', [0, 1], 1, true);
        player.animations.add('jump', [2], 1, true);
        player.animations.add('run', [3, 4, 5, 6, 7, 8], 7, true);
        this.physics.arcade.enable(player);
        this.camera.follow(player);
        player.body.collideWorldBounds = true;

        //Tạo bộ diều khiển cho người chơi
        controls = {
            right: this.input.keyboard.addKey(Phaser.Keyboard.D),
            left: this.input.keyboard.addKey(Phaser.Keyboard.A),
            up: this.input.keyboard.addKey(Phaser.Keyboard.W)
        };

        //Tạo button hiển thị trên màn hình
        button = this.add.button(this.world.centerX - 40, this.world.centerY + 210, 'buttons', function() {
            console.log('Pressed!!!');
        }, this, 2, 1, 0);
        button.fixedToCamera = true;
    },

    update: function() {
        this.physics.arcade.collide(player, layer);
        player.body.velocity.x = 0;

        if (controls.right.isDown) {
            player.animations.play('run');
            //Thiết lập chiều của hình
            player.scale.setTo(1, 1);
            player.body.velocity.x += playerSpeed;
        }

        if (controls.left.isDown) {
            player.animations.play('run');
            player.scale.setTo(-1, 1);
            player.body.velocity.x -= playerSpeed;
        }

        if (controls.up.isDown && (player.body.onFloor() || player.body.touching.down) && this.time.now > jumpTimer) {
            player.body.velocity.y = -700;
            jumpTimer = this.time.now + 750;
            player.animations.play('jump');
        }

        //Kiểm tra nếu người chơi không di chuyển thì dừng animations
        if (player.body.velocity.x === 0 && player.body.velocity.y === 0) {
            player.animations.play('idle');
        }
    },

    resetPlayer: function() {
        player.reset(100, 550);
    },
    getCoin: function() {
        map.putTile(-1, layer.getTileX(player.x), layer.getTileY(player.y));
        // console.log(layer.getTileX(player.x));
        // console.log(layer.getTileY(player.y));
    }
};
