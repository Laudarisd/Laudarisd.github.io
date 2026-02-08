/*
========================================================
 custom.js
 Author : SD
 Purpose:
  - Typed text animation on home page
  - Preloader handling
  - Google map init (theme default)
  - "What can I do?" → Portfolio navigation + filtering
========================================================
*/

(function ($) {
    'use strict';

    /* ----------------------------------------------------
       WINDOW LOAD EVENTS
       ---------------------------------------------------- */
    $(window).load(function () {

        /* Preloader fade out */
        $('.status').fadeOut();
        $('.preloader').delay(350).fadeOut('slow');

        /* Initialize Google Maps (theme default behavior) */
        $(".gmap").each(function () {
            var centerText = $(this).attr('data-center');
            $(this).mobileGmap({
                markers: [
                    {
                        position: "center",
                        info: centerText,
                        showInfo: true
                    }
                ]
            });
        });
    });

    /* ----------------------------------------------------
       HOME PAGE TYPED TEXT ANIMATION
       ---------------------------------------------------- */
    $(".description .sub").typed({
        strings: [
            "AI Engineer ",
            "Programmer ",
            "Data Analyst "
        ],
        typeSpeed: 1,
        backSpeed: 1,
        backDelay: 1400,
        loop: true
    });

    /* ----------------------------------------------------
       OPTIONAL ANIMATION (disabled in original)
       ----------------------------------------------------
       new WOW().init();
    ---------------------------------------------------- */

    /* ====================================================
       "WHAT CAN I DO?" → PORTFOLIO PAGE + FILTER
       ==================================================== */

    /*
     Behavior:
      1) User clicks a service item in Profile page
      2) Same animation as clicking Portfolio menu button
      3) Portfolio page opens
      4) Corresponding MixItUp filter is applied
    */

    $(document).on('click', '.service-portfolio-link', function (e) {
        e.preventDefault();

        /* Read filter from clicked service */
        var filter = $(this).attr('data-filter') || 'all';

        /* ------------------------------------------------
           STEP 1: Hide home intro/menu
           (same behavior as menu click)
           ------------------------------------------------ */
        $('.menu > div').first().trigger('click');

        /* ------------------------------------------------
           STEP 2: Open portfolio page
           ------------------------------------------------ */
        $('.menu div.portfolio-btn').trigger('click');

        /* ------------------------------------------------
           STEP 3: Apply portfolio filter (after animation)
           ------------------------------------------------ */
        setTimeout(function () {

            /* Try clicking matching filter button */
            var $filterBtn = $('.project-controls .filter[data-filter="' + filter + '"]');
            if ($filterBtn.length) {
                $filterBtn.trigger('click');
                return;
            }

            /* Fallback: call MixItUp directly */
            try {
                $('#projects').mixItUp(
                    'filter',
                    filter === 'all' ? 'all' : filter
                );
            } catch (err) {
                /* Silent fail — keeps theme stable */
            }

        }, 700);
    });

})(jQuery);
