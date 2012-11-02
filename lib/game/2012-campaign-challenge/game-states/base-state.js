ig.module( 
  'game.2012-campaign-challenge.game-states.base-state' 
)
.requires(
  'shared.mathutils',

  'game.2012-campaign-challenge.constants' 
)
.defines(function(){

  ig.BaseState = ig.Class.extend({
    stateManager: new shared.mathutils.HermiteInterpolator(ig.CCConstants.STATE_TIME_IN, ig.CCConstants.STATE_TIME_OUT, shared.mathutils.INTERPOLATOR_STATES.OFF),
    nextState: null,
    transDir: ig.CCConstants.TRANSDIR.LEFT,

    init: function() {
      if (this.stateManager) {
        this.stateManager.forceState(shared.mathutils.INTERPOLATOR_STATES.OFF);
        this.stateManager.setCallbacks(this.onFullyActive.bind(this), this.onFullyInactive.bind(this));
      }
    },

    setTransitionDirection: function(newDir) {
      this.transDir = newDir;
    },

    onPress: function(pos) {
      return false;
    },

    onRelease: function(pos) {
      return false;
    },

    forceOff: function() {
      if (this.stateManager) {
        this.stateManager.forceState(shared.mathutils.INTERPOLATOR_STATES.OFF);
      }
    },

    forceOn: function() {
      if (this.stateManager) {
        this.stateManager.forceState(shared.mathutils.INTERPOLATOR_STATES.ON);
      }
    },

    onFullyActive: function() {
      ig.game.setState(this);
    },

    onFullyInactive: function() {
      // Child classes: clean-up code goes here.
    },

    startIntro: function() {
      if (this.stateManager) {
        this.stateManager.activate();
      }

      // Child classes: init code goes here.
    },

    startExtro: function(extroTime, nextState) {
      if (this.stateManager) {
        this.stateManager.deactivate();
        this.nextState = nextState;
      }
    },

    drawTopBanner: function(offsetX, message, alpha, bStretchWidth) {
      var ctx = ig.system.context;
      ctx.save();

      ctx.fillStyle = "#FF0000",

      ctx.globalAlpha = alpha;

      var maxX = bStretchWidth ? ig.CCConstants.WIDTH : offsetX + ig.CCConstants.WIDTH

      ctx.beginPath();
      ctx.moveTo(offsetX, 0);
      ctx.lineTo(maxX, 0);
      ctx.lineTo(maxX, ig.CCConstants.TOP_BANNER_HEIGHT);
      ctx.lineTo(offsetX, ig.CCConstants.TOP_BANNER_HEIGHT);
      ctx.closePath();

      ctx.fill();

      ig.game.fontPoster70w.draw(message,
                                 offsetX + ig.CCConstants.WIDTH * 0.5,
                                 ig.CCConstants.TOP_BANNER_HEIGHT * 0.5 - ig.game.fontPoster70w.height * 0.5,
                                 ig.Font.ALIGN.CENTER);


      ctx.globalAlpha = 1;
      ctx.restore();
    },

    update: function(dt) {
      if (this.stateManager) {
        this.stateManager.update(dt);
      }
    },

    getTransitionValue: function() {
      return this.stateManager ? this.stateManager.getValue() : 0;
    }

  });
});
