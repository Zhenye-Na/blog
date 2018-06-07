// JavaScript Document

$(document).ready(function(){
		
		
			var $content 		= $("#content");
				
			
		$('#content').easytabs({
		  defaultTab: "li#home-nav",
		  transitionIn: 'slideDown',
		  transitionOut: 'slideUp',
		  transitionInEasing: 'easeOutBounce',
		  transitionOutEasing: 'easeInOutBack',
		  animationSpeed: 1000,
		  transitionCollapse: 'fadeOut',
		  transitionUncollapse: 'fadeIn',
		  updateHash: false,
		});
	
		var $map 				= $('#map_canvas'),
			$tabContactClass 	= ('contact-container');
		
		
	var $container = $('#portfolios');

		
		$content.bind('easytabs:after', function(evt,tab,panel) {
				$map.gMap({
					zoom: 16,
					markers: [
						{ latitude: 47.660937,
                              longitude: 9.569803 }
					]
				});
				
					$container.isotope({
						filter				: '*',
						layoutMode   		: 'masonry',
						animationOptions	: {
						duration			: 750,
						easing				: 'linear',  
						
					   },
					   masonry: {
						columnWidth: 220,
						columnHeight: 240,
					  }
					});	
		});
		
		


	
	    
	
      var $optionSets = $('#options .option-set'),
          $optionLinks = $optionSets.find('a');

      $optionLinks.click(function(){
        var $this = $(this);
        // don't proceed if already selected
        if ( $this.hasClass('selected') ) {
          return false;
        }
        var $optionSet = $this.parents('.option-set');
        $optionSet.find('.selected').removeClass('selected');
        $this.addClass('selected');
  
        // make option object dynamically, i.e. { filter: '.my-filter-class' }
        var options = {},
            key = $optionSet.attr('data-option-key'),
            value = $this.attr('data-option-value');
        // parse 'false' as false boolean
        value = value === 'false' ? false : value;
        options[ key ] = value;

          // otherwise, apply new options
          $container.isotope( options );
        
        return false;
      });


    


		
		
	});