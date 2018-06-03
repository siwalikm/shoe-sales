let myApp = window.myApp || {};

myApp.price = (function ($) {
  let count = 0;
  tweetHash = {};
  let COST_USD = 153.79;
  let COST_INR = (COST_USD * 67).toFixed(2);
  var printTweet;
  const currency = ((amount, locales, currency) => {
    return new Intl.NumberFormat(locales, {
        style: 'currency',
        currency
      })
      .format(amount);
  });

  COST_USD = currency(COST_USD, 'en-US', 'USD');
  COST_INR = currency(COST_INR, 'en-IN', 'INR');

  $(document).ready(() => {
    // fetch twitter data and populate view
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        tweetHash = this.responseText;

        let parsedTweet = JSON.parse(tweetHash).statuses;

        let formattedTweet = [];
        parsedTweet.forEach((tweet) => {

          if (tweet.entities.urls.length) {
            tweet.text = tweet.text.replace(/[…] http.*/g, `... <a href="${tweet.entities.urls[0].url}" target="_blank">${tweet.entities.urls[0].url}</a>`);
          }


          let obj = {
            userTweet: tweet.text,
            userName: tweet.user.name,
            userHandle: `${tweet.user.screen_name}`,
            userPic: tweet.user.profile_image_url_https
          };
          formattedTweet.push(obj);
        });

        printTweet = function () {
          let currentTweet = formattedTweet[`${count}`];
          let $tweetBlock = $('.tweet-block');
          $tweetBlock.children('.user-pic').children('img')
            .attr('src', `${currentTweet.userPic}`);
          let $userContent = $tweetBlock.children('.user-content');

          $userContent.children('.user-name')
            .text(`${currentTweet.userName}`);

          $userContent.children('.user-handle')
            .html(`<a target="_blank" href="https://www.twitter.com/${currentTweet.userHandle}">@${currentTweet.userHandle}</a>`);

          $userContent.children('.user-tweet')
            .html(`${currentTweet.userTweet}`);


          if (count == (formattedTweet.length - 1)) {
            count = 0;
          } else count++;
        };

        printTweet();

        setInterval(() => {
          printTweet();
        }, 5000);

      }
    });

    let tweetCount = 10;
    let tweetQeury = '@reebok @nike shoe';
    xhr.open(`GET`, `tweets?count=${tweetCount}&q=${tweetQeury}`);
    xhr.send();

    // preload slider images
    setTimeout(function() {
      new Image().src='/images/shoe-blue.png';
      new Image().src='/images/shoe-yellow.png';
      new Image().src='/images/shoe-orange.png';
    }, 1000);

    // Setting up item cost
    $('.priceUsdLabel').text(COST_USD);
    $('.priceInrLabel').text(COST_INR);

    // color selector module
    $('.color-selection li').on('click', function () {
      $(this.parentElement).children().removeClass('active');
      $(this).addClass('active');
      if ($('li.active').length > 2) {
        $('button.btn.btn-danger').removeClass('disabled').removeClass('btn-dark');
      }
    });

    // change shoe color
    $('.right-partition .checkbox input').click(function () {
      let color = this.dataset.color;
      document.querySelectorAll('.shoe-container img').forEach(function (el) {
        $(el).attr('src', `images/shoe-${color}.png`);
      })
    })


  });


})(jQuery);