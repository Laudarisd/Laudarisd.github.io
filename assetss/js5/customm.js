(function($) {
    'use strict';
    $(window).load(function() {
    /* PreLoader */
        $('.status').fadeOut();
        $('.preloader').delay(350).fadeOut('slow');
        /* Init GMaps */
        $(".gmap").each(function() {
            var a = $(this).attr('data-center');
            $(this).mobileGmap({
                markers: [{
                    position: "center",
                    info: a,
                    showInfo: !0
                }]
            })
        });
    });
    /* Backstretch */
    /*$.backstretch('assets/images/background/home.png');*/
    /* Animation Backstretch On Page Load */
    
    /* Init Text Rotator */
    $(".description .sub").typed({
        strings: ["AI Engineer ","Programmer ", "Data Analyst"],
        typeSpeed: 1,
        backSpeed: 1,
        backDelay: 1400,
        loop: true
    });
    /* Optional Init Animation Reveal    new WOW().init(); */

})(jQuery);