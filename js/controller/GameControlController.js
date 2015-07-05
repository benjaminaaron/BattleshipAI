/**
 * Handles Events on the application's div element gameControl
 * @constructor
 */
var GameControlController = function(driver){
    this.driver = driver;
    this.registerButtonHandlers();
    this.showStatusInfo('game hasn\'t started yet&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
    $('#resetBtn').hide();
    $('#readyBtn').hide();
}

GameControlController.prototype = {
    //__proto__: AbstractController.prototype,

    /**
     * Register EventHandlers on gamecontrol's buttons to start/reset the game, give info/help
     * or finish set up.
     */
    registerButtonHandlers: function(){
        var self = this;
        $('#startBtn').on('click', function() {
            //console.log(self);
            self.driver.startGame.apply(self.driver);
        });
        $('#resetBtn').on('click', this.reset);
        $('#infoBtn').on('click', this.info);
        $('#readyBtn').on('click', function() {
            game.currentPlayer.iAmDoneSettingUp()
        });    // iAmDoneSettingUp does not exist at this point!
    },

    /**
     * Hides all buttons that are not necessary for game play phase.
     * Displays an additional reset button.
     */
    handleButtonDisplay: function() {
        $('#gameOptions').hide();
        $('#startBtn').hide();
        $('#gameviewRadioBtn').hide();
        $('#statsviewRadioBtn').hide();
        $('#resetBtn').show();
        $('#verboseToggle').hide();
    },

    /**
     * Displays the appropriate text within the status info field inside the game's toolbar.
     */
    showStatusInfo: function(statusMsg) {
        $('#statusLabel').html(statusMsg);
    },

    /**
     * CB function that shows an alert box with information on how to use the battleship application.
     * Gets called as soon as user clicks the "info" button inside the game control bar.
     */
    info: function(){
        var str = 'Setup phase:\n' +
            '- drag elements to place them\n' +
            '- click on a ship will flip its orientation\n' +
            '- click on the field will randomly place all elements\n' +
            '- click on your board outside of the field means you finished setting up elements\n\n' +
            'Play phase:\n' +
            '- just go ahead shooting around on the opponents field\n\n' +
            'Build by:\n@stehrenberg\n@chanton1392\n@abstractCalculus\n@benjaminaaron\n\n' +
            'More info at:\nhttps://github.com/benjaminaaron/BattleshipAI';
        alert(str);
    },

    /**
     * CB function that performs a simple page reload as application reset.
     * Gets called as soon as the user clicks on the game control's "reset" button.
     */
    reset: function(){
        location.reload();
    }
}
