ig.module( 
  'game.2012-campaign-challenge.game-states.state-title' 
)
.requires(
  'shared.mathutils',
  'shared.soft-labels',
  'shared.ui.soft-image',
  'shared.ui.ui-manager',
  
  'game.2012-campaign-challenge.constants',
  'game.2012-campaign-challenge.game-states.base-state' 
)
.defines(function(){

  ig.StateTitle = ig.BaseState.extend({
    imageBottom:        new ig.Image('media/art/capitol_blue_inv.png'),
    labelPlayGame:      null,
    labelReadRules:     null,
    iconPlayGame:       null,
    iconReadRules:      null,
    labelPlayGamePos:   {x:0, y:0},
    labelReadRulesPos:  {x:0, y:0},
    iconPlayGamePos:    {x:0, y:0},
    iconReadRulesPos:   {x:0, y:0},

    startIntro: function(nextState) {
      this.createLabels();
      this.createIcons();

      this.parent(nextState);
    },

    createIcons: function() {
      this.iconPlayGamePos.x = (ig.CCConstants.WIDTH - ig.game.fontPoster40.widthForString(ig.CCConstants.TEXT_PLAY_GAME)) * 0.5 - 108;
      this.iconPlayGamePos.y = ig.CCConstants.HEIGHT * 0.5 - ig.game.fontPoster40.height - 83 * 0.5;

      this.iconPlayGame = new SoftImage(this.iconPlayGamePos.x,
                                        this.iconPlayGamePos.y,
                                        {
                                          image: ig.game.iconsBlue,
                                          fadeInTime: 2 * ig.CCConstants.STATE_TIME_IN,
                                          fadeOutTime: 2 * ig.CCConstants.STATE_TIME_OUT,
                                          offsetX: 406,
                                          offsetY: 214,
                                          width: 108,
                                          height: 83,
                                          callbackPress: this.iconPressed.bind(this)
                                        });

      this.iconReadRulesPos.x = (ig.CCConstants.WIDTH - ig.game.fontPoster40.widthForString(ig.CCConstants.TEXT_PLAY_GAME)) * 0.5 - 108;
      this.iconReadRulesPos.y = ig.CCConstants.HEIGHT * 0.5 + ig.game.fontPoster40.height - 83 * 0.5;
      this.iconReadRules = new SoftImage(this.iconReadRulesPos.x,
                                         this.iconReadRulesPos.y,
                                         {
                                           image: ig.game.iconsBlue,
                                           fadeInTime: 2 * ig.CCConstants.STATE_TIME_IN,
                                           fadeOutTime: 2 * ig.CCConstants.STATE_TIME_OUT,
                                           offsetX: 270,
                                           offsetY: 390,
                                           width: 108,
                                           height: 83,
                                           callbackPress: this.iconPressed.bind(this)
                                         });
      
      UiManager._manager.addWidget(this.iconPlayGame);
      UiManager._manager.addWidget(this.iconReadRules);
      
      this.iconPlayGame.setVisible(true);
      this.iconPlayGame.setActive(true);
      
      this.iconReadRules.setVisible(true);
      this.iconReadRules.setActive(true);
    },

    iconPressed: function(whichIcon) {
      this.labelPressed();
    },

    labelPressed: function(whichLabel) {
      if (ig.game) {
        ig.game.chooseParty(false);
      }
    },

    onFullyInactive: function() {
      this.clearUI();
    },

    clearUI: function() {
      SoftLabel.manager.removeAllLabelsNoCallbacks();
      
      this.labelPlayGame = null;
      this.labelReadRules = null;

      UiManager._manager.removeWidget(this.iconPlayGame);
      UiManager._manager.removeWidget(this.iconReadRules);

      this.iconPlayGame = null;
      this.iconReadRules = null;
    },

    createLabels: function() {
      this.labelPlayGamePos.x = ig.CCConstants.WIDTH * 0.5;
      this.labelPlayGamePos.y = ig.CCConstants.HEIGHT * 0.5 - ig.game.fontPoster40.height;
      this.labelPlayGame = SoftLabel.manager.newLabel({
        font: ig.game.fontPoster40,
        text: ig.CCConstants.TEXT_PLAY_GAME,
        x: this.labelPlayGamePos.x,
        y: this.labelPlayGamePos.y,
        fadeInTime: 2 * ig.CCConstants.STATE_TIME_IN,
        fadeOutTime: 2 * ig.CCConstants.STATE_TIME_OUT,
        dismissCallback: this.labelPressed.bind(this)
      });

      this.labelReadRulesPos.x = ig.CCConstants.WIDTH * 0.5;
      this.labelReadRulesPos.y = ig.CCConstants.HEIGHT * 0.5 + ig.game.fontPoster40.height;
      this.labelReadRules = SoftLabel.manager.newLabel({
        font: ig.game.fontPoster40,
        text: ig.CCConstants.TEXT_READ_RULES,
        x: this.labelReadRulesPos.x,
        y: this.labelReadRulesPos.y,
        fadeInTime: 2 * ig.CCConstants.STATE_TIME_IN,
        fadeOutTime: 2 * ig.CCConstants.STATE_TIME_OUT,
        dismissCallback: this.labelPressed.bind(this)
      });
    },

    draw: function() {
      if (this.imageBottom && this.stateManager && this.stateManager.getState() !== shared.mathutils.INTERPOLATOR_STATES.OUTTRO) {
        ig.system.context.save();

        ig.system.context.globalAlpha = this.getTransitionValue();

        this.drawTopBanner(0, ig.CCConstants.TEXT_TITLE_BANNER, ig.system.context.globalAlpha, true);
        this.imageBottom.draw(0, ig.CCConstants.HEIGHT - this.imageBottom.height);

        ig.system.context.globalAlpha = 1;
        ig.system.context.restore();
      }
      else {
        var transValue = this.getTransitionValue();
        var offsetX = ig.CCConstants.WIDTH * this.transDir * (transValue - 1);

        this.drawTopBanner(offsetX, ig.CCConstants.TEXT_TITLE_BANNER, 1, true);
        this.imageBottom.draw(offsetX, ig.CCConstants.HEIGHT - this.imageBottom.height);

        if (this.labelPlayGame) {
          this.labelPlayGame.setPos(this.labelPlayGamePos.x + offsetX, this.labelPlayGamePos.y);
        }

        if (this.labelReadRules) {
          this.labelReadRules.setPos(this.labelReadRulesPos.x + offsetX, this.labelReadRulesPos.y);
        }

        if (this.iconPlayGame) {
          this.iconPlayGame.setPosComponents(this.iconPlayGamePos.x + offsetX, this.iconPlayGamePos.y);
        }

        if (this.iconReadRules) {
          this.iconReadRules.setPosComponents(this.iconReadRulesPos.x + offsetX, this.iconReadRulesPos.y);
        }
      }
    }
  });
});
