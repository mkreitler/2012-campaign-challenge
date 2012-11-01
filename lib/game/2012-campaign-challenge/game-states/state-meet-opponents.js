ig.module( 
  'game.2012-campaign-challenge.game-states.state-meet-opponents' 
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

  ig.StateMeetOpponents = ig.BaseState.extend({

    images: [],
    labelBack: null,
    labelNext: null,
    labelBackPos: {x:0, y:0},
    labelNextPos: {x:0, y:0},
    labelMore: [null, null],
    labelMorePos: [{x:0, y:0}, {x:0, y:0}],

    createLabels: function() {
      this.labelNextPos.x = ig.CCConstants.WIDTH * 0.875;
      this.labelNextPos.y = ig.CCConstants.HEIGHT - ig.game.fontPoster40.height;

      this.labelBackPos.x = ig.CCConstants.WIDTH * 0.125;
      this.labelBackPos.y = ig.CCConstants.HEIGHT - ig.game.fontPoster40.height;

      this.labelNext = SoftLabel.manager.newLabel({
        font: ig.game.fontPoster40,
        text: ig.CCConstants.TEXT_NEXT,
        x: this.labelNextPos.x,
        y: this.labelNextPos.y,
        isDismissable: false
      });

      this.labelBack = SoftLabel.manager.newLabel({
        font: ig.game.fontPoster40,
        text: ig.CCConstants.TEXT_BACK,
        x: this.labelBackPos.x,
        y: this.labelBackPos.y,
        isDismissable: false
      });

      // Create dummy starting values for the "learn more" labels.
      var bioTextY = ig.CCConstants.HEIGHT - 0.5 * ig.game.portraitJohnson.height + ig.game.fontPhenix40.height * 0.5;

      this.labelMorePos[0].x = ig.CCConstants.WIDTH;
      this.labelMorePos[0].y = bioTextY;
      this.labelMorePos[1].x = ig.CCConstants.WIDTH;
      this.labelMorePos[1].y = bioTextY;

      this.labelMore[0] = SoftLabel.manager.newLabel({
        font: ig.game.fontPhenix40,
        text: ig.CCConstants.TEXT_LEARN_MORE,
        x: this.labelMorePos[0].x,
        y: this.labelMorePos[0].y,
        isDismissable: false
      });

      this.labelMore[1] = SoftLabel.manager.newLabel({
        font: ig.game.fontPhenix40,
        text: ig.CCConstants.TEXT_LEARN_MORE,
        x: this.labelMorePos[1].x,
        y: this.labelMorePos[1].y,
        isDismissable: false
      });
    },

    labelPressed: function(whichLabel) {
      if (whichLabel === this.labelBack) {
        ig.game.chooseParty(true);
      }
      else if (whichLabel === this.labelNext) {
        ig.game.startEvents();
      }
      else {
        for (var i=0; i<this.labelMore.length; ++i) {
          if (whichLabel === this.labelMore[i]) {
            var urlIndex = i;
            switch (ig.game.getParty()) {
              case ig.CCConstants.PARTY.DEMOCRAT:
                urlIndex += 1;
              break;
              
              case ig.CCConstants.PARTY.LIBERTARIAN:
                if (urlIndex === 1) {
                  urlIndex = 2;
                }
              break;
            }

            window.open(ig.CCConstants.INFO_URL[urlIndex], "_self");
            break;
          }
        }
      }
    },

    onPress: function(pos) {
      var bConsumed = false;

      if (this.getTransitionValue() > 1 - shared.mathutils.EPSILON) {
        if (this.labelBack && this.labelBack.containsPoint(pos)) {
          this.labelPressed(this.labelBack);
          bConsumed = true;
        }
        else if (this.labelNext && this.labelNext.containsPoint(pos)) {
          this.labelPressed(this.labelNext);
          bConsumed = true;
        }
        else {
          for (var i=0; i<this.labelMore.length; ++i) {
            if (this.labelMore[i].containsPoint(pos)) {
              this.labelPressed(this.labelMore[i]);
              bConsumed = true;
              break;
            }
          }
        }
      }

      return bConsumed;
    },

    onFullyInactive: function() {
      this.clearUI();
    },

    clearUI: function() {
      SoftLabel.manager.removeAllLabelsNoCallbacks();
      this.labelBack = false;
      this.labelNext = false;
    },

    startIntro: function(nextState) {
      this.createLabels();

      if (this.images.length === 0) {
        this.images.push(ig.game.portraitObama);
        this.images.push(ig.game.portraitJohnson);
        this.images.push(ig.game.portraitRomney);
      }

      this.parent(nextState);
    },

    draw: function() {
      var textX = ig.CCConstants.WIDTH * 0.5;
      var transOffsetX = 0;

      if (this.stateManager) {
        if (this.stateManager.getState() === shared.mathutils.INTERPOLATOR_STATES.INTRO) {
          transOffsetX = ig.CCConstants.WIDTH * this.transDir * (1 - this.getTransitionValue());
          textX += transOffsetX;
        }
        else if (this.stateManager.getState() === shared.mathutils.INTERPOLATOR_STATES.OUTTRO) {
          transOffsetX = ig.CCConstants.WIDTH * this.transDir * (1 - this.getTransitionValue());
          textX -= transOffsetX;
        }

        this.drawTopBanner(textX - ig.CCConstants.WIDTH * 0.5, ig.CCConstants.TEXT_MEET_INTRO, 1, false);

        if (this.labelNext) {
          this.labelNext.setPos(this.labelNextPos.x + this.transDir * transOffsetX, this.labelNextPos.y);
        }

        if (this.labelBack) {
          this.labelBack.setPos(this.labelBackPos.x + this.transDir * transOffsetX, this.labelBackPos.y);
        }

        var textY = ig.CCConstants.HEIGHT * 0.25 + ig.game.fontPoster40.height * 0.5;
        for (var i=0; i<ig.CCConstants.TEXT_MEET_LINES.length; ++i) {
          ig.game.fontPoster40.draw(ig.CCConstants.TEXT_MEET_LINES[i], textX, textY + i * ig.game.fontPoster40.height, ig.Font.ALIGN.CENTER);
        }

        if (ig.game.iconDemocrat && ig.game.iconIndependent && ig.game.iconRepublican) {
          var offsetX = -1.25 * this.images[0].width;
          bioOffsetX = (offsetX + ig.CCConstants.WIDTH * 0.5) * 0.5;

          for (var i=0; i<this.labelMore.length; ++i) {
            this.labelMorePos[i].x = offsetX + textX + this.images[i].width * 0.5;
            this.labelMore[i].setPos(this.labelMorePos[i].x, this.labelMorePos[i].y);
            offsetX += 1.5 * this.images[0].width;
          }

          // Reset offsetX.
          offsetX = -1.25 * this.images[0].width;

          for (i=0; i<this.images.length; ++i) {
            if (ig.game.getParty() !== i) {
              this.images[i].draw(textX + offsetX, ig.CCConstants.HEIGHT - 1.5 * this.images[i].height);
              offsetX += 1.5 * this.images[0].width;

              var bioTextY = ig.CCConstants.HEIGHT - 1.5 * this.images[i].height;

              for (var j=0; j<ig.CCConstants.OPPONENT_BIO[i].length; ++j) {
                var text = ig.CCConstants.OPPONENT_BIO[i][j];
                var font = text.charAt(0) === 'r' ? ig.game.fontPhenix20 : ig.game.fontPhenix20b;
                if (j === 0) {
                  font = text.charAt(0) === 'r' ? ig.game.fontPhenix40 : ig.game.fontPhenix40b;
                }

                font.draw(text.substring(1), bioOffsetX + this.transDir * transOffsetX, bioTextY, ig.Font.ALIGN.CENTER);
                bioTextY += font.height * 1.1;
              }

              bioOffsetX = (1.5 * ig.CCConstants.WIDTH + offsetX + this.images[i].width) * 0.5;
            }
          }
        }
      }
    }
  });
});
