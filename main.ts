type NavData = {
    dir: string,
    vx: number,
    vy: number,
    image: Image,    
}

let DIR = [
"0,-1",
"1,-1",
"1,0",
"1,1",
"0,1",
"-1,1",
"-1,0",
"-1,-1"
]

class Ship {
    padx: number = 0
    pady: number = 0
    face: NavData
    fly: NavData
    navData: NavData[]

    constructor(
        public sprite: Sprite        
    ) {
        sprite.setStayInScreen(true)
    }

    generateNavData(v: number, images: Image[]) {
        const sv = v
        const dv = sv / Math.sqrt(2)        

        this.navData = [
            { dir: '0,-1', vx: 0, vy: -sv, image: images[0] },
            { dir: '1,-1', vx: dv, vy: -dv, image: images[1] },
            { dir: '1,0', vx: sv, vy: 0, image: images[2] },
            { dir: '1,1', vx: dv, vy: dv, image: images[3] },
            { dir: '0,1', vx: 0, vy: sv, image: images[4] },
            { dir: '-1,1', vx: -dv, vy: dv, image: images[5] },
            { dir: '-1,0', vx: -dv, vy: 0, image: images[6] },
            { dir: '-1,-1', vx: -dv, vy: -dv, image: images[7] },
        ]

        this.face = this.navData[0]
    }

    update() {
        if (
            controller.left.isPressed() ||
            controller.right.isPressed() ||
            controller.up.isPressed() ||
            controller.down.isPressed()
        ) {
            if (controller.left.isPressed()) {
                this.padx = -1
            } else if (controller.right.isPressed()) {
                this.padx = 1
            } else {
                this.padx = 0
            }

            if (controller.up.isPressed()) {
                this.pady = -1
            } else if (controller.down.isPressed()) {
                this.pady = 1
            } else {
                this.pady = 0
            }

            const dir = `${this.padx},${this.pady}`
            this.face = this.navData.find(data => data.dir == dir)

            this.sprite.setImage(this.face.image)
        }

        if (controller.B.isPressed()) {
            this.fly = this.face
            this.sprite.vx = this.fly.vx
            this.sprite.vy = this.fly.vy
            this.sprite.fx = Math.abs(this.fly.vx)
            this.sprite.fy = Math.abs(this.fly.vy)
        }
    }
}

class Asteroid {
    constructor(public sprite: Sprite, v: number) {
        sprite.x = Math.randomRange(0, scene.screenWidth())
        sprite.y = Math.randomRange(0, scene.screenHeight())
        
        sprite.setStayInScreen(true)
        sprite.setBounceOnWall(true)

        const a = Math.PI * 2 * Math.random()
        sprite.vx = Math.sin(a) * v
        sprite.vy = Math.cos(a) * v
    }
}

const me = new Ship(sprites.create(assets.image`ship0`, SpriteKind.Player))
me.generateNavData(75, [assets.image`ship0`, assets.image`ship1`, assets.image`ship2`, assets.image`ship3`, assets.image`ship4`, assets.image`ship5`, assets.image`ship6`, assets.image`ship7`])

for (let index = 0; index < 10; index++) {
    let asteroids = []
    asteroids.push(new Asteroid(sprites.create(assets.image`asteroid0`, SpriteKind.Enemy), 30))
}

game.onUpdate(function () {
    me.update()
})
