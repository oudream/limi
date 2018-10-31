let keybord = {
};
define && define(['jquery'], function($) {
    keybord.Keyboard = function() {
        this.cancel = function() {
            $('#keyboard-container', window.top.document).remove();
        };
    };
    /**
     * 单列模式
     */
    keybord.Init = (function() {
        let instance;
        return function() {
            if (!instance) {
                instance = new keybord.Keyboard;
            }
            return instance;
        };
    })();
    keybord.Keyboard.prototype.create = function() {
        $(document).on('click', 'input', function() {
            $('#keyboard-container', window.top.document).remove();
            let ele = document.activeElement;
            let position = $(ele).offset();
            let div = `<div id="keyboard-container" style="position: absolute;top:${position.top + 70}px;left:${position.left-170}px"></div>`;
            $('body').append(div);
            let div1 = `<ul id="keyboard">

		<li class="symbol"><span class="off">\`</span><span class="on">~</span></li>

		<li class="symbol"><span class="off">1</span><span class="on">!</span></li>

		<li class="symbol"><span class="off">2</span><span class="on">@</span></li>

		<li class="symbol"><span class="off">3</span><span class="on">#</span></li>

		<li class="symbol"><span class="off">4</span><span class="on">$</span></li>

		<li class="symbol"><span class="off">5</span><span class="on">%</span></li>

		<li class="symbol"><span class="off">6</span><span class="on">^</span></li>

		<li class="symbol"><span class="off">7</span><span class="on">&amp;</span></li>

		<li class="symbol"><span class="off">8</span><span class="on">*</span></li>

		<li class="symbol"><span class="off">9</span><span class="on">(</span></li>

		<li class="symbol"><span class="off">0</span><span class="on">)</span></li>

		<li class="symbol"><span class="off">-</span><span class="on">_</span></li>

		<li class="symbol"><span class="off">=</span><span class="on">+</span></li>

		<li class="delete lastitem">delete</li>

		<li class="tab">tab</li>

		<li class="letter">q</li>

		<li class="letter">w</li>

		<li class="letter">e</li>

		<li class="letter">r</li>

		<li class="letter">t</li>

		<li class="letter">y</li>

		<li class="letter">u</li>

		<li class="letter">i</li>

		<li class="letter">o</li>

		<li class="letter">p</li>

		<li class="symbol"><span class="off">[</span><span class="on">{</span></li>

		<li class="symbol"><span class="off">]</span><span class="on">}</span></li>

		<li class="symbol lastitem"><span class="off">\\</span><span class="on">|</span></li>

		<li class="capslock">caps lock</li>

		<li class="letter">a</li>

		<li class="letter">s</li>

		<li class="letter">d</li>

		<li class="letter">f</li>

		<li class="letter">g</li>

		<li class="letter">h</li>

		<li class="letter">j</li>

		<li class="letter">k</li>

		<li class="letter">l</li>

		<li class="symbol"><span class="off">;</span><span class="on">:</span></li>

		<li class="symbol"><span class="off">'</span><span class="on">&quot;</span></li>

		<li class="return lastitem">return</li>

		<li class="left-shift">shift</li>

		<li class="letter">z</li>

		<li class="letter">x</li>

		<li class="letter">c</li>

		<li class="letter">v</li>

		<li class="letter">b</li>

		<li class="letter">n</li>

		<li class="letter">m</li>

		<li class="symbol"><span class="off">,</span><span class="on">&lt;</span></li>

		<li class="symbol"><span class="off">.</span><span class="on">&gt;</span></li>

		<li class="symbol"><span class="off">/</span><span class="on">?</span></li>

		<li class="right-shift lastitem">shift</li>

		<li class="space lastitem">&nbsp;</li>

	</ul>`;
            $('#keyboard-container').append(div1);
        });
        // $(document).on('click', 'body', function() {
        //     $('#keyboard-container', window.top.document).remove();
        // });
    };
});
