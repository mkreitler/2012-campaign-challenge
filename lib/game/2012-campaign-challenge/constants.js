ig.module( 
  'game.2012-campaign-challenge.constants' 
)
.defines(function(){

  ig.CCConstants = ig.Class.extend({
  });

  // Start the Game with 60fps, a resolution of 320x240, scaled
  // up by a factor of 2
  ig.CCConstants.WIDTH              = 1024;
  ig.CCConstants.HEIGHT             = 768;
  ig.CCConstants.STATE_TIME_IN      = 0.75;
  ig.CCConstants.STATE_TIME_OUT     = 0.75;

  ig.CCConstants.TRANSDIR           = {FORWARD: 1,
                                       BACKWARD: -1};

  ig.CCConstants.INFO_URL           = ["http://www.barackobama.com/",
                                       "http://www.garyjohnson2012.com/",
                                       "http://www.mittromney.com/"];
                                       
  ig.CCConstants.TOP_BANNER_HEIGHT  = 208;

  ig.CCConstants.PARTY              = {DEMOCRAT: 0,
                                       LIBERTARIAN: 1,
                                       REPUBLICAN: 2},

  ig.CCConstants.TEXT_LEARN_MORE    = "Learn More";

  ig.CCConstants.TEXT_NEXT          = "Next";
  ig.CCConstants.TEXT_BACK          = "Back";

  ig.CCConstants.TEXT_PLAY_GAME     = "Play Game";
  ig.CCConstants.TEXT_READ_RULES    = "Read Rules";

  ig.CCConstants.TEXT_TITLE_BANNER  = "2012 Campaign Challenge";

  ig.CCConstants.TEXT_CHOOSE_INTRO  = "Welcome, Candidate!";
  ig.CCConstants.TEXT_CHOOSE_LINES  = ["Congratulations on your",
                                       "decision to run for office.",
                                       "",
                                       "Which party's nomination",
                                       "will you accept?"];

  ig.CCConstants.TEXT_MEET_INTRO  = "Meet Your Opponents";
  ig.CCConstants.TEXT_MEET_LINES  = ["Press 'next' to continue or",
                                     "'back' to re-select your party."];

  ig.CCConstants.OPPONENT_BIO     = [["bBarak Obama",
                                     "rSupports Occupation of Afghanistan",
                                     "rWould Support Israeli War on Iran",
                                     "rSupports Use of Drones Within the U.S.",
                                     "rSupports the Patriot Act",
                                     "rSupports the NDAA",
                                     "bWants a Balanced Budget in 6 Years",
                                     "bSupports Gay Marriage",
                                     "bSupports Abortion Rights"],

                                    ["rGary Johnson",
                                     "bOpposes Occupation of Afghanistan",
                                     "bOpposes War on Iran",
                                     "bOpposes Use of Drones Within the U.S.",
                                     "bOpposes the Patriot Act",
                                     "bOpposes the NDAA",
                                     "bWants a Balanced Budget Next Year",
                                     "bSupports Gay Marriage",
                                     "bSupports Abortion Rights"],                                     

                                    ["bMitt Romney",
                                     "rSupports Occupation of Afghanistan",
                                     "rWould Support Israeli War on Iran",
                                     "rSupports Use of Drones Within the U.S.",
                                     "rSupports the Patriot Act",
                                     "rSupports the NDAA",
                                     "bWants a Balanced Budget in 20 Years",
                                     "rOpposes Gay Marriage",
                                     "rOpposes Abortion Rights"]];                                     

});
