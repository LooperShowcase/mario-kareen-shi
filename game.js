kaboom({
    global: true,
    fullscreen: true,
    clearColor: [0, 0.7, 1, 1],
    debug: true,
    scale: 2,
});
loadRoot("./sprites/");
loadSprite("mario", "mario.png");
loadSprite("block", "ground (3).png");
loadSprite("coin", "coin.png");
loadSprite("surprise", "surprise.png");
loadSprite("goomba", "evil_mushroom.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("pipe_up", "pipe2.png");
loadSprite("mushroom", "mushroom.png");
loadSprite('star','star.png');
loadSprite('cloud','cloud.png');
loadSprite('heart','heart.png');
loadSprite('castle','castle.png');
loadSprite('shrubbery','shrubbery.png')
loadSprite('princess','princes.png')

loadSound("gameSound", "gameSound.mp3");
loadSound("jumpSound", "jumpSound.mp3");
//loadSound('gameoverSound',"gameover.mp3")//

scene('begin', () => {
    add([text('Welcome to Super Mario\nPress enter to start playing!!', 30),
    origin('center'),
    pos(width() / 2, height() / 2 + 70),
    scale(0.2),]);


    keyRelease('enter', () => {
        go('game');
    });

})

scene('game-over', (score) => {
    //play('gameoverSound')//
    add([text('kareen\nGame over!\nScore: '+ score, 30),
    origin("center"),
    pos(width() / 2, height() / 2),
    keyRelease('enter',()=>{
        go('game');
    })

    ])
});
scene('win',(score)=> {
    add([text('Congrats you won!!!\n Score: '+score, 30),
    origin('center'),
    pos(width()/2, height()/2),
    keyRelease('enter',()=>{
        go('game');
    })
])
})

scene("game", () => {
    play("gameSound");
    layers(['bg', 'obj', 'ui'], 'obj');
    const symbolmap = {
        width: 20,
        height: 20,

        "=": [sprite('block'), solid(), scale(1.3)],
        "$": [sprite("surprise"), solid(), "surprise-coin"],
        "+": [sprite("surprise"), solid(), "surprise-mushroom"],
        M: [sprite("mushroom"), body(), 'mushroom'],
        C: [sprite('coin'), 'coin'],
        "%": [sprite("unboxed"), solid()],
        "*": [sprite("goomba"), solid(), body(), "goomba"],
        "^":[sprite('pipe_up'),solid()],
        '@':[sprite('star'),solid(),layer('bg')],
        "-":[sprite('cloud'),scale(3,2),layer('bg')],
        "3":[sprite('heart'),solid(),layer('bg')],
        '{':[sprite('castle'),layer('bg'),'castle'],
        "1":[sprite('shrubbery'),solid(),layer('bg'),scale(1.3)],
        '~':[sprite('princess')]

    };

    const map = [
        "                                                             ",
        "                                                             ",
        "                    -                                        ",
        "       -                               -                     ",
        "                        3                                    ",
        "           = + =      = = =       3          -               ",
        "   -       =    =   =     =                                  ",
        "           =     = =      =                  3        -      ",
        "       @    = +   =      =     *   -                         ",
        "     $==+    =      $   =    $===+                           ",
        "              $        =               -                     ",
        "                = C  =                        3              ",
        "          +=      ==       $==$             =====       3    ",
        "      C      3                                               ",
        "     ===               ==+          *                  {     ",
        "               ===+                 ==                       ",
        "                                                             ",
        "    CCC   1       *      1      ^   *              1     ~   ",
        "==============================================   ============",
        "==============================================   ============",
        "==============================================   ============",
        "==============================================   ============",
        "==============================================   ============",

    ];
    const speed = 250;
    const jumpForce = 400;
    let isJumping = false;
    const falldown = 500;
    let goombaSpeed=-20;
    let score=0;
    const scoreLabel= add([
        text('Score:'+ score),
        pos(50,10),
        layer('ui'),
        {
         value:score
        },
    ]);

    const player = add([
        sprite("mario"),
        solid(),
        pos(80, 0),
        body(),
        origin("bot"),
        big(jumpForce),
    ]);



    keyDown("right", () => {
        player.move(speed, 0);
    });
    keyDown("left", () => {
        if (player.pos.x > 10) {
            player.move(-speed, 0);

        }
    });
    keyPress("space", () => {
        if (player.grounded()) {
            play("jumpSound");
            player.jump(jumpForce)
            isJumping = true;
        }

        player.on('headbump', (obj) => {
            if (obj.is("surprise-mushroom")) {
                gameLevel.spawn('M', obj.gridPos.sub(0, 1));
                destroy(obj);
                gameLevel.spawn("%", obj.gridPos);


            }
            player.on('headbump', (obj) => {
                if (obj.is("surprise-coin")) {
                    gameLevel.spawn("C", obj.gridPos.sub(0, 1));
                    destroy(obj);
                    gameLevel.spawn('%', obj.gridPos);
                }
            })
        });

    });



    player.collides('coin', (x) => {
        destroy(x);
        scoreLabel.value +=1;
        scoreLabel.text= 'Score: '+scoreLabel.value;

    });


    player.collides('mushroom', (y) => {
        destroy(y);
        scoreLabel.value +=100;
        scoreLabel.text= 'Score: '+scoreLabel.value;
        player.biggify(5);
    });

    action('mushroom', (mush) => {
        mush.move(25, 0);

    });
    action('goomba', (g) => {
        g.move(goombaSpeed, 0)
    })

    player.collides('goomba', (g) => {
        if (isJumping == true) {
            destroy(g);
            scoreLabel.value +=500;
        scoreLabel.text= 'Score: '+scoreLabel.value;

        } else if (player.isBig()) {
            player.smallify();
        }
        else { go("game-over",scoreLabel.value); }
    })
    loop(3 , () => {
        goombaSpeed=goombaSpeed*-1;

    });

    

    player.action(() => {
        
        camPos(player.pos.x, 200);
        if(player.pos.x>=1142.2992500000005){
            go('win',scoreLabel.value)
        }
        console.log(player.pos.x);
        scoreLabel.pos.x=player.pos.x-200;
        if (player.grounded()) {
            isJumping = false;
        } else {
            isJumping = true;
        }
        if (player.pos.y >= falldown) {
            go('game-over', scoreLabel.value);
        }
        
    });


    const gameLevel = addLevel(map, symbolmap);
});



start("game");