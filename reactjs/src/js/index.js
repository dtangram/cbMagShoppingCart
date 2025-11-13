$(document).ready(() => {
  $(window).scroll((event) => {
    if ($(window).scrollTop() > 940) {
      $('.bckColor').stop().animate({ opacity: '1' }, 150);
      $('#bck').stop().animate({ opacity: '0', display: 'none' }, 500);
    }

    if ($(window).scrollTop() < 920) {
      $('.bckColor').stop().animate({ opacity: '0' }, 200);
      $('#bck').stop().animate({ opacity: '1', display: 'block' }, 200);
    }
  });

  /* AUTOMATIC COPYRIGHT YEAR CHANGE */
  const today = new Date();
  const year = today.getFullYear();
  $('footer div:nth-child(1) p').html(`${year}, Music Trivia. All rights reserved.`);
});
