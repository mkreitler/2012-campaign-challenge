ig.module( 
  'game.2012-campaign-challenge.game-states.state-next-event' 
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

  ig.StateNextEvent = ig.BaseState.extend({

    labelQuit: null,
    labelGo: null,
    labelQuitPos: {x:0, y:0},
    labelGoPos: {x:0, y:0},
    eventDesc: null,
    eventName: null,

    createLabels: function() {
      this.labelGoPos.x = ig.CCConstants.WIDTH * 0.9;
      this.labelGoPos.y = ig.CCConstants.HEIGHT - ig.game.fontPoster40.height;

      this.labelQuitPos.x = ig.CCConstants.WIDTH * 0.1;
      this.labelQuitPos.y = ig.CCConstants.HEIGHT - ig.game.fontPoster40.height;

      this.labelGo = SoftLabel.manager.newLabel({
        font: ig.game.fontPoster40,
        text: ig.CCConstants.TEXT_START,
        x: this.labelGoPos.x,
        y: this.labelGoPos.y,
        isDismissable: false
      });

      this.labelQuit = SoftLabel.manager.newLabel({
        font: ig.game.fontPoster40,
        text: ig.CCConstants.TEXT_QUIT,
        x: this.labelQuitPos.x,
        y: this.labelQuitPos.y,
        isDismissable: false
      });
    },

    setEventDescription: function(desc) {
      this.eventDesc = desc;
    },

    setEventName: function(name) {
      this.eventName = name;
    },

    labelPressed: function(whichLabel) {
      if (whichLabel === this.labelQuit) {
        // TODO: quit to title screen
      }
      else if (whichLabel === this.labelGo) {
        // TODO: start event.
      }
    },

    onPress: function(pos) {
      var bConsumed = false;

      // if (this.getTransitionValue() > 1 - shared.mathutils.EPSILON) {
      //   if (this.labelQuit && this.labelQuit.containsPoint(pos)) {
      //     this.labelPressed(this.labelQuit);
      //     bConsumed = true;
      //   }
      //   else if (this.labelGo && this.labelGo.containsPoint(pos)) {
      //     this.labelPressed(this.labelGo);
      //     bConsumed = true;
      //   }
      // }

      return bConsumed;
    },

    onFullyInactive: function() {
      this.clearUI();
    },

    clearUI: function() {
      SoftLabel.manager.removeLabel(this.labelQuit);
      SoftLabel.manager.removeLabel(this.labelGo);
      
      this.labelQuit = false;
      this.labelGo = false;
    },

    startIntro: function(nextState) {
      this.createLabels();

      this.parent(nextState);
    },

    draw: function() {
      var textX = ig.CCConstants.WIDTH * 0.5;
      var transOffsetX = 0;

      if (this.stateManager && this.eventName && this.eventDesc) {
        if (this.stateManager.getState() === shared.mathutils.INTERPOLATOR_STATES.INTRO) {
          transOffsetX = ig.CCConstants.WIDTH * this.transDir * (1 - this.getTransitionValue());
        }
        else if (this.stateManager.getState() === shared.mathutils.INTERPOLATOR_STATES.OUTTRO) {
          transOffsetX = -ig.CCConstants.WIDTH * this.transDir * (1 - this.getTransitionValue());
        }

        textX += transOffsetX;

        this.drawTopBanner(textX - ig.CCConstants.WIDTH * 0.5, this.eventName, 1, false);

        if (this.labelGo) {
          this.labelGo.setPos(this.labelGoPos.x + transOffsetX, this.labelGoPos.y);
        }

        if (this.labelQuit) {
          this.labelQuit.setPos(this.labelQuitPos.x + transOffsetX, this.labelQuitPos.y);
        }

        var textY = ig.CCConstants.HEIGHT * 0.25 + ig.game.fontPoster40.height * 0.5;
        for (var i=0; this.eventDesc && i<this.eventDesc.length; ++i) {
          var whichFont = this.eventDesc[i].charAt(0) === 'r' ? ig.game.fontPoster40 : ig.game.fontPoster40b;

          whichFont.draw(this.eventDesc[i].substring(1), textX, textY + i * ig.game.fontPoster40.height, ig.Font.ALIGN.CENTER);
        }
      }
    }
  });
});
