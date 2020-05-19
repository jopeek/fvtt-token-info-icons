class TokenInfoIcons {

	static async addSpeedButton(app, html, data) {
        
        let actor = game.actors.get(data.actorId);
        if (actor === undefined)
            return;
        
        let speed = game.world.system === "pf1" ? actor.data.data.attributes.speed.land.total : actor.data.data.attributes.speed.value;
        let cleanspeed = speed;

        try {
            cleanspeed = cleanspeed.replace(/Walk /g, "").replace(/Fly /g, "").replace(/Swim /g, "").replace(/Burrow /g, "").replace(/Climb /g, "").replace(/ feet /g, "/").replace(/feet/g, "").replace(/ ft. /g, "/").replace(/ft./g, "").replace(/ft/g, "");
        } catch {
            
        }

        //console.log("TokenInfoIcons | Actor?", actor);

        let newdiv = '<div class="token-info-container">';
        
        let sbutton = '<div class="control-icon token-info-icon" title="Speed: ' + speed + '"><i class="fas fa-shoe-prints"></i> ' + cleanspeed + '</div>';
       
        html.find('.attribute.elevation').wrap(newdiv);
        html.find('.attribute.elevation').before(sbutton);
        
    }

    static async addPerceptionButton(app, html, data) {
        
        let actor = game.actors.get(data.actorId);
        if (actor === undefined) return;
        let perception = 10;

        if (game.world.system === "pf1") {
            perception = actor.data.data.skills.per.mod
        } else if (game.world.system === "pf2e") {
            const proficiency = actor.data.data.attributes.perception.rank ? actor.data.data.attributes.perception.rank * 2 + actor.data.data.details.level.value : 0;
            perception = perception + actor.data.data.abilities[actor.data.data.attributes.perception.ability].mod + proficiency + actor.data.data.attributes.perception.item;
        } else {
            perception = perception + actor.data.data.skills.prc.total;
        }
        
        let newdiv = '<div class="token-info-container">';

        let pbutton = $('<div class="control-icon token-info-icon" title="Passive Perception: ' + perception + '"><i class="fas fa-eye"></i> ' + perception + '</div>');

        html.find('.control-icon.target').wrap(newdiv);
        html.find('.control-icon.target').before(pbutton);

    }

    static async addACButton(app, html, data) {
        
        let actor = game.actors.get(data.actorId);
        if (actor === undefined)
            return;

        let ac = 10
        if (game.world.system === "pf1") {
          ac = actor.data.data.attributes.ac.normal.total
        } else {
          ac = (isNaN(parseInt(actor.data.data.attributes.ac.value)) || parseInt(actor.data.data.attributes.ac.value) === 0) ? 10 : parseInt(actor.data.data.attributes.ac.value);
        }

        let newdiv = '<div class="token-info-container">';

        let pbutton = $('<div class="control-icon token-info-icon" title="Armor Class: ' + ac + '"><i class="fas fa-shield-alt"></i> ' + ac + '</div>');

        html.find('.control-icon.config').wrap(newdiv);
        html.find('.control-icon.config').before(pbutton);

    }

}

Hooks.on('ready', () => {
    if (game.user.isGM) {
        Hooks.on('renderTokenHUD', (app, html, data) => { TokenInfoIcons.addSpeedButton(app, html, data) });
	    Hooks.on('renderTokenHUD', (app, html, data) => { TokenInfoIcons.addACButton(app, html, data) });
	    Hooks.on('renderTokenHUD', (app, html, data) => { TokenInfoIcons.addPerceptionButton(app, html, data) });
    }
	
});

console.log("Token Info Icons loaded");
