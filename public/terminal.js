/*
Original from Eric Bidelman (ericbidelman@chromium.org) at www.html5rocks.com/en/tutorials/file/filesystem/terminal.html
I modified it a lot though, building the DOM-elements within the function and no file-handling stuff because I only needed a terminal in a website :)
*/

var Terminal = function(container){

    // building DOM elements start
    var outputEl = document.createElement('output');
    outputEl.id = 'outputContainer';
    container.appendChild(outputEl);

    var inputLineDiv = document.createElement('div');
    inputLineDiv.id  = 'input-line';
    inputLineDiv.className = 'input-line';
    container.appendChild(inputLineDiv);
        
    var promptDiv = document.createElement('div');
    promptDiv.className = 'prompt';
    promptDiv.innerHTML = '>';
    inputLineDiv.appendChild(promptDiv);

    var div = document.createElement('div');
    inputLineDiv.appendChild(div);

    var cmdlineInput = document.createElement('input');
    cmdlineInput.id = 'cmdLineContainer';
    cmdlineInput.className = 'cmdline';
    div.appendChild(cmdlineInput);
    document.querySelector('#cmdLineContainer').autofocus = true;
    // building DOM elements end


    var cmdLine_ = document.querySelector('#cmdLineContainer');
    var output_ = document.querySelector('#outputContainer');

    var history_ = [];
    var histpos_ = 0;
    var histtemp_ = 0;

    window.addEventListener('click', function(e){
        cmdLine_.focus();
    }, false);

    // Always force text cursor to end of input line.
    cmdLine_.addEventListener('click', inputTextClick_, false);
    // Handle up/down key presses for shell history and enter for new command.
    cmdLine_.addEventListener('keydown', historyHandler_, false);
    cmdLine_.addEventListener('keydown', processNewCommand_, false);

    function inputTextClick_(e){
        this.value = this.value;
    }

    function historyHandler_(e){ // Tab needs to be keydown.
        if(history_.length){
            if(e.keyCode == 38 || e.keyCode == 40){
                if(history_[histpos_])
                    history_[histpos_] = this.value;
                else
                    histtemp_ = this.value;
            }
            if(e.keyCode == 38){ // up
                histpos_--;
                if(histpos_ < 0) 
                    histpos_ = 0;
            } else if(e.keyCode == 40){ // down
                histpos_++;
                if(histpos_ > history_.length)
                    histpos_ = history_.length;
            }
            if(e.keyCode == 38 || e.keyCode == 40){
                this.value = history_[histpos_] ? history_[histpos_] : histtemp_;
                this.value = this.value; // Sets cursor to end of input.
            }
        }
    }

    function processNewCommand_(e){
        if(e.keyCode == 13){ // enter
            // Save shell history.
            if(this.value){
                history_[history_.length] = this.value;
                histpos_ = history_.length;
            }

            // Duplicate current input and append to output section.
            var line = this.parentNode.parentNode.cloneNode(true);
            line.removeAttribute('id')
            line.classList.add('line');
            var input = line.querySelector('input.cmdline');
            input.autofocus = false;
            input.readOnly = true;
            output_.appendChild(line);

            var cmd = this.value;

            switch(cmd){
                case 'clear':
                    output_.innerHTML = '';
                    this.value = '';
                    return;
                default:
                    if(cmd){
                        output(cmd);// + ': command not found');
                    }
            };
            this.value = '';
        }
    }

    function output(html){
        handleOutput(html);
        //output_.insertAdjacentHTML('beforeEnd', html);
    }
};

Terminal.prototype.write = function(html) {
    document.querySelector('#outputContainer').insertAdjacentHTML('beforeEnd', html + '<br>');
};
