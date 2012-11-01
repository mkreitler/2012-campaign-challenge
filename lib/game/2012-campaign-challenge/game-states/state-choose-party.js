ig.module( 
  'game.2012-campaign-challenge.game-states.state-choose-party' 
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

  ig.StateChooseParty = ig.BaseState.extend({

    buttonDemocratPos:        {x:0, y:0},
    buttonLibertarianPos:     {x:0, y:0},
    buttonRepublicanPos:      {x:0, y:0},

    buttonDemocrat:           null,
    buttonLibertarian:        null,
    buttonRepublican:         null,

    startIntro: function(nextState) {
      this.createButtons();
      this.parent(nextState);
    },

    createButtons: function() {
      this.buttonDemocratPos.x = 2.25 * ig.game.iconDemocrat.width;
      this.buttonDemocratPos.y = ig.CCConstants.HEIGHT - ig.game.iconDemocrat.height;
      
      this.buttonLibertarianPos.x = 0.5 * ig.game.iconIndependent.width;
      this.buttonLibertarianPos.y = ig.CCConstants.HEIGHT - ig.game.iconIndependent.height;

      this.buttonRepublicanPos.x = 1.25 * ig.game.iconRepublican.width;
      this.buttonRepublicanPos.y = ig.CCConstants.HEIGHT - ig.game.iconRepublican.height;

      this.buttonDemocrat = new SoftImage(this.buttonDemocratPos.x,
                                          this.buttonDemocratPos.y,
                                          {
                                            image: ig.game.iconDemocrat,
                                            callbackPress: this.buttonPressed.bind(this)
                                          });

      this.buttonLibertarian = new SoftImage(this.buttonLibertarianPos.x,
                                             this.buttonLibertarianPos.y,
                                             {
                                               image: ig.game.iconIndependent,
                                               callbackPress: this.buttonPressed.bind(this)
                                             });

      this.buttonRepublican = new SoftImage(this.buttonRepublicanPos.x,
                                            this.buttonRepublicanPos.y,
                                            {
                                              image: ig.game.iconRepublican,
                                              callbackPress: this.buttonPressed.bind(this)
                                            });

      this.buttonDemocrat.setVisible(true);
      this.buttonDemocrat.setActive(true);

      this.buttonLibertarian.setVisible(true);
      this.buttonLibertarian.setActive(true);

      this.buttonRepublican.setVisible(true);
      this.buttonRepublican.setActive(true);

      UiManager._manager.addWidget(this.buttonDemocrat);
      UiManager._manager.addWidget(this.buttonLibertarian);
      UiManager._manager.addWidget(this.buttonRepublican);
    },

    buttonPressed: function(whichButton) {
      if (whichButton === this.buttonDemocrat) {
        ig.game.setParty(ig.CCConstants.PARTY.DEMOCRAT);
      }
      else if (whichButton === this.buttonLibertarian) {
        ig.game.setParty(ig.CCConstants.PARTY.LIBERTARIAN);
      }
      else {
        ig.game.setParty(ig.CCConstants.PARTY.REPUBLICAN);
      }

      ig.game.meetOpponents(false);
    },

    onFullyInactive: function() {
      UiManager._manager.removeWidget(this.buttonDemocrat);
      UiManager._manager.removeWidget(this.buttonLibertarian);
      UiManager._manager.removeWidget(this.buttonRepublican);

      this.buttonDemocrat = null;
      this.buttonLibertarian = null;
      this.buttonRepublican = null;
    },

    draw: function() {
      var textX = ig.CCConstants.WIDTH * 0.5;

      if (this.stateManager) {
        if (this.stateManager.getState() === shared.mathutils.INTERPOLATOR_STATES.INTRO) {
          textX += ig.CCConstants.WIDTH * this.transDir * (1 - this.getTransitionValue());
        }
        else if (this.stateManager.getState() === shared.mathutils.INTERPOLATOR_STATES.OUTTRO) {
          textX -= ig.CCConstants.WIDTH * this.transDir * (1 - this.getTransitionValue());
        }

        this.drawTopBanner(textX - ig.CCConstants.WIDTH * 0.5, ig.CCConstants.TEXT_CHOOSE_INTRO, 1, false);

        var textY = ig.CCConstants.HEIGHT * 0.5 - ig.game.fontPoster40.height * ig.CCConstants.TEXT_CHOOSE_LINES.length * 0.5;
        for (var i=0; i<ig.CCConstants.TEXT_CHOOSE_LINES.length; ++i) {
          var whichFont = i < ig.CCConstants.TEXT_CHOOSE_LINES.length / 2 ? ig.game.fontPoster40b : ig.game.fontPoster40;
          whichFont.draw(ig.CCConstants.TEXT_CHOOSE_LINES[i], textX, textY + i * ig.game.fontPoster40.height, ig.Font.ALIGN.CENTER);
        }

        if (this.buttonDemocrat && this.buttonLibertarian && this.buttonRepublican) {
          this.buttonDemocrat.setPosComponents(textX - this.buttonDemocratPos.x, this.buttonDemocratPos.y - 0.5 * whichFont.height);
          this.buttonLibertarian.setPosComponents(textX - this.buttonLibertarianPos.x, this.buttonLibertarianPos.y - 0.5 * whichFont.height);
          this.buttonRepublican.setPosComponents(textX + this.buttonRepublicanPos.x, this.buttonRepublicanPos.y - 0.5 * whichFont.height);
        }
      }
    }
  });
});
