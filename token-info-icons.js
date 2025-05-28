class TokenInfoIcons {
  static async addTokenInfoButtons(app, html, data) {
      let actor = canvas.tokens.get(data._id).actor;
      //let actor = game.actors.get(data.actorId);
      if (actor === undefined) return;

      let ac = 10
      if (game.world.system === "pf1") {
          ac = actor.system.attributes.ac.normal.total
      }
      else if (game.world.system === "dcc") {
            ac = actor.system.attributes.ac.value
      } else {
          ac = (isNaN(parseInt(actor.system.attributes.ac.value)) || parseInt(actor.system.attributes.ac.value) === 0) ? 10 : parseInt(actor.system.attributes.ac.value);
      }

      let perceptionTitle = "Passive Perception";
      let perception = 10;
      if (game.world.system === "pf1") {
          perception = actor.system.skills.per.mod
          perceptionTitle = "Perception Mod";
      } else if (game.world.system === "pf2e") {
          perception = perception + actor.perception.mod;
          perceptionTitle = "Perception DC";
      }
      else if (game.world.system === "dcc") {
        perception = 0
        perceptionTitle = "Perception DC";
      }
       else {
          perception = actor.system.skills?.prc?.passive || 0;
      }

      //console.log("TokenInfoIcons", actor);

      let speed = "";

      if (game.world.system === "pf2e") {
          if (actor.system.type === "npc") {
              speed = '<span class="token-info-speed" title="Speed"><i class="fas fa-walking"></i><span style="font-size: 0.65em;"> ' + actor.system.attributes.speed.value + '</span></span>';
          } else if (actor.system.type === "familiar") {
              // Familiars seem to get either 25 ft. land or water speed
              // It can be modified by other abilities but they will be revising these later so this will likely change
              speed = '<span class="token-info-speed" title="Speed"><i class="fas fa-walking"></i> 25</span>';
          } else {
              speed = '<span class="token-info-speed" title="Land"><i class="fas fa-walking"></i> ' + actor.system.attributes.speed.total + '</span>';
          }
      } else if (game.world.system === "pf1") {
          speed = '<span class="token-info-speed" title="Land"><i class="fas fa-walking"></i> ' + actor.system.attributes.speed.land.total + '</span>';
      } else if (game.world.system === "dcc") {
          speed = '<span class="token-info-speed" title="Movement"><i class="fas fa-walking"></i> ' + actor.system.attributes.speed.base + '</span>';
      } else {
          if (actor.system.attributes.movement.walk != 0 && actor.system.attributes.movement.walk != null) speed += '<div class="token-info-icon control-icon" title="Walk"><i class="fas fa-walking"></i> ' + actor.system.attributes.movement.walk + '<span style="font-size: 0.5em;"> ' + actor.system.attributes.movement.units + "</span></div>";
          if (actor.system.attributes.movement.swim != 0 && actor.system.attributes.movement.swim != null) speed += '<div class="token-info-icon control-icon" title="Swim"><i class="fas fa-swimmer"></i> ' + actor.system.attributes.movement.swim + '<span style="font-size: 0.5em;"> ' + actor.system.attributes.movement.units + "</span></div>";
          if (actor.system.attributes.movement.fly != 0 && actor.system.attributes.movement.fly != null) speed += '<div class="token-info-icon control-icon" title="Fly"><i class="fas fa-crow"></i> ' + actor.system.attributes.movement.fly + '<span style="font-size: 0.5em;"> ' + actor.system.attributes.movement.units + "</span></div>";
          if (actor.system.attributes.movement.burrow != 0 && actor.system.attributes.movement.burrow != null) speed += '<div class="token-info-icon control-icon" title="Burrow"><i class="fas fa-mountain"></i> ' + actor.system.attributes.movement.burrow + '<span style="font-size: 0.5em;"> ' + actor.system.attributes.movement.units + "</span></div>";
          if (actor.system.attributes.movement.climb != 0 && actor.system.attributes.movement.climb != null) speed += '<div class="token-info-icon control-icon" title="Climb"><i class="fas fa-grip-lines"></i> ' + actor.system.attributes.movement.climb + '<span style="font-size: 0.5em;"> ' + actor.system.attributes.movement.units + "</span></div>";
      }

      // DCC luck

      let luck = null;
      if (game.world.system === "dcc") {
        if (actor.data.type === "Player") {
          luck =  actor.system.abilities.lck.value;
        }
      }

      let newdiv = '';

      let position = game.settings.get('token-info-icons', 'position');

      let defaultButtons = speed + '<div class="token-info-icon control-icon" title="Armor Class: ' + ac + '"><i class="fas fa-shield-alt"></i> ' + ac + '</div>';
      if (game.world.system !== "dcc"){
        defaultButtons += '<div class="token-info-icon control-icon" title="Passive Perception: ' + perception + '"><i class="fas fa-eye"></i> ' + perception + '</div>'
      }else{
        // dcc specific
        if(luck != null){
          defaultButtons += '<div class="token-info-icon control-icon" title="Luck: ' + luck + '"><i class="fas fa-star"></i> ' + luck + '</div>'
        }
      }


      let passiveSensesButtons = '';
      if (!['pf2e', 'pf1'].includes(game.world.system) && game.settings.get('token-info-icons', 'allPassiveSenses')) {
          const investigation = actor.system.skills?.inv?.passive || 0;
          const insight = actor.system.skills?.ins?.passive || 0;
          const stealth = actor.system.skills?.ste?.passive || 0;

          const passiveInvestigationButton = `<div class="token-info-icon control-icon" title="Passive Investigation: ${investigation}"><i class="fas fa-search"></i> ${investigation}</div>`;
          const passiveInsightButton = `<div class="token-info-icon control-icon" title="Passive Insight: ${insight}"><i class="fas fa-lightbulb"></i> ${insight}</div>`;
          const passiveStealthButton = `<div class="token-info-icon control-icon" title="Passive Stealth: ${stealth}"><i class="fas fa-eye-slash"></i> ${stealth}</div>`;
          passiveSensesButtons = `${passiveInvestigationButton}${passiveInsightButton}${passiveStealthButton}`;
      }

      let buttons = $(`<div class="token-info col far-${position}">${defaultButtons}${passiveSensesButtons}</div>`);

      $(html).find(`.col.${position}`).wrap(newdiv);
      $(html).find(`.col.${position}`).after(buttons);
  }
}

Hooks.on('ready', () => {
  const gmOnly = game.settings.get('token-info-icons', 'gmOnly');

  if (gmOnly || game.user.isGM) {
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
