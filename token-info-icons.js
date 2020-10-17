class TokenInfoIcons {


    static async addTokenInfoButtons(app, html, data) {
        
        let actor = canvas.tokens.get(data._id).actor;
        //let actor = game.actors.get(data.actorId);
        if (actor === undefined) return;

        let ac = 10
        if (game.world.system === "pf1") {
          ac = actor.data.data.attributes.ac.normal.total
        } else {
          ac = (isNaN(parseInt(actor.data.data.attributes.ac.value)) || parseInt(actor.data.data.attributes.ac.value) === 0) ? 10 : parseInt(actor.data.data.attributes.ac.value);
        }

        let perception = 10;
        if (game.world.system === "pf1") {
            perception = actor.data.data.skills.per.mod
        } else if (game.world.system === "pf2e") {
            const proficiency = actor.data.data.attributes.perception.rank ? actor.data.data.attributes.perception.rank * 2 + actor.data.data.details.level.value : 0;
            perception = perception + actor.data.data.abilities[actor.data.data.attributes.perception.ability].mod + proficiency + actor.data.data.attributes.perception.item;
        } else {
            perception = actor.data.data.skills.prc.passive;
        }

        let speed = game.world.system === "pf1" ? actor.data.data.attributes.speed.land.total : actor.data.data.attributes.speed.value;
        let cleanspeed = speed;

        try {
            cleanspeed = cleanspeed.replace(/Walk /g, "").replace(/Fly /g, "").replace(/Swim /g, "").replace(/Burrow /g, "").replace(/Climb /g, "").replace(/ feet /g, "/").replace(/feet/g, "").replace(/ ft. /g, "/").replace(/ft./g, "").replace(/ft/g, "");
        } catch {
            
        }

        let newdiv = '<div class="token-info-container">';

        let position = game.settings.get("token-info-icons", "position");

        let buttons = $('<div class="col token-info-column-' + position + '"><div class="control-icon token-info-icon" title="Speed: ' + speed + '"><i class="fas fa-shoe-prints"></i> ' + cleanspeed + '</div><div class="control-icon token-info-icon" title="Armor Class: ' + ac + '"><i class="fas fa-shield-alt"></i> ' + ac + '</div><div class="control-icon token-info-icon" title="Passive Perception: ' + perception + '"><i class="fas fa-eye"></i> ' + perception + '</div></div>');

        html.find('.col.left').wrap(newdiv);
        html.find('.col.left').before(buttons);
    }

}

Hooks.on('ready', () => {
    let gmOnly = game.settings.get("token-info-icons", "gmOnly");

    if (gmOnly) {
        if (game.user.isGM) {
            Hooks.on('renderTokenHUD', (app, html, data) => { TokenInfoIcons.addTokenInfoButtons(app, html, data) });
        }
    } else {
        Hooks.on('renderTokenHUD', (app, html, data) => { TokenInfoIcons.addTokenInfoButtons(app, html, data) });
    }
    
	
});

Hooks.once("init", () => {
	game.settings.register("token-info-icons", "gmOnly", {
		name: "GM only?",
		hint: "Show the token info to the GM only or to all players?",
		scope: "world",
		config: true,
		default: true,
		type: Boolean
    });
    
    const choices = new Array("Left", "Right");

    game.settings.register("token-info-icons", "position", {
		name: "Token Position",
		hint: "Which side of the token should the info appear on?",
        scope: "world",
        config: true,
		type: String,
        default: "left",
        choices: {
            "left": "left",
            "right": "right",
        }
	});
});

console.log("Token Info Icons loaded");
