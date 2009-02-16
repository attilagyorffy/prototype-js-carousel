/**
* Carousel for Prototype JS by Attila Györffy
* 
* License: GNU General Public License (http://www.gnu.org/licenses/gpl.html)
* Author: Attila Gyürffy (http://attilagyorffy.com)
*
* Dependencies:
*   - Prototype JS (v1.6 - http://www.prototypejs.org/)
*   - stylesheets/carousel.css
* 
* See README file for more details.
*
**/

var Carousel = Class.create({
    /**
     * Guess what? Sets up the Carousel.
     */
    initialize: function(container) {
        this.container = $(container);
        if (this.container) {
            this.nodes = $A([]);
            this.currentOffset = 0;
            this.callback = false;
            this.setupCarousel();
        }
    },

    /**
     * Catches children elements in array for later manipulation.
     * Creates the navigation controls in the DOM right after the Carousel element
     */
    setupCarousel: function() {
        
        this.container.childElements().each(function(child) {
          this.nodes.push(child.down('li'));
          child.hide();
        }.bind(this));
        this.container.childElements()[0].show();
        this.nodes_length = this.nodes.length;
        
        // Creates the navigation controls, buttons
        this.controls   = new Element('div', { 'id': this.container.id + '_controls', 'class': 'carouselControl' }).setStyle({ 'width': this.container.getWidth() + 'px' });
        this.nextButton = new Element('a', { 'id': this.container.id + '_next', 'href': '#', 'class': 'button next' }).update("Next image");
        this.prevButton = new Element('a', { 'id': this.container.id + '_prev', 'href': '#', 'class': 'button prev' }).update("Previous image").hide();
        
        // Adding observers to the navigation controls
        this.prevButton.observe('click', function(event) {
          event.stop();
          this.prevButton.blur();
          this.displayPrevious();
        }.bindAsEventListener(this));
        
        this.nextButton.observe('click', function(event) {
          event.stop();
          this.nextButton.blur();
          this.displayNext();
        }.bindAsEventListener(this));

        this.controls.appendChild(this.prevButton);
        this.controls.appendChild(this.nextButton);
        
        // Appends the navigation controls into the DOM
        this.container.insert ({
          'after':
            this.controls
          }
        );
    },

    /**
     * Displays the next node in order.
     **/
    displayNext: function() {
        next = ((this.currentOffset + 1) != this.nodes_length) ? this.currentOffset + 1 : 0;
        this.container.childElements().each(function(child){
          child.hide();
        });
        this.container.childElements()[next].show();
        this.currentOffset = next;
        this.toggleControls();
        this.triggerCallback(); // this.onNext; ?
    },
    
    /**
     * Displays the previous node in order.
     **/
    displayPrevious: function() {
        prev = (this.currentOffset != 0) ? this.currentOffset - 1 : 0;
        this.container.childElements().each(function(child){
          child.hide();
        });
        this.container.childElements()[prev].show();
        this.currentOffset = prev;
        this.toggleControls();
        this.triggerCallback(); // TODO: this.onPrevious; ?
    },

    /**
     * Triggers the callback function if it had been specified using setCallback().
     * 
     **/
    triggerCallback: function() {
      if (this.callback) setTimeout(this.callback, 0);
    },
    
    /**
     * Sets a callback function to be triggered after the slides.
     * Declare your function somewhere and use setCallback(functionName) like
     * car = new Carousel('carouselDemo);
     * car.setCallback(reloadAds);
     *
     * TODO: implement this in an elegant way with Carousel observers, like this:
     * 
     *   car = new Carousel('carouselDemo');
     *   car.addObserver('onNext', function()
     *   {
     *     // do stuff here so the actual functionality
     *     // will stay outside of the Carousel class and it just works
     *     // as a callback function. Beautiful.
     *   });
     * 
     **/
    setCallback: function(func) {
        this.callback = func;
    },
    
    /**
     * Shows/hides next and previous buttons depending on the current state of the Carousel
     **/
    toggleControls: function() {
        if (this.currentOffset == 0) { this.prevButton.hide(); } else { this.prevButton.show(); }
        if ((this.currentOffset + 1) == this.nodes_length) { this.nextButton.hide(); } else { this.nextButton.show(); }
    }

});