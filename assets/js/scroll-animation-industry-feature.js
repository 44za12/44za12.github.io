(function ($) {
    "use strict";

    $(window).on("scroll", function(){ 
        
        var $section2 = $('.industry-feature');
        var scrollOffset = $(document).scrollTop();
        var containerOffset2 = $section2.offset().top - window.innerHeight;
        if (scrollOffset > containerOffset2) {
            $('.industry-drone').addClass('active');
        }
       
    });
    
}(jQuery));	