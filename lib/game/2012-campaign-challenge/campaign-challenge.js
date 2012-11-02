ig.module( 
  'game.2012-campaign-challenge.campaign-challenge' 
)
.requires(
  'impact.game',
  'impact.font',

  'shared.soft-labels',
  'shared.ui.ui-manager',

  'game.2012-campaign-challenge.constants',
  'game.2012-campaign-challenge.game-states.state-title',
  'game.2012-campaign-challenge.game-states.state-meet-opponents',
  'game.2012-campaign-challenge.game-states.state-choose-party',
  'game.2012-campaign-challenge.game-states.state-next-event'
)
.defines(function(){

  ig.CampaignChallenge = ig.Game.extend({
    curState:         null,
    nextState:        null,
    lastTime:         0,
    dt:               0,
    clearColor:       "#FFFFFF",
    uiManager:        new UiManager(),
    bWasMouseDown:    false,
    lastMousePos:     {x:-1, y:-1},
    party:            ig.CCConstants.PARTY.NONE,

    // Shared Resources
    fontPoster40:     new ig.Font('media/art/font-day-poster-shadow-40.png'),
    fontPoster40b:    new ig.Font('media/art/font-day-poster-shadow-40b.png'),
    fontPoster70w:    new ig.Font('media/art/font-day-poster-shadow-70w.png'),
    fontPhenix40:     new ig.Font('media/art/font-phenix-40.png'),
    fontPhenix40b:    new ig.Font('media/art/font-phenix-40b.png'),
    fontPhenix20:     new ig.Font('media/art/font-phenix-20.png'),
    fontPhenix20b:    new ig.Font('media/art/font-phenix-20b.png'),

    iconsBlue:        new ig.Image('media/art/icons-blue-sheet.png'),
    iconsRed:         new ig.Image('media/art/icons-red-sheet.png'),
    iconDemocrat:     new ig.Image('media/art/icon-democrat.jpeg'),
    iconRepublican:   new ig.Image('media/art/icon-republican.jpeg'),
    iconIndependent:  new ig.Image('media/art/icon-libertarian.jpeg'),

    portraitRomney:   new ig.Image('media/art/portrait-romney.jpg'),
    portraitObama:    new ig.Image('media/art/portrait-obama.jpg'),
    portraitJohnson:  new ig.Image('media/art/portrait-johnson.jpeg'),

    sndHailIntro:     ig.ua.mobile ? null : new ig.Sound('media/audio/sfx-hail-short.wav'),
    sndTransOpen:      ig.ua.mobile ? null : new ig.Sound('media/audio/SFX_MenuOpen.wav'),
    sndTransClose:      ig.ua.mobile ? null : new ig.Sound('media/audio/SFX_MenuClose.wav'),
    sndHailIntro:     ig.ua.mobile ? null : new ig.Sound('media/audio/sfx-hail-short.wav'),
    

    // Game States
    titleState: new ig.StateTitle(),
    choosePartyState: new ig.StateChooseParty(),
    meetOpponentsState: new ig.StateMeetOpponents(),
    nextEventState: new ig.StateNextEvent(),

    init: function() {
      // Initialize game time.
      this.lastTime = (new Date).getTime();
      this.dt = 0;

      this.initInput();

      this.enterNewState(this.titleState);

      this.playSoundHail();
    },

    // Sounds /////////////////////////////////////////////////////////////////
    playSoundHail: function() {
      if (this.sndHailIntro) {
        this.sndHailIntro.play();
      }
    },

    playSoundTransOpen : function() {
      if (this.sndTransOpen) {
        this.sndTransOpen.play();
      }
    },

    playSoundTransClose: function() {
      if (this.sndTransClose) {
        this.sndTransClose.play();
      }
    },

    // Game States ////////////////////////////////////////////////////////////
    setupStateTransition: function(bRight, nextState) {
        if (this.curState) {
          this.curState.setTransitionDirection(bRight ? ig.CCConstants.TRANSDIR.RIGHT : ig.CCConstants.TRANSDIR.LEFT);
        }

        if (nextState) {
          nextState.setTransitionDirection(bRight ? ig.CCConstants.TRANSDIR.RIGHT : ig.CCConstants.TRANSDIR.LEFT);
        }
    },

    startEvents: function(eventName, eventDescription, bRight) {
      if (this.nextEventState) {
        this.playSoundTransOpen();

        this.nextEventState.setEventName(eventName);
        this.nextEventState.setEventDescription(eventDescription);

        this.setupStateTransition(bRight, this.nextEventState);

        this.enterNewState(this.nextEventState);
      }
    },

    chooseParty: function(bRight) {
      this.playSoundTransOpen();

      this.setupStateTransition(bRight, this.choosePartyState);

      this.enterNewState(this.choosePartyState);
    },

    meetOpponents: function(bRight) {
      this.playSoundTransOpen();

      this.setupStateTransition(bRight, this.meetOpponentsState);

      this.enterNewState(this.meetOpponentsState);
    },

    // Accessors //////////////////////////////////////////////////////////////
    setParty: function(partyChoice) {
      this.party = partyChoice;
    },

    getParty: function() { return this.party; },

    // Input //////////////////////////////////////////////////////////////////
    initInput: function() {
      ig.input.bind(ig.KEY.MOUSE1, 'mouseDown');
      ig.input.initMouse();

      this.bWasMouseDown = false;
      this.lastMousePos.x = ig.input.mouse.x;
      this.lastMousePos.y = ig.input.mouse.y;
    },

    updateInput: function() {
      var bConsumed = false;

      var bMouseIsDown = ig.input.state('mouseDown');

      if (bMouseIsDown && !this.bWasMouseDown) {
        bConsumed = this.onPress(ig.input.mouse);
      }
      else if (this.bWasMouseDown && !bMouseIsDown) {
        bConsumed = this.onRelease(ig.input.mouse);
      }

      this.bWasMouseDown = ig.input.state('mouseDown');
      this.lastMousePos.x = ig.input.mouse.x;
      this.lastMousePos.y = ig.input.mouse.y;

      return bConsumed;
    },

    onPress: function(mousePos) {
      var bConsumed = false;

      if (this.curState) {
        bConsumed = this.curState.onPress(mousePos);
      }

      if (!bConsumed && UiManager._manager) {
        bConsumed = UiManager._manager.onPress(mousePos);
      }

      if (!bConsumed && SoftLabel.manager) {
        bConsumed = SoftLabel.manager.onPress(mousePos);
      }
    },

    onRelease: function(mousePos) {
      var bConsumed = false;

      if (this.curState) {
        bConsumed = this.curState.onRelease(mousePos);
      }

      if (!bConsumed && UiManager._manager) {
        bConsumed = UiManager._manager.onRelease(mousePos);
      }
    },

    // Game State Management //////////////////////////////////////////////////
    enterNewState: function(nextState) {
      if (this.curState) {
        this.curState.startExtro(nextState);
      }

      if (nextState) {
        nextState.startIntro();
      }

      this.nextState = nextState;
    },

    exitCurrentState: function(nextState) {
      this.enterNewState(nextState);
    },

    setState: function(newState) {
      if (newState !== this.curState) {
        var oldState = this.curState;
        this.curState = newState;

        if (oldState) {
          oldState.forceOff();
        }

        if (newState) {
          newState.forceOn();
        }

        this.nextState = null;
      }
    },

    // Update and Draw Loops //////////////////////////////////////////////////
    update: function() {
      var newTime = (new Date).getTime();
      this.dt = (newTime - this.lastTime) * .001;

      this.dt = 0.033;

      this.lastTime = newTime;

      if (this.curState) {
        this.curState.update(this.dt);
      }

      if (this.nextState) {
        this.nextState.update(this.dt);
      }

      if (!this.updateInput()) {
        var bConsumed = false;

        if (SoftLabel.manager) {
          bConsumed = SoftLabel.manager.update();
        }

        if (!bConsumed && UiManager._manager) {
          UiManager._manager.update();
        }
      }
    },

    draw: function() {
      this.parent();

      if (this.curState) {
        this.curState.draw();
      }

      if (this.nextState) {
        this.nextState.draw();
      }

      if (SoftLabel.manager) {
        SoftLabel.manager.draw();
      }

      if (UiManager._manager) {
        UiManager._manager.draw();
      }
    }

  });

  // Create the Game Instance /////////////////////////////////////////////////
  ig.game = ig.main( '#canvas', ig.CampaignChallenge, 60, ig.CCConstants.WIDTH, ig.CCConstants.HEIGHT, 1 );

});
