import Phaser from 'phaser'
import { getAbility } from '../data/abilities'
import { classifyFear, FearCategory } from '../data/fears'

type SceneData = {
  fearText?: string
  strengths?: string[]
}

const OUTLINE = 0x151735
const CREAM = 0xfff5d6
const PINK = 0xff6fae
const SKY = 0x202b5b
const SKY_DARK = 0x111737
const GRASS = 0x6cdb8f
const GRASS_LIGHT = 0xa7ef91
const SOIL = 0xa95e55
const SOIL_DARK = 0x713f4d

export default class OvercomingScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Container
  private obstacleGroup!: Phaser.GameObjects.Container
  private successScenery!: Phaser.GameObjects.Container
  private statusText!: Phaser.GameObjects.Text
  private isJumping = false
  private resolved = false
  private obstacleActive = false
  private speed = 190
  private groundY = 0
  private obstacleHeight = 48
  private runEvent?: Phaser.Time.TimerEvent

  constructor(config?: Phaser.Types.Scenes.SettingsConfig) {
    super(config)
  }

  init(data: SceneData) {
    this.data.set('fearText', data.fearText || '')
    this.data.set('strengths', data.strengths || [])
    this.isJumping = false
    this.resolved = false
    this.obstacleActive = false
  }

  create() {
    const w = this.scale.width
    const h = this.scale.height
    this.groundY = h - 74

    this.drawWorld(w, h)
    this.successScenery = this.createSuccessScenery(w)
    this.player = this.createHero(126, this.groundY)
    this.obstacleGroup = this.add.container(w + 80, this.groundY)

    const fearText = (this.data.get('fearText') as string) || 'the unknown'
    this.drawFear(classifyFear(fearText), fearText)

    this.statusText = this.pixelText(w / 2, 20, 'TIME YOUR JUMP', 10, CREAM)
      .setOrigin(0.5, 0)
      .setDepth(20)

    this.input.keyboard?.on('keydown-SPACE', this.doJump, this)
    this.input.keyboard?.on('keydown-UP', this.doJump, this)
    this.input.on('pointerdown', this.doJump, this)
    window.addEventListener('overcoming:jump', this.doJumpBound)
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.shutdown, this)

    this.time.delayedCall(700, () => {
      this.obstacleActive = true
      this.statusText.setText('FEAR APPROACHING...')
    })

    this.runEvent = this.time.addEvent({
      delay: 16,
      loop: true,
      callback: this.updateRun,
      callbackScope: this
    })
  }

  private drawWorld(w: number, h: number) {
    this.add.rectangle(0, 0, w, h, SKY).setOrigin(0)
    this.add.rectangle(0, 0, w, Math.floor(h * 0.42), SKY_DARK).setOrigin(0)

    for (let i = 0; i < 28; i++) {
      const x = (i * 83 + 19) % Math.max(w, 1)
      const y = 14 + ((i * 47) % Math.max(Math.floor(h * 0.46), 1))
      const size = i % 4 === 0 ? 4 : 2
      this.add.rectangle(x, y, size, size, i % 5 === 0 ? 0x8ff4e8 : CREAM)
    }

    this.drawPixelMoon(w - 112, 74)
    this.drawPixelCloud(42, 70, 1)
    this.drawPixelCloud(w * 0.42, 110, 0.8)
    this.drawPixelCloud(w - 250, 54, 0.65)

    const hill = this.add.graphics()
    hill.fillStyle(0x425b83)
    hill.fillPoints([
      new Phaser.Geom.Point(0, this.groundY),
      new Phaser.Geom.Point(0, this.groundY - 62),
      new Phaser.Geom.Point(54, this.groundY - 104),
      new Phaser.Geom.Point(116, this.groundY - 50),
      new Phaser.Geom.Point(196, this.groundY - 88),
      new Phaser.Geom.Point(290, this.groundY),
    ], true)
    hill.fillStyle(0x334874)
    hill.fillPoints([
      new Phaser.Geom.Point(w * 0.52, this.groundY),
      new Phaser.Geom.Point(w * 0.65, this.groundY - 82),
      new Phaser.Geom.Point(w * 0.77, this.groundY - 36),
      new Phaser.Geom.Point(w * 0.88, this.groundY - 110),
      new Phaser.Geom.Point(w, this.groundY - 48),
      new Phaser.Geom.Point(w, this.groundY),
    ], true)

    this.add.rectangle(0, this.groundY, w, 74, SOIL).setOrigin(0)
    this.add.rectangle(0, this.groundY, w, 12, OUTLINE).setOrigin(0)
    this.add.rectangle(0, this.groundY - 8, w, 8, GRASS_LIGHT).setOrigin(0)
    this.add.rectangle(0, this.groundY, w, 8, GRASS).setOrigin(0)

    for (let x = 14; x < w; x += 34) {
      this.add.rectangle(x, this.groundY + 25 + (x % 3) * 8, 16, 8, SOIL_DARK)
      this.add.rectangle(x + 10, this.groundY + 49, 10, 7, 0xd37a62)
    }
  }

  private drawPixelMoon(x: number, y: number) {
    const moon = this.add.container(x, y)
    const pixels = [
      [-32, -24, 64, 48], [-24, -32, 48, 64], [-36, -16, 72, 32],
      [-18, -18, 10, 12], [12, -8, 12, 16], [-6, 14, 14, 8]
    ]
    pixels.forEach((p, index) => {
      moon.add(this.add.rectangle(p[0], p[1], p[2], p[3], index < 3 ? CREAM : 0xd8cda9).setOrigin(0))
    })
  }

  private drawPixelCloud(x: number, y: number, scale: number) {
    const cloud = this.add.container(x, y).setScale(scale)
    const shadow = 0x52638b
    const blocks = [
      [-8, 8, 100, 16, shadow], [8, -8, 70, 24, 0x7180a3],
      [28, -20, 36, 24, 0x8e9ab8], [-24, 0, 32, 20, 0x7180a3],
      [70, 0, 28, 20, 0x8e9ab8]
    ]
    blocks.forEach(([px, py, pw, ph, color]) => {
      cloud.add(this.add.rectangle(px, py, pw, ph, color).setOrigin(0))
    })
  }

  private createSuccessScenery(w: number) {
    const scenery = this.add.container(0, 0).setDepth(1).setAlpha(0)
    scenery.add(this.add.rectangle(0, 0, w, this.groundY, 0x65c9e8).setOrigin(0))
    scenery.add(this.add.rectangle(0, this.groundY - 8, w, 16, 0x9bea83).setOrigin(0))

    const sun = this.add.container(w - 105, 72)
    sun.add(this.add.rectangle(-30, -22, 60, 44, 0xffdf69).setOrigin(0))
    sun.add(this.add.rectangle(-22, -30, 44, 60, 0xffdf69).setOrigin(0))
    sun.add(this.add.rectangle(-36, -4, 72, 8, 0xffdf69).setOrigin(0))
    sun.add(this.add.rectangle(-4, -36, 8, 72, 0xffdf69).setOrigin(0))
    scenery.add(sun)

    const dayClouds = [
      [42, 72, 1],
      [w * 0.42, 112, 0.75],
      [w - 285, 55, 0.6]
    ]
    dayClouds.forEach(([x, y, scale]) => {
      const cloud = this.add.container(x, y).setScale(scale)
      const blocks = [
        [-8, 8, 100, 16, 0xb4e2ea], [8, -8, 70, 24, 0xeafaff],
        [28, -20, 36, 24, 0xffffff], [-24, 0, 32, 20, 0xeafaff],
        [70, 0, 28, 20, 0xffffff]
      ]
      blocks.forEach(([px, py, pw, ph, color]) => {
        cloud.add(this.add.rectangle(px, py, pw, ph, color).setOrigin(0))
      })
      scenery.add(cloud)
    })

    for (let i = 0; i < 5; i++) {
      const bird = this.add.container(-80 - i * 55, 72 + (i % 3) * 28)
      bird.add(this.add.rectangle(0, 4, 8, 4, OUTLINE).setOrigin(0))
      bird.add(this.add.rectangle(8, 0, 8, 4, OUTLINE).setOrigin(0))
      bird.add(this.add.rectangle(16, 4, 8, 4, OUTLINE).setOrigin(0))
      scenery.add(bird)
      this.tweens.add({
        targets: bird,
        x: w + 110,
        duration: 3800 + i * 360,
        delay: 350 + i * 170,
        repeat: -1
      })
    }

    return scenery
  }

  private createHero(x: number, feetY: number) {
    const hero = this.add.container(x, feetY).setDepth(10)
    const strengths = (this.data.get('strengths') as string[]) || []
    const capeColors = strengths.map(name => getAbility(name)?.color || PINK)
    if (capeColors.length === 0) capeColors.push(PINK)

    const cape = this.add.container(-18, -50)
    cape.add(this.add.rectangle(0, 0, 28, 42, OUTLINE).setOrigin(0))
    const stripeHeight = Math.floor(36 / capeColors.length)
    capeColors.forEach((color, index) => {
      cape.add(this.add.rectangle(4, 4 + index * stripeHeight, 20, stripeHeight + 1, color).setOrigin(0))
    })
    cape.add(this.add.rectangle(4, 36, 6, 6, capeColors[0]).setOrigin(0))
    cape.add(this.add.rectangle(18, 36, 6, 10, capeColors[capeColors.length - 1]).setOrigin(0))
    hero.add(cape)

    const body = this.add.container(0, 0)
    body.add(this.add.rectangle(-12, -42, 26, 34, OUTLINE).setOrigin(0))
    body.add(this.add.rectangle(-8, -38, 18, 27, 0x4f8cff).setOrigin(0))
    body.add(this.add.rectangle(-14, -67, 30, 26, OUTLINE).setOrigin(0))
    body.add(this.add.rectangle(-10, -63, 22, 18, 0xf3ad78).setOrigin(0))
    body.add(this.add.rectangle(-5, -57, 4, 4, OUTLINE).setOrigin(0))
    body.add(this.add.rectangle(7, -57, 4, 4, OUTLINE).setOrigin(0))
    body.add(this.add.rectangle(-13, -70, 28, 8, 0x372e63).setOrigin(0))
    body.add(this.add.rectangle(-10, -8, 9, 10, OUTLINE).setOrigin(0))
    body.add(this.add.rectangle(6, -8, 9, 10, OUTLINE).setOrigin(0))
    hero.add(body)

    this.tweens.add({ targets: body, y: -2, duration: 190, yoyo: true, repeat: -1, ease: 'Stepped' })
    this.tweens.add({ targets: cape, x: -21, duration: 140, yoyo: true, repeat: -1, ease: 'Stepped' })
    return hero
  }

  private drawFear(type: FearCategory, fearText: string) {
    this.obstacleGroup.removeAll(true)
    const fear = this.add.container(0, 0)

    if (type === 'fire') {
      this.obstacleHeight = 58
      const hoop = this.add.graphics()
      hoop.lineStyle(12, OUTLINE, 1)
      hoop.strokeCircle(0, -38, 34)
      hoop.lineStyle(7, 0xff5b45, 1)
      hoop.strokeCircle(0, -38, 34)
      hoop.lineStyle(3, 0xffd35c, 1)
      hoop.strokeCircle(0, -38, 34)
      fear.add(hoop)
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 * i) / 8
        const flame = this.add.rectangle(Math.cos(angle) * 39, -38 + Math.sin(angle) * 39, 8, 13, i % 2 ? 0xffd35c : 0xff5b45)
        flame.setRotation(angle)
        fear.add(flame)
        this.tweens.add({ targets: flame, scaleY: 1.5, duration: 150 + i * 12, yoyo: true, repeat: -1 })
      }
      fear.add(this.add.rectangle(-39, -5, 12, 9, OUTLINE).setOrigin(0))
      fear.add(this.add.rectangle(27, -5, 12, 9, OUTLINE).setOrigin(0))
    } else if (type === 'mountain') {
      this.obstacleHeight = 54
      const mountain = this.add.graphics()
      mountain.fillStyle(OUTLINE)
      mountain.fillTriangle(-44, 0, 0, -66, 46, 0)
      mountain.fillStyle(0x735071)
      mountain.fillTriangle(-36, -3, 0, -57, 38, -3)
      mountain.fillStyle(0xa96c78)
      mountain.fillTriangle(-9, -3, 13, -36, 38, -3)
      mountain.fillStyle(CREAM)
      mountain.fillTriangle(-12, -39, 0, -57, 12, -39)
      fear.add(mountain)
      fear.add(this.add.rectangle(-10, -23, 7, 7, OUTLINE).setOrigin(0))
      fear.add(this.add.rectangle(10, -23, 7, 7, OUTLINE).setOrigin(0))
      fear.add(this.add.rectangle(-4, -10, 14, 4, OUTLINE).setOrigin(0))
    } else {
      this.obstacleHeight = 48
      fear.setScale(0.72)
      fear.add(this.add.rectangle(-42, -52, 84, 52, OUTLINE).setOrigin(0))
      fear.add(this.add.rectangle(-36, -58, 72, 58, 0x735071).setOrigin(0))
      fear.add(this.add.rectangle(-28, -66, 18, 12, OUTLINE).setOrigin(0))
      fear.add(this.add.rectangle(12, -62, 20, 8, OUTLINE).setOrigin(0))
      fear.add(this.add.rectangle(-30, -50, 12, 12, 0xa86878).setOrigin(0))
      fear.add(this.add.rectangle(14, -46, 10, 10, 0xa86878).setOrigin(0))
      fear.add(this.add.rectangle(-19, -32, 12, 14, CREAM).setOrigin(0))
      fear.add(this.add.rectangle(9, -32, 12, 14, CREAM).setOrigin(0))
      fear.add(this.add.rectangle(-15, -28, 5, 8, OUTLINE).setOrigin(0))
      fear.add(this.add.rectangle(13, -28, 5, 8, OUTLINE).setOrigin(0))
      fear.add(this.add.rectangle(-8, -10, 20, 5, OUTLINE).setOrigin(0))
      fear.add(this.add.rectangle(-34, -4, 14, 8, OUTLINE).setOrigin(0))
      fear.add(this.add.rectangle(22, -4, 14, 8, OUTLINE).setOrigin(0))
    }

    const labelText = fearText.length > 28 ? `${fearText.slice(0, 26)}...` : fearText
    const labelBg = this.add.rectangle(0, -71, Math.min(240, Math.max(104, labelText.length * 6.5)), 24, OUTLINE)
    const label = this.pixelText(0, -72, labelText.toUpperCase(), 7, CREAM).setOrigin(0.5)
    this.obstacleGroup.add([fear, labelBg, label])

    this.tweens.add({ targets: fear, y: -4, duration: 260, yoyo: true, repeat: -1, ease: 'Stepped' })
  }

  private updateRun() {
    if (!this.obstacleActive || this.resolved) return
    this.obstacleGroup.x -= this.speed * 0.016

    const playerX = this.player.x
    const verticalClearance = this.groundY - this.player.y

    if (this.obstacleGroup.x <= playerX) {
      if (verticalClearance >= this.obstacleHeight) this.handleSuccess()
      else this.handleMiss()
    }
  }

  private handleMiss() {
    if (this.resolved) return
    this.obstacleActive = false
    this.cameras.main.shake(180, 0.008)
    this.statusText.setText('NOT YET. TRY AGAIN!')
    this.statusText.setColor('#ffb0c8')
    this.tweens.add({
      targets: this.obstacleGroup,
      alpha: 0,
      duration: 180,
      onComplete: () => {
        this.obstacleGroup.x = this.scale.width + 90
        this.obstacleGroup.alpha = 1
        this.time.delayedCall(650, () => {
          if (this.resolved) return
          this.statusText.setText('FEAR APPROACHING...')
          this.statusText.setColor('#fff5d6')
          this.obstacleActive = true
        })
      }
    })
  }

  private handleSuccess() {
    if (this.resolved) return
    this.resolved = true
    this.obstacleActive = false
    this.statusText.setText('COURAGE UNLOCKED!')
    this.statusText.setColor('#fff5d6')
    this.tweens.add({ targets: this.successScenery, alpha: 1, duration: 900, ease: 'Sine.easeInOut' })
    this.tweens.add({ targets: this.obstacleGroup, alpha: 0, y: this.groundY + 18, duration: 420 })

    const colors = ((this.data.get('strengths') as string[]) || [])
      .map(name => getAbility(name)?.color || PINK)
    if (colors.length === 0) colors.push(PINK, 0x59dbe8, 0xffc857)

    for (let i = 0; i < 28; i++) {
      const particle = this.add.rectangle(
        this.player.x + Phaser.Math.Between(-16, 16),
        this.player.y - Phaser.Math.Between(20, 64),
        Phaser.Math.RND.pick([4, 6, 8]),
        Phaser.Math.RND.pick([4, 6]),
        Phaser.Math.RND.pick(colors)
      ).setDepth(30)
      this.tweens.add({
        targets: particle,
        x: particle.x + Phaser.Math.Between(-130, 150),
        y: particle.y - Phaser.Math.Between(40, 150),
        alpha: 0,
        duration: Phaser.Math.Between(700, 1200),
        ease: 'Quad.easeOut',
        onComplete: () => particle.destroy()
      })
    }

    this.time.delayedCall(2600, () => {
      window.dispatchEvent(new CustomEvent('overcoming:celebration'))
    })
  }

  doJump() {
    if (this.isJumping || this.resolved) return
    this.isJumping = true
    this.tweens.add({
      targets: this.player,
      y: this.groundY - 126,
      duration: 380,
      ease: 'Quad.easeOut',
      yoyo: true,
      hold: 420,
      onComplete: () => {
        this.player.y = this.groundY
        this.isJumping = false
      }
    })
  }

  private pixelText(x: number, y: number, text: string, size: number, color: number) {
    return this.add.text(x, y, text, {
      color: `#${color.toString(16).padStart(6, '0')}`,
      fontFamily: '"Press Start 2P", monospace',
      fontSize: `${size}px`,
      align: 'center',
      resolution: 1
    })
  }

  private doJumpBound = () => {
    this.doJump()
  }

  shutdown() {
    window.removeEventListener('overcoming:jump', this.doJumpBound)
    this.input.keyboard?.off('keydown-SPACE', this.doJump, this)
    this.input.keyboard?.off('keydown-UP', this.doJump, this)
    this.runEvent?.destroy()
  }
}
