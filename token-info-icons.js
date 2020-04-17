class TokenInfoIcons {

	static async addSpeedButton(app, html, data) {
        
        let actor = game.actors.get(data.actorId);
        if (actor === undefined)
            return;
                
        let speed = actor.data.data.attributes.speed.value;

        var cleanspeed = speed.replace(/Walk /g, "").replace(/Fly /g, "").replace(/Swim /g, "").replace(/Climb /g, "").replace(/ ft. /g, "/").replace(/ft./g, "").replace(/ft/g, "");

        //console.log("TokenInfoIcons | Actor?", actor);

        let newdiv = '<div class="chalkdiv">';
        
        let sbutton = '<div class="control-icon chalkicon" title="Speed: ' + speed + '"><i class="fas fa-shoe-prints"></i> ' + cleanspeed + '</div>';
       
        html.find('.attribute.elevation').wrap(newdiv);
        html.find('.attribute.elevation').before(sbutton);
        
    }

    static async addPerceptionButton(app, html, data) {
        
        let actor = game.actors.get(data.actorId);
        if (actor === undefined)
            return;
                
        let perception = 10 + actor.data.data.skills.prc.mod;

        let newdiv = '<div class="chalkdiv">';

        let pbutton = $('<div class="control-icon chalkicon" title="Passive Perception: ' + perception + '"><i class="fas fa-eye"></i> ' + perception + '</div>');

        html.find('.control-icon.target').wrap(newdiv);
        html.find('.control-icon.target').before(pbutton);

    }

    static async addACButton(app, html, data) {
        
        let actor = game.actors.get(data.actorId);
        if (actor === undefined)
            return;
                
        let ac = (isNaN(parseInt(actor.data.data.attributes.ac.value)) || parseInt(actor.data.data.attributes.ac.value) === 0) ? 10 : parseInt(actor.data.data.attributes.ac.value);

        let newdiv = '<div class="chalkdiv">';

        let pbutton = $('<div class="control-icon chalkicon" title="Armor Class: ' + ac + '"><i class="fas fa-shield-alt"></i> ' + ac + '</div>');

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