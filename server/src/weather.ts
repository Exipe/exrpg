import { BrightnessPacket } from "./connection/outgoing-packet"
import { playerHandler } from "./world"

const MIN_BRIGHTNESS = 0.25, MAX_BRIGHTNESS = 0.75

export function initWeather() {
    const weatherHandler = new WeatherHandler()
    weatherHandler.updateBrightness()

    setInterval(() => {
        weatherHandler.tick()
    }, 60 * 1000)
    return weatherHandler
}

export class WeatherHandler {

    public enableClock = true

    private _brightness: number

    public set brightness(brightness: number) {
        this._brightness = brightness
        playerHandler.broadcast(new BrightnessPacket(brightness))
    }

    public get brightness() {
        return this._brightness
    }

    public tick() {
        if(!this.enableClock) {
            return
        }

        this.updateBrightness()
    }

    public updateBrightness(date = new Date()) {
        const h = date.getHours() + date.getMinutes() / 60

        let brightness = h / 12
        if(h >= 12) {
            brightness = 2 - brightness
        }

        this.brightness = MIN_BRIGHTNESS + (MAX_BRIGHTNESS - MIN_BRIGHTNESS) * brightness
    }

}