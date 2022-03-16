class TokenInfoIcons {
  static async addTokenInfoButtons(app, html, data) {
      let actor = canvas.tokens.get(data._id).actor;
      //let actor = game.actors.get(data.actorId);
      if (actor === undefined) return;

      let ac = 10
      if (game.world.data.system === "pf1") {
          ac = actor.data.data.attributes.ac.normal.total
      }
      else if (game.world.data.system === "dcc") {
            ac = actor.data.data.attributes.ac.value
      } else {
          ac = (isNaN(parseInt(actor.data.data.attributes.ac.value)) || parseInt(actor.data.data.attributes.ac.value) === 0) ? 10 : parseInt(actor.data.data.attributes.ac.value);
      }

      let perceptionTitle = "Passive Perception";
      let perception = 10;
      if (game.world.data.system === "pf1") {
          perception = actor.data.data.skills.per.mod
          perceptionTitle = "Perception Mod";
      } else if (game.world.data.system === "pf2e") {
          perception = perception + actor.data.data.attributes.perception.value;
          perceptionTitle = "Perception DC";
      }
      else if (game.world.data.system === "dcc") {
        perception = 0
        perceptionTitle = "Perception DC";
      }
       else {
          perception = actor.data.data.skills.prc.passive;
      }

      //console.log("TokenInfoIcons", actor);

      let speed = "";

      if (game.world.data.system === "pf2e") {
          if (actor.data.type === "npc") {
              speed = '<span class="token-info-speed" title="Speed"><i class="fas fa-walking"></i><span style="font-size: 0.65em;"> ' + actor.data.data.attributes.speed.value + '</span></span>';
          } else if (actor.data.type === "familiar") {
              // Familiars seem to get either 25 ft. land or water speed
              // It can be modified by other abilities but they will be revising these later so this will likely change
              speed = '<span class="token-info-speed" title="Speed"><i class="fas fa-walking"></i> 25</span>';
          } else {
              speed = '<span class="token-info-speed" title="Land"><i class="fas fa-walking"></i> ' + actor.data.data.attributes.speed.total + '</span>';
          }
      } else if (game.world.data.system === "pf1") {
          speed = '<span class="token-info-speed" title="Land"><i class="fas fa-walking"></i> ' + actor.data.data.attributes.speed.land.total + '</span>';
      } else if (game.world.data.system === "dcc") {
          speed = '<span class="token-info-speed" title="Movement"><i class="fas fa-walking"></i> ' + actor.data.data.attributes.speed.base + '</span>';
      } else {
          if (actor.data.data.attributes.movement.walk != 0 && actor.data.data.attributes.movement.walk != null) speed += '<span class="token-info-speed" title="Walk"><i class="fas fa-walking"></i> ' + actor.data.data.attributes.movement.walk + '<span style="font-size: 0.5em;"> ' + actor.data.data.attributes.movement.units + "</span></span>";
          if (actor.data.data.attributes.movement.swim != 0 && actor.data.data.attributes.movement.swim != null) speed += '<span class="token-info-speed" title="Swim"><i class="fas fa-swimmer"></i> ' + actor.data.data.attributes.movement.swim + '<span style="font-size: 0.5em;"> ' + actor.data.data.attributes.movement.units + "</span></span>";
          if (actor.data.data.attributes.movement.fly != 0 && actor.data.data.attributes.movement.fly != null) speed += '<span class="token-info-speed" title="Fly"><i class="fas fa-crow"></i> ' + actor.data.data.attributes.movement.fly + '<span style="font-size: 0.5em;"> ' + actor.data.data.attributes.movement.units + "</span></span>";
          if (actor.data.data.attributes.movement.burrow != 0 && actor.data.data.attributes.movement.burrow != null) speed += '<span class="token-info-speed" title="Burrow"><i class="fas fa-mountain"></i> ' + actor.data.data.attributes.movement.burrow + '<span style="font-size: 0.5em;"> ' + actor.data.data.attributes.movement.units + "</span></span>";
          if (actor.data.data.attributes.movement.climb != 0 && actor.data.data.attributes.movement.climb != null) speed += '<span class="token-info-speed" title="Climb"><i class="fas fa-grip-lines"></i> ' + actor.data.data.attributes.movement.climb + '<span style="font-size: 0.5em;"> ' + actor.data.data.attributes.movement.units + "</span></span>";
      }

      // DCC luck

      let luck = null;
      if (game.world.data.system === "dcc") {
        if (actor.data.type === "Player") {
          luck =  actor.data.data.abilities.lck.value;
        }
      }

      let newdiv = '<div class="token-info-container">';

      let position = game.settings.get('token-info-icons', 'position');

      let defaultButtons = '<div class="control-icon token-info-icon">' + speed + '</div><div class="control-icon token-info-icon" title="Armor Class: ' + ac + '"><i class="fas fa-shield-alt"></i> ' + ac + '</div>';
      if (game.world.data.system !== "dcc"){
        defaultButtons += '<div class="control-icon token-info-icon" title="Passive Perception: ' + perception + '"><i class="fas fa-eye"></i> ' + perception + '</div>'
      }else{
        // dcc specific
        if(luck != null){
          defaultButtons += '<div class="control-icon token-info-icon" title="Luck: ' + luck + '"><i class="fas fa-star"></i> ' + luck + '</div>'
        }
      }
      

      let passiveSensesButtons = '';
      if (!['pf2e', 'pf1'].includes(game.world.data.system) && game.settings.get('token-info-icons', 'allPassiveSenses')) {
          const investigation = actor.data.data.skills.inv.passive;
          const insight = actor.data.data.skills.ins.passive;
          const stealth = actor.data.data.skills.ste.passive;

          const passiveInvestigationButton = `<div class="control-icon token-info-icon" title="Passive Investigation: ${investigation}"><i class="fas fa-search"></i> ${investigation}</div>`;
          const passiveInsightButton = `<div class="control-icon token-info-icon" title="Passive Insight: ${insight}"><i class="fas fa-lightbulb"></i> ${insight}</div>`;
          const passiveStealthButton = `<div class="control-icon token-info-icon" title="Passive Stealth: ${stealth}"><i class="fas fa-eye-slash"></i> ${stealth}</div>`;
          passiveSensesButtons = `${passiveInvestigationButton}${passiveInsightButton}${passiveStealthButton}`;
      }

      let buttons = $(`<div class="col token-info-column-${position}">${defaultButtons}${passiveSensesButtons}</div>`);

      html.find('.col.left').wrap(newdiv);
      html.find('.col.left').before(buttons);
  }
}

Hooks.on('ready', () => {
  const gmOnly = game.settings.get('token-info-icons', 'gmOnly');

  if (gmOnly) {
      if (game.user.isGM) {
          Hooks.on('renderTokenHUD', (app, html, data) => {
              TokenInfoIcons.addTokenInfoButtons(app, html, data)
          });
      }
  } else {
      Hooks.on('renderTokenHUD', (app, html, data) => {
          TokenInfoIcons.addTokenInfoButtons(app, html, data)
      });
  }
});

Hooks.once("init", () => {

  game.settings.register('token-info-icons', 'gmOnly', {
      name: "GM only?",
      hint: "Show the token info to the GM only or to all players?",
      scope: "world",
      config: true,
      default: true,
      type: Boolean
  });

  game.settings.register('token-info-icons', 'allPassiveSenses', {
      name: 'Show all passive senses (dnd5e)',
      hint: 'Show passive perception/investigation/insight/stealth instead of just passive perception',
      scope: "world",
      config: true,
      default: false,
      type: Boolean
  });

  game.settings.register('token-info-icons', 'position', {
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
