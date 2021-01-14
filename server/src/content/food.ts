
import { Food } from "../item/food-handler";
import { actionHandler } from "../world";

function addFood(item: string, food: Food) {
    actionHandler.onItem(item, (player, action, slot) => {
        if(action != "eat") {
            return
        }

        player.foodHandler.eat(slot, food)
    })
}

export function initFood() {
    addFood("apple", {
        "heal": 25,
        "delay": 15_555
    })
}