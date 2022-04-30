import Vue from 'vue'

export default {

    bind: function (el : any, binding : any, vnode: any) {

        binding.doRipple = (e : any) => {

            // Size
            var rect = el.getBoundingClientRect();
            var offsetWidth = el.offsetWidth;
            var offsetHeight = el.offsetHeight;
            var offsetX = e.clientX - rect.left;
            var offsetY = e.clientY - rect.top;
            var d = Math.max(offsetWidth, offsetHeight);
            if (d > 300) {
                d = 300;
            }

            //If ink doesnt already exists
            var inkContainer = el.querySelector(".lucid-ripple-container");
            if (inkContainer) {
                el.removeChild(inkContainer);
            }
            inkContainer = document.createElement('div');
            inkContainer.className = 'lucid-ripple-container';
            inkContainer.setAttribute('style', `
                position: absolute;
                top: 0;
                left:0;
                width:100%;
                height:100%;
                border-radius:inherit;
                z-index: 100;
                pointer-events: none;
                overflow: hidden;
                z-index: 9999999999;
            `);

            // Create ink
            var ink = document.createElement('div');
            ink.className = 'lucid-ripple';
            inkContainer.appendChild(ink);
            el.appendChild(inkContainer);

            //get click coordinates
            var x, y;

            // If offsets are no defined

            x = offsetX - (d / 2);
            y = offsetY - (d / 2);

            //set the position and add class
            ink.setAttribute('style', `
                position: absolute;
                top: ${y}px;
                left: ${x}px;
                width: ${d}px;
                height: ${d}px;
                background-color: ${binding.value};
                border-radius: 100%;
                max-width: 300px;
                max-height: 300px;
                transform: scale(0);
                transform-oring: 50% 50%;
                opacity: 0.9;
                pointer-events: none;
                transition: transform 750ms, opacity 750ms;
                z-index: 100;`);


            ink.offsetWidth;
            ink.style.transform = 'scale(2)';
            ink.style.opacity = '0';

            setTimeout(function(){
                if (inkContainer.parentNode)
                    el.removeChild(inkContainer);
            }, 750);

        }

        el.addEventListener("click", binding.doRipple);
    },

    // Remove Event Listener on destroy.
    unbind(el : any, binding : any) {
        el.removeEventListener("click", binding.doRipple);
    }

    
}