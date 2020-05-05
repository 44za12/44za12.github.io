(function ($) {
    "use strict";

    $(window).on("scroll", function(){ 
        var $section = $('.amazing-feature');
        var scrollOffset = $(document).scrollTop();
        var containerOffset = $section.offset().top - window.innerHeight;
        if (scrollOffset > containerOffset) {
            $('.af-shape-1').addClass('active');
            $('.af-shape-2').addClass('active');
        }
    });
    
}(jQuery));	