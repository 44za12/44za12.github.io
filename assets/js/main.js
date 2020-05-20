(function ($) {
    "use strict";


    jQuery(document).ready(function($){

        /* ---------------------------------------------
            ## Sidebar Script
        --------------------------------------------- */
        var w = $(window).width();
        var MarginTop = (w > 1199) ? 80 : 0;
        if ($('.sidebar').length) {
            $('.sidebar').theiaStickySidebar({
                'containerSelector': '.blog-details',
                'additionalMarginTop': MarginTop,
                'minWidth': 992,
            });
        }

        var w = $(window).width();
        var MarginTop = (w > 1199) ? 80 : 0;
        if ($('.product-sidebar').length) {
            $('.product-sidebar').theiaStickySidebar({
                'containerSelector': '.product-page',
                'additionalMarginTop': MarginTop,
                'minWidth': 992,
            });
        }

        // magnific Popup
        $(".test-popup-link").click(function(event){
            event.preventDefault();
        });
        $('.test-popup-link').magnificPopup({
            type: 'image'
            // other options
        });


        $('.single-divide-box').addClass('el-hidden');
        $('.divide-box-menu').find('button').removeClass('active');
        $('.single-divide-box[data-filter-for="image"]').removeClass('el-hidden');
        $('.divide-box-menu').find('button[id="for-images"]').addClass('active');
        // filtering for our gallery page
        $('.divide-box-menu').find('button').on('click', function(){
            var idValue = $(this).attr('id');
            if(idValue == 'for-images') {
                $('.single-divide-box[data-filter-for="image"]').removeClass('el-hidden');
                $('.single-divide-box[data-filter-for="video"]').addClass('el-hidden');
            } else if (idValue == 'for-videos') {
                $('.single-divide-box[data-filter-for="video"]').removeClass('el-hidden');
                $('.single-divide-box[data-filter-for="image"]').addClass('el-hidden');
            }
            if($(this).hasClass('active')) {
            } else {
                $('.divide-box-menu').find('button').removeClass('active');
                $(this).addClass('active');
            }
        })
        

        // category filtering
        function elemHide(elemID, elemCls) {
            $('.item').css({
                "display": "none"
            });
        }
        elemHide();
        $('.agriculture').css({
            "display" : "block"
        });

        $("select.category").change(function(){
            var selectedCategory = $(this).children("option:selected");
            var selectedCategoryVal = $(this).children("option:selected").val();
            if(selectedCategory.val() == 'agriculture') {
                elemHide();
                $('.agriculture').css({
                    "display" : "block"
                });
                $('.breadcrumb-content').find('.title').html('Agriculture');
                $('#current-page').html('Agriculture');
                $('.part-img').find('.breadcrumb-img').attr("src", "assets/img/breadcrumb-img.png");
            } else if (selectedCategory.val() == 'camera') {
                elemHide();
                $('.camera').css({
                    "display" : "block"
                });
                $('.breadcrumb-content').find('.title').html('Cameras');
                $('#current-page').html('Cameras');
                $('.part-img').find('.breadcrumb-img').attr("src", "assets/img/breadcrumb-img-2.png");
            }
        });

        // layout change
        $('#list-layout').on('click', function(){
            $('.item').addClass('list-layout');
        });
        $('#grid-layout').on('click', function(){
            $('.item').removeClass('list-layout');
        });

        // magnificPopup
        $('.mfp-iframe').magnificPopup({
            type: 'video'
        });
        $('.image-popup').magnificPopup({
            type: 'image'
        }); 

        // counter
        $('.counter').counterUp({
            delay: 10,
            time: 1000
        });
   
        // rangeslider 
        if ($('#my-slider').length > 0) {
            var newRangeSlider = new ZBRangeSlider('my-slider');

            newRangeSlider.onChange = function (min, max) {
                console.log(min, max, this);
                document.getElementById('result').innerHTML = '$' + min + ' - $' + max;
                document.getElementById('min-todas').innerHTML = '$' + min;
                document.getElementById('max-todas').innerHTML = '$' + max;
            }

            newRangeSlider.didChanged = function (min, max) {
                console.log(min, max, this);
                document.getElementById('result').innerHTML = '$' + min + ' - $' + max;
            }
        }

         // product slider
         var productCarousel = $('.product-slider');
         var leftBtn = '<svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="chevron-double-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="svg-inline--fa fa-chevron-double-left fa-w-12 fa-fw fa-2x"><path fill="currentColor" d="M349.5 475.5l-211.1-211c-4.7-4.7-4.7-12.3 0-17l211.1-211c4.7-4.7 12.3-4.7 17 0l7.1 7.1c4.7 4.7 4.7 12.3 0 17L178.1 256l195.5 195.5c4.7 4.7 4.7 12.3 0 17l-7.1 7.1c-4.7 4.6-12.3 4.6-17-.1zm-111 0l7.1-7.1c4.7-4.7 4.7-12.3 0-17L50.1 256 245.5 60.5c4.7-4.7 4.7-12.3 0-17l-7.1-7.1c-4.7-4.7-12.3-4.7-17 0l-211.1 211c-4.7 4.7-4.7 12.3 0 17l211.1 211c4.8 4.8 12.4 4.8 17.1.1z" class=""></path></svg>';
         var rightBtn = '<svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="chevron-double-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="svg-inline--fa fa-chevron-double-right fa-w-12 fa-fw fa-2x"><path fill="currentColor" d="M34.5 36.5l211.1 211c4.7 4.7 4.7 12.3 0 17l-211.1 211c-4.7 4.7-12.3 4.7-17 0l-7.1-7.1c-4.7-4.7-4.7-12.3 0-17L205.9 256 10.5 60.5c-4.7-4.7-4.7-12.3 0-17l7.1-7.1c4.6-4.6 12.2-4.6 16.9.1zm111 0l-7.1 7.1c-4.7 4.7-4.7 12.3 0 17L333.9 256 138.5 451.5c-4.7 4.7-4.7 12.3 0 17l7.1 7.1c4.7 4.7 12.3 4.7 17 0l211.1-211c4.7-4.7 4.7-12.3 0-17l-211.1-211c-4.8-4.8-12.4-4.8-17.1-.1z" class=""></path></svg>';
         productCarousel.owlCarousel({
             loop: true,
             dots: true,
             nav: false,
             margin: 0,
             autoplay: false,
             startPosition: 2,
             autoplayTimeout: 4000,
             autoplayHoverPause: true,
             navText: [leftBtn, rightBtn],
             thumbs: true,
             thumbsPrerendered: true,
             animateOut: 'fadeOut',
                animateIn: 'fadeIn',
             responsive: {
                 0: {
                     items: 1
                 },
                 768: {
                     items: 1
                 },
                 960: {
                     items: 1
                 },
                 1200: {
                     items: 1
                 },
                 1920: {
                     items: 1
                 }
             }
         }); 

        // testimonial 2 slider
        var productCarousel = $('.testimonial-2-slider');
        productCarousel.owlCarousel({
            loop: true,
            dots: true,
            nav: false,
            margin: 10,
            autoplay: true,
            startPosition: 2,
            autoplayTimeout: 3000,
            autoplayHoverPause: false,
            navText: ['', ''],
            thumbs: true,
            thumbsPrerendered: true,
            responsive: {
                0: {
                    items: 1
                },
                768: {
                    items: 1
                },
                960: {
                    items: 1
                },
                1200: {
                    items: 1
                },
                1920: {
                    items: 1
                }
            }
        }); 

        // testimonial 2 slider
        var ourGalleryCarousel = $('.our-gallery-slider');
        ourGalleryCarousel.owlCarousel({
            loop: true,
            dots: true,
            nav: false,
            margin: 10,
            autoplay: true,
            startPosition: 2,
            autoplayTimeout: 3000,
            navText: [leftBtn, rightBtn],
            autoplayHoverPause: true,
            thumbs: true,
            thumbsPrerendered: true,
            responsive: {
                0: {
                    items: 1
                },
                768: {
                    items: 1
                },
                960: {
                    items: 1
                },
                1200: {
                    items: 1
                },
                1920: {
                    items: 1
                }
            }
        }); 

        // item selected count function
        var stakeCount = parseInt($('.item-selected-count').find('.number').val());
        $('.item-selected-count').find('.number').wrap('<span id="number-replace"></span>');
        $('.item-selected-count').find('#number-replace').html(stakeCount);
        $('#increment-number').on('click', function(){
                stakeCount++;
                $('.number').val(stakeCount);
                $('.item-selected-count').find('#number-replace').html(stakeCount);
        });
        $('#decreament-number').on('click', function(){
            if(stakeCount > 1) {
                stakeCount--;
                $('.number').val(stakeCount);
                $('.item-selected-count').find('#number-replace').html(stakeCount);
            }
        });

        // give rating
        $('.rating-comment').find('.single-star').on('click', function(){
            if($(this).hasClass('active')) {
                $(this).removeClass('active');
            } else {
                $(this).addClass('active');
            }
        })

        // gallery slider
        var galleryCarousel = $('.gallery-slider');
        galleryCarousel.owlCarousel({
            loop: true,
            dots: true,
            nav: false,
            margin: 30,
            autoplay: true,
            startPosition: 2,
            autoplayTimeout: 4000,
            autoplayHoverPause: true,
            navText: ['<i class="fas fa-angle-double-left"></i>', '<i class="fas fa-angle-double-right"></i>'],
            responsive: {
                0: {
                    items: 1
                },
                768: {
                    items: 1
                },
                960: {
                    items: 1
                },
                1200: {
                    items: 1
                },
                1920: {
                    items: 1
                }
            }
        }); 

        // testimonial slider
        var testimonialCarousel = $('.testimonial-slider');
        testimonialCarousel.owlCarousel({
            loop: true,
            dots: true,
            nav: false,
            margin: 30,
            autoplay: true,
            startPosition: 2,
            autoplayTimeout: 4000,
            autoplayHoverPause: true,
            navText: ['<i class="fas fa-angle-double-left"></i>', '<i class="fas fa-angle-double-right"></i>'],
            responsive: {
                0: {
                    items: 1
                },
                768: {
                    items: 1
                },
                960: {
                    items: 1
                },
                1200: {
                    items: 1
                },
                1920: {
                    items: 1
                }
            }
        }); 

        // brand slider
        var brandCarousel = $('.brand-slider');
        brandCarousel.owlCarousel({
            loop: true,
            dots: true,
            nav: false,
            margin: 30,
            autoplay: true,
            startPosition: 2,
            autoplayTimeout: 4000,
            autoplayHoverPause: true,
            navText: ['', ''],
            responsive: {
                0: {
                    items: 2
                },
                768: {
                    items: 3
                },
                960: {
                    items: 4
                },
                1200: {
                    items: 5
                },
                1920: {
                    items: 5
                }
            }
        }); 

        // scroll to top
        $(".back-to-top-button").on('click', function(){
            $('html, body').animate({scrollTop : 0},100);
        });

    });

    $(window).on('load',function(){
        var preLoder = $(".preloader");
        preLoder.fadeOut(1000);

        var $filterizr = $('.filterizr__elements');
        if($filterizr.length) {
            var $filterizrControls = $('.filterizr__controls');
            $filterizr.filterizr();
            $filterizrControls.children('li').click(function() {
                $filterizrControls.find('li.active').removeClass('active');
                $(this).addClass('active');
            });
        }

        setInterval(function(){ 
            $(".banner .part-img").addClass("active")
        }, 1000);
    });

    // fixed navbar
    $(window).on("scroll", function(){
        var fixed_top = $(".header");
        if( $(window).scrollTop() > 100){  
            fixed_top.addClass("animated fadeInDown navbar-fixed");
            if ($(window).width() < 960) {
                $('.header').removeClass('animated fadeInDown navbar-fixed');
            }
        }
        else{
            fixed_top.removeClass("animated fadeInDown navbar-fixed");
        }
       
    });

    $(window).on("scroll", function(){
        if( $(window).scrollTop() > 400){
            $('.back-to-top-button').fadeIn();
            $('.back-to-top-button').addClass('active');
        }  else {
            $('.back-to-top-button').fadeOut();
            $('.back-to-top-button').removeClass('active');
        }
    });


    // count down
    var nodes = $('.timer');
    $.each(nodes, function (_index, value) {
        var date = $(this).data('date');

        setInterval(() => {

            var endTime = new Date(date);
            endTime = (Date.parse(endTime) / 1000);

            var now = new Date();
            now = (Date.parse(now) / 1000);

            var timeLeft = endTime - now;

            var days = Math.floor(timeLeft / 86400);
            var hours = Math.floor((timeLeft - (days * 86400)) / 3600);
            var minutes = Math.floor((timeLeft - (days * 86400) - (hours * 3600)) / 60);
            var seconds = Math.floor((timeLeft - (days * 86400) - (hours * 3600) - (minutes * 60)));

            if (hours < "10") { hours = "0" + hours; }
            if (minutes < "10") { minutes = "0" + minutes; }
            if (seconds < "10") { seconds = "0" + seconds; }

            $(value).find('.day').html(days);
            $(value).find('.hour').html(hours);
            $(value).find('.minute').html(minutes);
            $(value).find('.second').html(seconds);

        }, 1000);

        
       

    }); 

    
    
}(jQuery));
