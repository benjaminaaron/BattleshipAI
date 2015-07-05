/**
* The driver module provides controlling logic for the whole application.
*/

/**
 *
 * @constructor
 */
var Driver = function() {
    this.game;
    this.viewModule;
    this.verbose = true;
}

Driver.prototype = {

    /**
     * Renders the game control bar within the browser window.
     * Displays the appropriate buttons and status msg for init phase.
     * Called upon creation of the driver script.
     */
    initializeApplication: function() {
        this.registerElementController();
		this.hidePreloadedImages();
    },

	hidePreloadedImages: function () {
		// This is good enough when using localhost but it might be too early when on the web
		$('.preload-images').hide();
	},

    /**
     * Register EventHandlers on gamecontrol's buttons to start/reset the game, give info/help
     * or finish set up.
     */
    registerElementController: function() {
        this.gameControlController = new GameControlController(this);
    },

    /**
     * Callback-Method that handles the overall logic required for starting the game.
     * Is called from index.html as soon as user clicks the "start game" button inside the game control bar.
     */
    startGame: function() {
        if($('#verboseToggle').prop('checked'))
            this.verbose = true;
        else
            this.verbose = false;

        var players = this.initializePlayers();
        this.gameControlController.handleButtonDisplay();
        this.gameControlController.showStatusInfo('in <b>setup phase</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');

        var shipTypes = [
            new ShipType(1, 'gray', 2),
            new ShipType(5, 'aqua', 1),
            new ShipType(4, 'red', 1),
            new ShipType(3, 'lime', 1),
            new ShipType(2, 'orange', 2)
        ];

        game = new Game(players, shipTypes, this.viewModule);
        viewModule = new GameView();
        viewModule.init(document.getElementById('viewContainer'));

        game.start();
    },

    /**
     * Initializes Player objects as human players or bots, depending on input from the browser.
     */
    initializePlayers: function() {

        var players = [];
        players[0] = null;
        players[1] = null;
        var name;

        switch ($('#gameOptions').val()) {                            // DOM object containing a drop down menu where you can choose the playing mode
            case 'hb':
                name = prompt('Enter your name:', 'Max');
                players[0] = new Human(name);
                players[1] = this.createBot();
                break;
            case 'hh':
                name = prompt('Enter the name of Player 1:', 'Max');
                players[0] = new Human(name);
                name = prompt('Enter the name of Player 2:', 'Erika');
                players[1] = new Human(name);
                break;
            case 'bb':
                players[0] = this.createBot();
                players[1] = this.createBot();
                break;
        }

        return players;
    },

    createBot: function() {

        var bot = false;
        var type = prompt(
            'Choose the type of bot\n\n'
            + 'r\tRandomBot\n'
            + 'rd\tRandomDestroyerBot\n'
            + 'zsd\tZoningSquareDestroyerBot\n'
            + 'zrd\tZoningRectDestroyerBot\n'
            + 'bfr\tBruteForceReasonerBot\n',
            'bfr' // default text displayed inside prompt
        );

        switch (type) {
            case 'r':
                bot = new RandomBot('random bot');
                break;
            case 'rd':
                bot = new RandomDestroyerBot('random destroyer bot');
                break;
            case 'zsd':
                bot = new ZoningSquareDestroyerBot('zoning square destroyer bot');
                break;
            case 'zrd':
                bot = new ZoningRectDestroyerBot('zoning rect destroyer bot');
                break;
            case 'bfr':
                bot = new BruteForceReasonerBot('brute force reasoner bot');
                break;
        }

        if (!bot) {
            alert('invalid input or that type of bot is not implemented yet, random bot is chosen instead');
            bot = new RandomBot('random bot');
        }

        return bot;
    },


    /**
     * Gets a canvas element from the window object and performs the draw call that is provided by the view layer of our application.
     */
    draw: function() {
        window.requestAnimationFrame(viewModule.draw());
    }
}
